import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginCredentialsModel } from '@oivan/auth/domain';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('rememberMe')?.value).toBe(false);
  });

  it('should have required validator on email', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('should have email validator on email field', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should have required validator on password', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should be invalid when form is empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should be valid when all required fields are filled correctly', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should emit loginSubmit with credentials when form is valid', () => {
    const submitSpy = vi.fn();
    component.loginSubmit.subscribe(submitSpy);

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true
    });

    component.onSubmit();

    expect(submitSpy).toHaveBeenCalled();
    const emittedCredentials = submitSpy.mock.calls[0][0];
    expect(emittedCredentials).toBeInstanceOf(LoginCredentialsModel);
    expect(emittedCredentials.email).toBe('test@example.com');
    expect(emittedCredentials.password).toBe('password123');
  });

  it('should not emit loginSubmit when form is invalid', () => {
    const submitSpy = vi.fn();
    component.loginSubmit.subscribe(submitSpy);

    component.onSubmit();

    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton?.disabled).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton?.disabled).toBeFalsy();
  });

  it('should disable submit button when loading', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    component.isLoading = true;
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton?.disabled).toBeTruthy();
  });

  it('should show "Logging in..." text when loading', async () => {
    // Create a fresh fixture to avoid ExpressionChangedAfterItHasBeenCheckedError
    const loadingFixture = TestBed.createComponent(LoginFormComponent);
    const loadingComponent = loadingFixture.componentInstance;
    
    // Set isLoading BEFORE first detectChanges
    loadingComponent.isLoading = true;
    loadingFixture.detectChanges();

    const submitButton = loadingFixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton?.textContent).toContain('Logging in...');
    
    loadingFixture.destroy();
  });

  it('should show "Login" text when not loading', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton?.textContent?.trim()).toBe('Login');
  });

  it('should render email input field', () => {
    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    expect(emailInput).toBeTruthy();
  });

  it('should render password input field', () => {
    const passwordInput = fixture.nativeElement.querySelector('input[formControlName="password"]');
    expect(passwordInput).toBeTruthy();
    expect(passwordInput?.type).toBe('password');
  });

  it('should render login card with title', () => {
    const cardTitle = fixture.nativeElement.querySelector('mat-card-title');
    expect(cardTitle?.textContent).toContain('Login');
  });
});
