// Main business logic for the auth lambda
// For Lambda, we'll use a simpler approach without full Prisma to keep package size small
import {
  AuthLambdaRequest,
  AuthLambdaResponse,
  LambdaLoginRequest,
  LambdaRegisterRequest,
  LambdaValidateRequest,
  LambdaAuthUser
} from '@trusthive/interface-types';

// Mock data for now - in production, you could use a lightweight DB client
// or call your auth service API endpoints
const mockUsers: { [key: string]: { id: string; email: string; password: string; name?: string } } = {};

export const handleAuth = async (request: AuthLambdaRequest): Promise<AuthLambdaResponse> => {
  const { action } = request;

  switch (action) {
    case 'login':
      return handleLogin(request as LambdaLoginRequest);
    case 'register':
      return handleRegister(request as LambdaRegisterRequest);
    case 'validate':
      return handleValidate(request as LambdaValidateRequest);
    default:
      return {
        statusCode: 400,
        message: 'Invalid action'
      };
  }
};

const handleLogin = async (request: LambdaLoginRequest): Promise<AuthLambdaResponse> => {
  const { email, password } = request;
  
  if (!email || !password) {
    return {
      statusCode: 400,
      message: 'Email and password are required'
    };
  }

  // eslint-disable-next-line no-console
  console.log(`Processing login for: ${email}`);

  // In production, you would:
  // 1. Call your auth service API endpoint
  // 2. Or use a lightweight DB client (not full Prisma)
  // 3. Or use AWS RDS Data API

  // Mock authentication
  const user = mockUsers[email];
  if (!user || user.password !== password) {
    return {
      statusCode: 401,
      message: 'Invalid credentials'
    };
  }

  const authUser: LambdaAuthUser = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  
  return {
    statusCode: 200,
    message: 'Login successful',
    data: {
      token: 'mock-jwt-token',
      user: authUser
    }
  };
};

const handleRegister = async (request: LambdaRegisterRequest): Promise<AuthLambdaResponse> => {
  const { email, password } = request;
  
  if (!email || !password) {
    return {
      statusCode: 400,
      message: 'Email and password are required'
    };
  }

  // eslint-disable-next-line no-console
  console.log(`Processing registration for: ${email}`);

  // Check if user already exists
  if (mockUsers[email]) {
    return {
      statusCode: 409,
      message: 'User already exists'
    };
  }

  // Create user
  const userId = `user_${Date.now()}`;
  mockUsers[email] = {
    id: userId,
    email,
    password,
    name: request.name
  };

  const user: LambdaAuthUser = {
    id: userId,
    email,
    name: request.name
  };
  
  return {
    statusCode: 201,
    message: 'Registration successful',
    data: { user }
  };
};

const handleValidate = async (request: LambdaValidateRequest): Promise<AuthLambdaResponse> => {
  const { token } = request;
  
  if (!token) {
    return {
      statusCode: 400,
      message: 'Token is required'
    };
  }

  // eslint-disable-next-line no-console
  console.log(`Validating token: ${token.substring(0, 10)}...`);

  // Mock token validation
  if (token === 'mock-jwt-token') {
    const user: LambdaAuthUser = { email: 'user@example.com' };
    
    return {
      statusCode: 200,
      message: 'Token is valid',
      data: { user }
    };
  }

  return {
    statusCode: 401,
    message: 'Invalid token'
  };
};

// Export the interface types for use in index.ts
export { AuthLambdaRequest, AuthLambdaResponse };
