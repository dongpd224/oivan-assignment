import {Directive, ElementRef, HostListener, forwardRef, inject, Input, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

/**
 * Currency Input Directive - Vietnamese Format
 * 
 * Formats currency input using Vietnamese notation:
 * - Thousands separator: dot (.) - e.g., 1.000.000
 * - Decimal separator: comma (,) - e.g., 1.234,56
 * - Supports negative numbers
 * 
 * @example
 * User types: "1234567,89" → Displays: "1.234.567,89" → Model value: 1234567.89
 * User types: "-500000" → Displays: "-500.000" → Model value: -500000
 * User types: "1000,5" → Displays: "1.000,5" → Model value: 1000.5
 * 
 * Model → View conversion:
 * - Model: 1234567.89 → Display: "1.234.567,89"
 * - Model: -500000 → Display: "-500.000"
 * - Model: null/undefined → Display: ""
 */
@Directive({
  selector: '[libInputCurrency]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCurrencyDirective),
      multi: true
    }
  ]
})
export class InputCurrencyDirective implements ControlValueAccessor, OnInit {
  private readonly elementRef = inject(ElementRef);

  @Input() textAlign: 'left' | 'right' | 'center' | '' = '';

  private el: HTMLInputElement;
  private onChange: (value: number | null | undefined) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (this.textAlign) {
      this.el.style.textAlign = this.textAlign;
    }
  }

  writeValue(value: number | null | undefined): void {
    const formattedValue = this.formatFromModel(value);
    this.el.value = formattedValue;
  }

  registerOnChange(fn: (value: number | null | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.disabled = isDisabled;
  }

  /**
   * Handles user input in real-time
   * - Formats display with dots for thousands and comma for decimals
   * - Converts to numeric value for the model
   */
  @HostListener('input', ['$any($event.target).value'])
  onInput(value: string): void {
    const numericString = this.normalize(value);
    const formattedValue = this.formatDisplay(value);
    this.el.value = formattedValue;

    this.onChange(numericString ? Number(numericString) : undefined);
  }

  /**
   * Handles blur event - ensures final value is properly formatted and saved
   */
  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    const numericString = this.normalize(this.el.value);
    this.onChange(numericString ? Number(numericString) : undefined);
  }

  /**
   * Normalizes user input to standard numeric format for the model
   * 
   * Converts Vietnamese format → JavaScript number format:
   * - Input: "1.234.567,89" → Output: "1234567.89"
   * - Input: "-500.000" → Output: "-500000"
   * - Input: "1000,5" → Output: "1000.5"
   * - Input: "0123" → Output: "123" (removes leading zeros)
   * - Input: "0,5" → Output: "0.5" (keeps single zero before decimal)
   * 
   * Handles:
   * - Negative sign (only at start)
   * - Multiple dots (thousands separators) - removes all
   * - Last comma as decimal separator - converts to dot
   * - Invalid characters - strips them out
   * - Leading zeros - removes them (except single zero before decimal)
   */
  private normalize(value: string): string {
    if (!value) return '';
    // Preserve negative sign if at start
    const trimmed = value.trim();
    const isNegative = trimmed.startsWith('-');

    // Remove negative signs except at start
    const cleaned = trimmed.replace(/(?!^)-/g, '');

    // Find last comma (decimal separator in Vietnamese format)
    const decimalIndex = cleaned.lastIndexOf(',');

    let intPart = '';
    let decimalPart = '';

    if (decimalIndex > -1) {
      // Split at decimal comma
      intPart = cleaned.slice(0, decimalIndex).replace(/[^0-9]/g, '');
      decimalPart = cleaned.slice(decimalIndex + 1).replace(/[^0-9]/g, '');
    } else {
      // No decimal part
      intPart = cleaned.replace(/[^0-9]/g, '');
    }

    // Remove leading zeros from integer part
    intPart = this.removeLeadingZeros(intPart);

    if (!intPart && !decimalPart) return '';

    let result = intPart || '0';
    if (decimalIndex > -1 && decimalPart) {
      result += '.' + decimalPart; // Use dot for JavaScript number
    }

    return isNegative ? '-' + result : result;
  }

  /**
   * Formats value for display in Vietnamese currency format
   * 
   * Examples:
   * - Input: "1234567,89" → Output: "1.234.567,89"
   * - Input: "-500000" → Output: "-500.000"
   * - Input: "1000,5" → Output: "1.000,5"
   * - Input: "0123" → Output: "123" (removes leading zeros)
   * - Input: "0,5" → Output: "0,5" (keeps single zero before decimal)
   * 
   * Process:
   * 1. Preserve negative sign
   * 2. Split at last comma (decimal separator)
   * 3. Remove leading zeros from integer part (except single zero before decimal)
   * 4. Add dots every 3 digits in integer part
   * 5. Keep decimal part after comma
   */
  private formatDisplay(value: string): string {
    if (!value) return '';

    const isNegative = value.trim().startsWith('-');

    const decimalIndex = value.lastIndexOf(',');

    let intPart = '';
    let decimalPart = '';

    if (decimalIndex > -1) {
      intPart = value.slice(0, decimalIndex).replace(/[^0-9]/g, '');
      decimalPart = value.slice(decimalIndex + 1).replace(/[^0-9]/g, '');
    } else {
      intPart = value.replace(/[^0-9]/g, '');
    }

    // Remove leading zeros (but keep at least one digit)
    intPart = this.removeLeadingZeros(intPart);

    const withDots = this.addDots(intPart);

    let display = withDots;
    if (decimalIndex > -1) {
      display += ',' + decimalPart;
    }

    return isNegative ? '-' + display : display;
  }

  /**
   * Formats model value (JavaScript number) to Vietnamese display format
   * 
   * Model → Display conversion:
   * - Model: 1234567.89 → Display: "1.234.567,89"
   * - Model: -500000 → Display: "-500.000"
   * - Model: 1000.5 → Display: "1.000,5"
   * - Model: null/undefined → Display: ""
   * 
   * Handles both:
   * - Standard JavaScript numbers (with dot as decimal)
   * - Already formatted strings (with comma as decimal)
   */
  private formatFromModel(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';

    const str = String(value);
    const isNegative = str.startsWith('-');
    const unsigned = isNegative ? str.slice(1) : str;

    const hasDot = unsigned.includes('.');
    const hasComma = unsigned.includes(',');

    // If model already uses comma style, reuse existing logic
    if (hasComma && !hasDot) {
      const formatted = this.formatDisplay(str);
      return formatted;
    }

    let intPart = '';
    let decimalPart = '';

    if (hasDot) {
      // Split at dot (JavaScript decimal separator)
      const [intRaw, decimalRaw = ''] = unsigned.split('.');
      intPart = intRaw.replace(/[^0-9]/g, '') || '0';
      decimalPart = decimalRaw.replace(/[^0-9]/g, '');
    } else {
      intPart = unsigned.replace(/[^0-9]/g, '') || '0';
    }

    const withDots = this.addDots(intPart);

    let result = withDots;
    if (hasDot && decimalPart) {
      result += ',' + decimalPart; // Use comma for Vietnamese format
    }

    if (isNegative) {
      result = '-' + result;
    }

    return result;
  }

  /**
   * Adds thousand separators (dots) to integer part
   * 
   * Examples:
   * - Input: "1234567" → Output: "1.234.567"
   * - Input: "1000" → Output: "1.000"
   * - Input: "500" → Output: "500"
   */
  private addDots(value: string): string {
    value = value.replace(/[^0-9]/g, '');
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /**
   * Removes leading zeros from integer part
   * 
   * Examples:
   * - Input: "0123" → Output: "123"
   * - Input: "00456" → Output: "456"
   * - Input: "0" → Output: "0" (keeps single zero)
   * - Input: "" → Output: "" (empty stays empty)
   * 
   * Note: For decimal numbers like "0,5", the integer part "0" is preserved
   * because it's a single zero, not leading zeros.
   */
  private removeLeadingZeros(value: string): string {
    if (!value) return '';
    // Remove leading zeros but keep at least one digit
    const result = value.replace(/^0+/, '');
    // If all zeros were removed, return single "0"
    return result || '0';
  }
}
