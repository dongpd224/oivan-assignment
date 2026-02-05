import { Component, OnInit, OnChanges, input, output, computed, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HouseDetailModel, HouseModelModel, HouseStatus, HouseType } from '../../../../domain/src';
import { InputCurrencyDirective } from '@oivan/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'lib-houses-house-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    InputCurrencyDirective
  ],
  templateUrl: './house-form.component.html',
  styleUrl: './house-form.component.scss'
})
export class HouseFormComponent implements OnInit, OnChanges {
  private destroyRef = inject(DestroyRef);

  house = input<HouseDetailModel>();
  houseModels = input<HouseModelModel[]>();
  houses = input<HouseDetailModel[]>([]);
  isSubmitting = input<boolean>(false);

  formSubmit = output<HouseDetailModel>();
  formCancel = output<void>();

  houseForm!: FormGroup;
  mediaList: string[] = [];
  isEditMode = false;

  houseTypeOptions: DropdownOption[] = [];
  statusOptions: DropdownOption[] = [];

  public models = computed(() => this.houseModels()?.map(item => item.model))

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.setupOptions();
    this.setupHouseNumberValidation();
    this.isEditMode = !!this.house();
    
    if (this.house()) {
      this.loadHouseData();
    }
  }

  ngOnChanges() {
    if (this.house() && this.houseForm) {
      this.loadHouseData();
      this.isEditMode = true;
    }
  }

  private initializeForm() {
    this.houseForm = this.fb.group({
      houseNumber: ['', [Validators.required]],
      blockNumber: ['', [Validators.required]],
      landNumber: ['', [Validators.required]],
      houseType: ['', [Validators.required]],
      model: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]],
      status: [HouseStatus.AVAILABLE, [Validators.required]]
    });
  }

  private setupOptions() {
    this.houseTypeOptions = Object.values(HouseType).map(type => ({
      value: type,
      label: type
    }));

    this.statusOptions = Object.values(HouseStatus).map(status => ({
      value: status,
      label: status
    }));
  }

  private setupHouseNumberValidation() {
    this.houseForm.get('houseNumber')?.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      const houseNumberControl = this.houseForm.get('houseNumber');
      const currentHouseId = this.house()?.id;
      
      // Check if houseNumber already exists (excluding current house in edit mode)
      const isDuplicate = this.houses().some(
        h => h.houseNumber === value && h.id !== currentHouseId
      );
      
      if (isDuplicate) {
        houseNumberControl?.setErrors({ ...houseNumberControl.errors, duplicate: true });
      } else if (houseNumberControl?.hasError('duplicate')) {
        const { duplicate, ...otherErrors } = houseNumberControl.errors || {};
        houseNumberControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
    });
  }

  private loadHouseData() {
    const house = this.house();
    if (house) {
      this.houseForm.patchValue({
        houseNumber: house.houseNumber,
        blockNumber: house.blockNumber,
        landNumber: house.landNumber,
        houseType: house.houseType,
        model: house.model,
        price: house.price,
        status: house.status,
      });

      this.mediaList = house.links ? [...house.links.self] : [];
    }
  }

  addMedia(url: string) {
    if (url && url.trim() && !this.mediaList.includes(url.trim())) {
      this.mediaList.push(url.trim());
    }
  }

  removeMedia(index: number) {
    this.mediaList.splice(index, 1);
  }

  onSubmit() {
    if (this.houseForm.valid) {
      const formValue = this.houseForm.value;
      const house = this.house();
      
      const houseData = {
        ...formValue,
        media: this.mediaList.length > 0 ? this.mediaList : undefined,
        id: house?.id,
      };

      const newHouse = new HouseDetailModel(houseData, false);
      this.formSubmit.emit(newHouse);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
}