import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthStore } from '@oivan/auth/data-access';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: any;
  let mockAuthStore: any;

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn()
    };

    mockAuthStore = {
      isAuthenticated$: of(false)
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthStore, useValue: mockAuthStore }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', (done) => {
    mockAuthStore.isAuthenticated$ = of(true);
    
    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to login when not authenticated', (done) => {
    mockAuthStore.isAuthenticated$ = of(false);
    
    guard.canActivate().subscribe(result => {
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
      done();
    });
  });
});