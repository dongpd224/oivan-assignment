import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthUserModel } from '@oivan/auth/domain';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  const mockUser = new AuthUserModel({
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles: ['admin'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }, false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have null user by default', () => {
    expect(component.user()).toBeNull();
  });

  it('should display user when provided', () => {
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
    expect(component.user()).toEqual(mockUser);
  });

  it('should have compact mode false by default', () => {
    expect(component.compact()).toBeFalsy();
  });

  it('should emit editProfile when edit is triggered', () => {
    const editSpy = vi.fn();
    component.editProfile.subscribe(editSpy);

    component.onEditProfile();

    expect(editSpy).toHaveBeenCalled();
  });

  it('should emit logout when logout is triggered', () => {
    const logoutSpy = vi.fn();
    component.logout.subscribe(logoutSpy);

    component.onLogout();

    expect(logoutSpy).toHaveBeenCalled();
  });
});
