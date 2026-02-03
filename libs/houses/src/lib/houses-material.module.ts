import { NgModule } from '@angular/core';
import { SharedMaterialModule } from '@oivan/shared/ui';

/**
 * Houses Material Module
 * 
 * This module imports the shared Material module and can add
 * any house-specific Material component configurations.
 * 
 * By importing SharedMaterialModule, we get access to all
 * commonly used Material components with consistent theming.
 */
@NgModule({
  imports: [SharedMaterialModule],
  exports: [SharedMaterialModule]
})
export class HousesMaterialModule {}