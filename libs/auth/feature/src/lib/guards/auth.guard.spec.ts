import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthFacade } from '@oivan/auth/data-access';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouter: any;
  let mockAuthFacade: any;

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn()
    };

    mockAuthFacade = {
      isAuthenticated$: of(false)
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthFacade, useValue: mockAuthFacade }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', (done) => {
    mockAuthFacade.isAuthenticated$ = of(true);
    
    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to login when not authenticated', (done) => {
    mockAuthFacade.isAuthenticated$ = of(false);
    
    guard.canActivate().subscribe(result => {
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
      done();
    });
  });
});
