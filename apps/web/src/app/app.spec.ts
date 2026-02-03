import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { App } from './app';
import { AuthFacade } from '@oivan/auth/feature';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('App', () => {
  let mockAuthFacade: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthFacade = {
      logout: vi.fn(),
      isAuthenticated$: of(false),
      currentUser$: of(null),
      isLoading$: of(false),
      error$: of(null)
    };

    mockRouter = {
      navigate: vi.fn(),
      events: of()
    };

    await TestBed.configureTestingModule({
      imports: [App, NoopAnimationsModule],
      providers: [
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
