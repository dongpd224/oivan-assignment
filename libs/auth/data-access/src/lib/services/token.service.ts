import { Injectable } from '@angular/core';
import { AuthTokenModel } from '@oivan/auth/domain';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';
  private readonly TOKEN_TTL_MS = 20 * 60 * 1000; // 5 phút

  setTokens(tokenModel: AuthTokenModel): void {
    const expiryTime = Date.now() + this.TOKEN_TTL_MS;
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenModel.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenModel.refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
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
    if(Date.now() >= expiry) {
      this.clearTokens();
      return true;
    };
    return false
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
    return token && !this.isTokenExpired() ? token : null;
  }
}
