import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginCredentialsModel, LOGIN_CREDENTIALS_MAPPING_FIELD } from './login-credentials.model';

describe('LoginCredentialsModel', () => {
  const mockBackendResponse = {
    username: 'test@example.com',
    password: 'password123'
  };

  const mockFrontendData = {
    email: 'test@example.com',
    password: 'password123'
  };

  describe('constructor', () => {
    it('should parse from backend response correctly', () => {
      const credentials = new LoginCredentialsModel(mockBackendResponse, true);

      expect(credentials.email).toBe('test@example.com');
      expect(credentials.password).toBe('password123');
    });

    it('should parse from frontend data correctly', () => {
      const credentials = new LoginCredentialsModel(mockFrontendData, false);

      expect(credentials.email).toBe('test@example.com');
      expect(credentials.password).toBe('password123');
    });
  });

  describe('convertToReqBody', () => {
    it('should convert to request body format', () => {
      const credentials = new LoginCredentialsModel(mockFrontendData, false);
      const reqBody = credentials.convertToReqBody();

      expect(reqBody.data.type).toBe('auth');
      expect(reqBody.data.attributes[LOGIN_CREDENTIALS_MAPPING_FIELD.email]).toBe('test@example.com');
      expect(reqBody.data.attributes[LOGIN_CREDENTIALS_MAPPING_FIELD.password]).toBe('password123');
    });

    it('should have correct structure', () => {
      const credentials = new LoginCredentialsModel(mockFrontendData, false);
      const reqBody = credentials.convertToReqBody();

      expect(reqBody).toHaveProperty('data');
      expect(reqBody.data).toHaveProperty('type');
      expect(reqBody.data).toHaveProperty('attributes');
      expect(reqBody.data.attributes).toHaveProperty('username');
      expect(reqBody.data.attributes).toHaveProperty('password');
    });
  });
});
