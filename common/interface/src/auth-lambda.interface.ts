// Auth Lambda interfaces
export interface AuthLambdaRequest {
  action: string;
  email?: string;
  password?: string;
  token?: string;
  name?: string;
}

export interface AuthLambdaResponse {
  statusCode: number;
  message: string;
  data?: unknown;
}

export interface LambdaLoginRequest {
  action: 'login';
  email: string;
  password: string;
}

export interface LambdaRegisterRequest {
  action: 'register';
  email: string;
  password: string;
  name?: string;
}

export interface LambdaValidateRequest {
  action: 'validate';
  token: string;
}

export interface LambdaAuthUser {
  id?: string;
  email: string;
  name?: string;
}

export interface LambdaLoginResponse extends AuthLambdaResponse {
  data?: {
    token: string;
    user: LambdaAuthUser;
  };
}

export interface LambdaRegisterResponse extends AuthLambdaResponse {
  data?: {
    user: LambdaAuthUser;
  };
}

export interface LambdaValidateResponse extends AuthLambdaResponse {
  data?: {
    user: LambdaAuthUser;
  };
}
