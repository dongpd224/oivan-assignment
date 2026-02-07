import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthApiService } from './auth-api.service';
import { LoginCredentialsModel } from '@oivan/auth/domain';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  const mockTokenResponse = {
    data: {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600
    },
    meta: { record_count: 1 }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send login request with credentials', () => {
      const credentials = new LoginCredentialsModel({
        email: 'test@example.com',
        password: 'password123'
      }, false);

      service.login(credentials).subscribe(response => {
        expect(response.data).toBeTruthy();
        expect(response.data?.accessToken).toBe('mock-access-token');
      });

      const req = httpMock.expectOne('/api/auth');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.data.type).toBe('auth');
      expect(req.request.body.data.attributes.username).toBe('test@example.com');
      expect(req.request.body.data.attributes.password).toBe('password123');
      req.flush(mockTokenResponse);
    });
  });

  describe('logout', () => {
    it('should send logout request', () => {
      service.logout().subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/auth/logout');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({ data: null, meta: { record_count: 0 } });
    });
  });
});
