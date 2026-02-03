import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousesMaterialModule } from './houses-material.module';

@NgModule({
  imports: [CommonModule, HousesMaterialModule],
  exports: [HousesMaterialModule]
})
export class HousesModule {}
