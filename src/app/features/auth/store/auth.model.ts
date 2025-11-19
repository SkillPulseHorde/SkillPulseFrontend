export interface RegisterRequestProps {
  email: string;
  password: string;
}

export interface LoginRequestProps {
  email: string;
  password: string;
}

export interface LoginResponse {
  userId: string;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}
