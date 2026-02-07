import { beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputCurrencyDirective } from './input-currency.directive';

@Component({
  template: `<input [formControl]="control" libInputCurrency>`,
  standalone: true,
  imports: [ReactiveFormsModule, InputCurrencyDirective]
})
class TestHostComponent {
  control = new FormControl<number | null>(null);
}

describe('InputCurrencyDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    inputEl = fixture.nativeElement.querySelector('input');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(inputEl).toBeTruthy();
  });

  it('should format model value to display format', () => {
    component.control.setValue(1000000);
    fixture.detectChanges();
    expect(inputEl.value).toBe('1.000.000');
  });

  it('should format large numbers correctly', () => {
    component.control.setValue(1234567890);
    fixture.detectChanges();
    expect(inputEl.value).toBe('1.234.567.890');
  });

  it('should handle decimal numbers', () => {
    component.control.setValue(1234567.89);
    fixture.detectChanges();
    expect(inputEl.value).toBe('1.234.567,89');
  });

  it('should handle negative numbers', () => {
    component.control.setValue(-500000);
    fixture.detectChanges();
    expect(inputEl.value).toBe('-500.000');
  });

  it('should handle null value', () => {
    component.control.setValue(null);
    fixture.detectChanges();
    expect(inputEl.value).toBe('');
  });

  it('should convert user input to model value', () => {
    inputEl.value = '1.234.567';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.control.value).toBe(1234567);
  });

  it('should handle user input with decimal comma', () => {
    inputEl.value = '1.234.567,89';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.control.value).toBe(1234567.89);
  });

  it('should format display while typing', () => {
    inputEl.value = '1234567';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('1.234.567');
  });

  it('should remove leading zeros', () => {
    inputEl.value = '0123';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('123');
    expect(component.control.value).toBe(123);
  });

  it('should keep single zero before decimal', () => {
    inputEl.value = '0,5';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('0,5');
    expect(component.control.value).toBe(0.5);
  });

  it('should handle empty input', () => {
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.control.value).toBeUndefined();
  });

  it('should strip non-numeric characters', () => {
    inputEl.value = 'abc123def456';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputEl.value).toBe('123.456');
    expect(component.control.value).toBe(123456);
  });

  it('should trigger onTouched on blur', () => {
    inputEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(component.control.touched).toBeTruthy();
  });

  it('should handle zero value', () => {
    component.control.setValue(0);
    fixture.detectChanges();
    expect(inputEl.value).toBe('0');
  });
});
