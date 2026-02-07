import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthFacade } from '@oivan/auth/data-access';
import { of, firstValueFrom, toArray } from 'rxjs';

describe('AuthGuard', () => {
  let mockRouter: Partial<Router>;

  const createGuard = (isAuthenticated: boolean) => {
    mockRouter = {
      navigate: vi.fn()
    };

    const mockAuthFacade = {
      isAuthenticated$: of(isAuthenticated)
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthFacade, useValue: mockAuthFacade }
      ]
    });

    return TestBed.inject(AuthGuard);
  };

  it('should be created', () => {
    const guard = createGuard(false);
    expect(guard).toBeTruthy();
  });

  it('should allow access when authenticated', async () => {
    const guard = createGuard(true);

    const result = await firstValueFrom(guard.canActivate());
    
    expect(result).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect when not authenticated', async () => {
    const guard = createGuard(false);

    const result = await firstValueFrom(guard.canActivate());
    
    expect(result).toBeFalsy();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should take only the first emission', async () => {
    mockRouter = {
      navigate: vi.fn()
    };

    const mockAuthFacade = {
      isAuthenticated$: of(true, false, true)
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: mockRouter },
        { provide: AuthFacade, useValue: mockAuthFacade }
      ]
    });

    const guard = TestBed.inject(AuthGuard);
    
    const emissions = await firstValueFrom(guard.canActivate().pipe(toArray()));
    
    expect(emissions.length).toBe(1);
  });
});
