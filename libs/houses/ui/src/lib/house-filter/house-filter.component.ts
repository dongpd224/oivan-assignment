import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { HouseFilterModel, HouseType, HouseStatus } from  '../../../../domain/src';

interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'lib-houses-house-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './house-filter.component.html',
  styleUrl: './house-filter.component.scss'
})
export class HouseFilterComponent implements OnInit {
  availableBlocks = input<string[]>([]);
  availableLands = input<string[]>([]);
  initialFilter = input<HouseFilterModel>();
  showCreateButton = input<boolean>(false);

  filterChange = output<HouseFilterModel>();
  filterClear = output<void>();
  createHouse = output<void>();

  filterForm!: FormGroup;
  hasChanges = false;
  hasActiveFilters = false;

  blockOptions: DropdownOption[] = [];
  landOptions: DropdownOption[] = [];
  houseTypeOptions: DropdownOption[] = [];
  statusOptions: DropdownOption[] = [];
  sortByOptions: DropdownOption[] = [];
  sortOrderOptions: DropdownOption[] = [];

  pricePresets = [
    { label: 'Under 500M', min: 0, max: 500000000 },
    { label: '500M - 1B', min: 500000000, max: 1000000000 },
    { label: '1B - 2B', min: 1000000000, max: 2000000000 },
    { label: 'Above 2B', min: 2000000000, max: null }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.setupOptions();
    this.setupFormSubscription();
    
    if (this.initialFilter()) {
      this.loadInitialFilter();
    }
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      blockNumber: [null],
      landNumber: [null],
      houseType: [null],
      status: [null],
      minPrice: [null],
      maxPrice: [null],
      sortBy: ['houseNumber'],
      sortOrder: ['asc']
    });
  }

  private setupOptions() {
    // Block options
    this.blockOptions = this.availableBlocks().map(block => ({
      value: block,
      label: `Block ${block}`
    }));

    // Land options
    this.landOptions = this.availableLands().map(land => ({
      value: land,
      label: `Land ${land}`
    }));

    // House type options
    this.houseTypeOptions = Object.values(HouseType).map(type => ({
      value: type,
      label: type
    }));

    // Status options
    this.statusOptions = Object.values(HouseStatus).map(status => ({
      value: status,
      label: status
    }));

    // Sort by options
    this.sortByOptions = [
      { value: 'houseNumber', label: 'House Number' },
      { value: 'price', label: 'Price' },
      { value: 'createdAt', label: 'Date Added' }
    ];

    // Sort order options
    this.sortOrderOptions = [
      { value: 'asc', label: 'Ascending' },
      { value: 'desc', label: 'Descending' }
    ];
  }

  private setupFormSubscription() {
    this.filterForm.valueChanges.subscribe(() => {
      this.hasChanges = true;
      this.checkActiveFilters();
    });
  }

  private loadInitialFilter() {
    const filter = this.initialFilter();
    if (filter) {
      this.filterForm.patchValue({
        blockNumber: filter.blockNumber,
        landNumber: filter.landNumber,
        houseType: filter.houseType,
        status: filter.status,
        minPrice: filter.priceRange?.min,
        maxPrice: filter.priceRange?.max,
        sortBy: filter.sortBy || 'houseNumber',
        sortOrder: filter.sortOrder || 'asc'
      });
      this.hasChanges = false;
      this.checkActiveFilters();
    }
  }

  private checkActiveFilters() {
    const formValue = this.filterForm.value;
    this.hasActiveFilters = !!(
      formValue.blockNumber ||
      formValue.landNumber ||
      formValue.houseType ||
      formValue.status ||
      formValue.minPrice ||
      formValue.maxPrice
    );
  }

  applyPricePreset(preset: any) {
    this.filterForm.patchValue({
      minPrice: preset.min,
      maxPrice: preset.max
    });
  }

  applyFilter() {
    const formValue = this.filterForm.value;
    
    const filter = new HouseFilterModel({
      blockNumber: formValue.blockNumber,
      landNumber: formValue.landNumber,
      houseType: formValue.houseType,
      status: formValue.status,
      priceRange: (formValue.minPrice || formValue.maxPrice) ? {
        min: formValue.minPrice || 0,
        max: formValue.maxPrice || Number.MAX_SAFE_INTEGER
      } : undefined,
      sortBy: formValue.sortBy,
      sortOrder: formValue.sortOrder
    }, false);

    this.filterChange.emit(filter);
    this.hasChanges = false;
  }

  clearFilter() {
    this.filterForm.reset({
      sortBy: 'houseNumber',
      sortOrder: 'asc'
    });
    this.filterClear.emit();
    this.hasChanges = false;
    this.hasActiveFilters = false;
  }

  onCreateHouse(): void {
    this.createHouse.emit();
  }
}