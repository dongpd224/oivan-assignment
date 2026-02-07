import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderLoginWidgetComponent } from './header-login-widget.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginCredentialsModel } from '@oivan/auth/domain';

describe('HeaderLoginWidgetComponent', () => {
  let component: HeaderLoginWidgetComponent;
  let fixture: ComponentFixture<HeaderLoginWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderLoginWidgetComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderLoginWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should emit loginSubmit with credentials when form is valid', () => {
    const submitSpy = vi.fn();
    component.loginSubmit.subscribe(submitSpy);

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalled();
    const emittedCredentials = submitSpy.mock.calls[0][0];
    expect(emittedCredentials).toBeInstanceOf(LoginCredentialsModel);
    expect(emittedCredentials.email).toBe('test@example.com');
    expect(emittedCredentials.password).toBe('password123');
  });

  it('should render email input field', () => {
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    expect(emailInput).toBeTruthy();
  });

  it('should render password input field', () => {
    const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
    expect(passwordInput).toBeTruthy();
  });
});
