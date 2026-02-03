import { Injectable } from '@angular/core';
import { AuthTokenModel } from '@oivan/auth/domain';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  setTokens(tokenModel: AuthTokenModel): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenModel.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenModel.refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, tokenModel.expiresIn.toString());
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getTokenExpiry(): number | null {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry, 10) : null;
  }

  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= expiry * 1000;
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token && !this.isTokenExpired() ? `Bearer ${token}` : null;
  }
}