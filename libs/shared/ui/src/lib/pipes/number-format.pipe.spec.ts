import { beforeEach, describe, expect, it } from 'vitest';
import { NumberFormatPipe } from './number-format.pipe';

describe('NumberFormatPipe', () => {
  let pipe: NumberFormatPipe;

  beforeEach(() => {
    pipe = new NumberFormatPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number with thousand separators', () => {
    expect(pipe.transform(1000)).toBe('1.000');
    expect(pipe.transform(1000000)).toBe('1.000.000');
    expect(pipe.transform(1234567890)).toBe('1.234.567.890');
  });

  it('should handle small numbers without separators', () => {
    expect(pipe.transform(1)).toBe('1');
    expect(pipe.transform(12)).toBe('12');
    expect(pipe.transform(123)).toBe('123');
  });

  it('should handle string numbers', () => {
    expect(pipe.transform('1000')).toBe('1.000');
    expect(pipe.transform('1000000')).toBe('1.000.000');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for NaN', () => {
    expect(pipe.transform('not a number')).toBe('');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(pipe.transform(-1000)).toBe('-1.000');
    expect(pipe.transform(-1000000)).toBe('-1.000.000');
  });

  it('should handle decimal numbers', () => {
    expect(pipe.transform(1000.5)).toBe('1.000.5');
    expect(pipe.transform(1234567.89)).toBe('1.234.567.89');
  });
});
