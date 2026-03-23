export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
}

export interface DecodedToken {
  id: number;
  correo: string;
  roles: string[];
  permisos: string[];
  iat: number;
  exp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: DecodedToken | null;
  token: string | null;
}