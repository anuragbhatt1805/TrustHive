// Auth Service interfaces
export interface AuthServiceRequest {
  email?: string;
  password?: string;
  token?: string;
}

export interface AuthServiceResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    user?: {
      id?: string;
      email: string;
      name?: string;
    };
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
