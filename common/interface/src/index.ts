// Main export file for @trusthive/interface-types

// Auth Service interfaces
export * from './auth-service.interface';

// Auth Lambda interfaces  
export * from './auth-lambda.interface';

// Common shared interfaces
export * from './common.interface';

// Re-export for convenience
export {
  AuthServiceRequest,
  AuthServiceResponse,
  User,
  LoginRequest,
  RegisterRequest,
  TokenPayload
} from './auth-service.interface';

export {
  AuthLambdaRequest,
  AuthLambdaResponse,
  LambdaLoginRequest,
  LambdaRegisterRequest,
  LambdaValidateRequest,
  LambdaAuthUser,
  LambdaLoginResponse,
  LambdaRegisterResponse,
  LambdaValidateResponse
} from './auth-lambda.interface';

export {
  ApiResponse,
  PaginationRequest,
  PaginationResponse,
  ErrorResponse,
  BaseEntity,
  HealthCheckResponse
} from './common.interface';
// Updated interface
