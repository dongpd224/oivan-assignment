import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderUserDisplayComponent } from './header-user-display.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HeaderUserDisplayComponent', () => {
  let component: HeaderUserDisplayComponent;
  let fixture: ComponentFixture<HeaderUserDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderUserDisplayComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderUserDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default username', () => {
    expect(component.username()).toBe('Admin');
  });

  it('should display custom username when provided', () => {
    fixture.componentRef.setInput('username', 'John Doe');
    fixture.detectChanges();
    expect(component.username()).toBe('John Doe');
  });

  it('should emit logoutClick when logout is triggered', () => {
    const logoutSpy = vi.fn();
    component.logoutClick.subscribe(logoutSpy);

    component.onLogout();

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should render username in template', () => {
    fixture.componentRef.setInput('username', 'Test User');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test User');
  });
});
