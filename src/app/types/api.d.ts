export interface LoginResponse {
  client: {
    name: string;
  };
  token: string;
  refreshToken: string;
}

export interface RegisterResponse {
  client: {
    name: string;
  };
  token: string;
  refreshToken: string;
}

export interface RefreshResponse {
  message?: string;
  token: string;
}
