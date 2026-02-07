import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject } from 'rxjs';
import { AuthFacade } from '@oivan/auth/data-access';
import { LoginCredentialsModel } from '@oivan/auth/domain';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthFacade: Partial<AuthFacade>;
  let mockSnackBar: Partial<MatSnackBar>;
  let router: Router;
  let isAuthenticatedSubject: Subject<boolean>;
  let errorSubject: Subject<string | null>;

  beforeEach(async () => {
    isAuthenticatedSubject = new Subject();
    errorSubject = new Subject();

    mockAuthFacade = {
      isAuthenticated$: isAuthenticatedSubject.asObservable(),
      error$: errorSubject.asObservable(),
      login: vi.fn()
    };

    mockSnackBar = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authFacade.login when onLogin is called', () => {
    const credentials = new LoginCredentialsModel({
      email: 'test@example.com',
      password: 'password123'
    }, false);

    component.onLogin(credentials);

    expect(mockAuthFacade.login).toHaveBeenCalledWith(credentials);
  });

  it('should navigate to houses on successful login', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const credentials = new LoginCredentialsModel({
      email: 'test@example.com',
      password: 'password123'
    }, false);

    component.onLogin(credentials);
    isAuthenticatedSubject.next(true);

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Login successful!',
      'Close',
      expect.objectContaining({ duration: 3000 })
    );
    expect(navigateSpy).toHaveBeenCalledWith(['/houses']);
  });

  it('should show error snackbar on login failure', () => {
    const credentials = new LoginCredentialsModel({
      email: 'test@example.com',
      password: 'wrongpassword'
    }, false);

    component.onLogin(credentials);
    errorSubject.next('Invalid credentials');

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Invalid credentials',
      'Close',
      expect.objectContaining({ duration: 5000 })
    );
  });

  it('should not show error snackbar when error is empty string', () => {
    const credentials = new LoginCredentialsModel({
      email: 'test@example.com',
      password: 'wrongpassword'
    }, false);

    component.onLogin(credentials);
    errorSubject.next('');

    // Empty string is falsy, so snackbar should not be called
    expect(mockSnackBar.open).not.toHaveBeenCalledWith(
      'Login failed. Please try again.',
      'Close',
      expect.objectContaining({ duration: 5000 })
    );
  });

  it('should show coming soon message on sign up', () => {
    const event = { preventDefault: vi.fn() } as unknown as Event;
    component.onSignUp(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Sign up functionality coming soon!',
      'Close',
      expect.objectContaining({ duration: 3000 })
    );
  });

  it('should render login form component', () => {
    const loginForm = fixture.nativeElement.querySelector('lib-auth-login-form');
    expect(loginForm).toBeTruthy();
  });
});
