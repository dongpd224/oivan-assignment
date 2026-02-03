import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '@oivan/shared/ui';

@NgModule({
  imports: [CommonModule, SharedMaterialModule],
  exports: [SharedMaterialModule]
})
export class SharedModule {}
