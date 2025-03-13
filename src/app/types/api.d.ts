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

export interface AccountResponse {
  id: string;
  clientId: string;
  pixi: string;
  suspended: boolean;
  balance: number;
}
