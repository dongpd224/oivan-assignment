import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthMaterialModule } from './auth-material.module';

@NgModule({
  imports: [CommonModule, AuthMaterialModule],
  exports: [AuthMaterialModule]
})
export class AuthModule {}
