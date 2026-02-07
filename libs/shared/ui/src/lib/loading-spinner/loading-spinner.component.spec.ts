import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default diameter of 40', () => {
    expect(component.diameter()).toBe(40);
  });

  it('should have default color of primary', () => {
    expect(component.color()).toBe('primary');
  });

  it('should accept custom diameter', () => {
    fixture.componentRef.setInput('diameter', 60);
    fixture.detectChanges();
    expect(component.diameter()).toBe(60);
  });

  it('should accept custom color', () => {
    fixture.componentRef.setInput('color', 'accent');
    fixture.detectChanges();
    expect(component.color()).toBe('accent');
  });

  it('should display message when provided', () => {
    fixture.componentRef.setInput('message', 'Loading data...');
    fixture.detectChanges();
    expect(component.message()).toBe('Loading data...');
  });

  it('should render spinner element', () => {
    const spinner = fixture.nativeElement.querySelector('.spinner-border');
    expect(spinner).toBeTruthy();
  });
});
