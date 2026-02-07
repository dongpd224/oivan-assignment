import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default type of error', () => {
    expect(component.type()).toBe('error');
  });

  it('should have default showRetry of false', () => {
    expect(component.showRetry()).toBeFalsy();
  });

  it('should return correct icon for error type', () => {
    fixture.componentRef.setInput('type', 'error');
    fixture.detectChanges();
    expect(component.getIcon()).toBe('error');
  });

  it('should return correct icon for warning type', () => {
    fixture.componentRef.setInput('type', 'warning');
    fixture.detectChanges();
    expect(component.getIcon()).toBe('warning');
  });

  it('should return correct icon for info type', () => {
    fixture.componentRef.setInput('type', 'info');
    fixture.detectChanges();
    expect(component.getIcon()).toBe('info');
  });

  it('should display title when provided', () => {
    fixture.componentRef.setInput('title', 'Error Title');
    fixture.detectChanges();
    expect(component.title()).toBe('Error Title');
  });

  it('should display message when provided', () => {
    fixture.componentRef.setInput('message', 'Something went wrong');
    fixture.detectChanges();
    expect(component.message()).toBe('Something went wrong');
  });

  it('should emit retry when retry button is clicked', () => {
    fixture.componentRef.setInput('showRetry', true);
    fixture.detectChanges();

    const retrySpy = vi.fn();
    component.retry.subscribe(retrySpy);

    component.onRetry();

    expect(retrySpy).toHaveBeenCalled();
  });

  it('should show retry button when showRetry is true', () => {
    fixture.componentRef.setInput('showRetry', true);
    fixture.detectChanges();

    const retryButton = fixture.nativeElement.querySelector('button');
    expect(retryButton).toBeTruthy();
  });

  it('should not show retry button when showRetry is false', () => {
    fixture.componentRef.setInput('showRetry', false);
    fixture.detectChanges();

    const retryButton = fixture.nativeElement.querySelector('button');
    expect(retryButton).toBeFalsy();
  });
});
