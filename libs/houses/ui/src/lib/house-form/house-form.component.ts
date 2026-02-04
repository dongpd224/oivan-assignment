import { Component, OnInit, OnChanges, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HouseDetailModel, HouseStatus, HouseType } from '../../../../domain/src';

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
    MatChipsModule
  ],
  templateUrl: './house-form.component.html',
  styleUrl: './house-form.component.scss'
})
export class HouseFormComponent implements OnInit, OnChanges {
  house = input<HouseDetailModel>();
  isSubmitting = input<boolean>(false);

  formSubmit = output<HouseDetailModel>();
  formCancel = output<void>();

  houseForm!: FormGroup;
  mediaList: string[] = [];
  isEditMode = false;

  houseTypeOptions: DropdownOption[] = [];
  statusOptions: DropdownOption[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.setupOptions();
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