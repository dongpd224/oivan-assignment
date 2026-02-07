import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { App } from './app.component';
import { AuthFacade } from '@oivan/auth/data-access';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('App', () => {
  let mockAuthFacade: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthFacade = {
      logout: vi.fn(),
      login: vi.fn(),
      initAuth: vi.fn(),
      isAuthenticated$: of(false),
      isAuthenticatedSignal: signal(false),
      currentUser$: of(null),
      isLoading$: of(false),
      error$: of(null)
    };

    mockRouter = {
      navigate: vi.fn(),
      events: of()
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideNoopAnimations(),
        { provide: AuthFacade, useValue: mockAuthFacade },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  it('should render app title in toolbar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-title')?.textContent).toContain('House Management System');
  });
});
