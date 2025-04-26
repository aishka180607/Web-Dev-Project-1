export interface LoginResponse {
  access: string; // JWT access token
  refresh: string; // JWT refresh token
}

export interface RefreshTokenResponse {
  access: string; // New JWT access token
}
