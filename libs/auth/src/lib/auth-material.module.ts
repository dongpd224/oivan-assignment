import { NgModule } from '@angular/core';
import { SharedMaterialModule } from '@oivan/shared/ui';

/**
 * Auth Material Module
 * 
 * This module imports the shared Material module and can add
 * any authentication-specific Material component configurations.
 * 
 * By importing SharedMaterialModule, we get access to all
 * commonly used Material components with consistent theming.
 */
@NgModule({
  imports: [SharedMaterialModule],
  exports: [SharedMaterialModule]
})
export class AuthMaterialModule {}