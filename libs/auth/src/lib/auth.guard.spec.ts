import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from '../../feature/src/lib/guards/auth.guard';
import { AuthStore } from '../../data-access/src/lib/auth.store';
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

  it('should allow access when authenticated', async () => {
    mockAuthStore.isAuthenticated$ = of(true);
    
    const result = await guard.canActivate().toPromise();
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when not authenticated', async () => {
    mockAuthStore.isAuthenticated$ = of(false);
    
    const result = await guard.canActivate().toPromise();
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});