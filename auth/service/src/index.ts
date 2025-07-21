import express from 'express';
import { ApiResponse, LoginRequest, RegisterRequest } from '@trusthive/interface-types';
import { UserService, DatabaseUtils, Validators } from '@trusthive/prisma-config';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', async (_req, res): Promise<void> => {
  const healthCheck = await DatabaseUtils.healthCheck();
  const response: ApiResponse<{ service: string; database: typeof healthCheck }> = {
    success: true,
    message: 'Hello World from TrustHive Auth Service!',
    data: { 
      service: 'auth-service',
      database: healthCheck
    },
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

app.post('/login', async (req, res): Promise<void> => {
  const loginRequest: LoginRequest = req.body;
  
  // Validate input
  const validation = Validators.validateLoginInput(loginRequest.email, loginRequest.password);
  if (!validation.valid) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      error: validation.errors.join(', '),
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
    return;
  }

  try {
    // Find user by email
    const user = await UserService.findUserByEmail(loginRequest.email);
    if (!user || user.password !== loginRequest.password) { // In production, hash and compare passwords
      const response: ApiResponse = {
        success: false,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString()
      };
      res.status(401).json(response);
      return;
    }

    const response: ApiResponse<{ token: string; user: { id: string; email: string; name?: string | null } }> = {
      success: true,
      message: 'Login successful',
      data: { 
        token: 'mock-jwt-token', // In production, generate actual JWT
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Login error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
});

app.post('/register', async (req, res): Promise<void> => {
  const registerRequest: RegisterRequest = req.body;
  
  // Validate input
  const validation = Validators.validateRegistrationInput(registerRequest);
  if (!validation.valid) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      error: validation.errors.join(', '),
      timestamp: new Date().toISOString()
    };
    res.status(400).json(response);
    return;
  }

  try {
    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(registerRequest.email);
    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        message: 'User already exists',
        timestamp: new Date().toISOString()
      };
      res.status(409).json(response);
      return;
    }

    // Create new user
    const user = await UserService.createUser({
      email: registerRequest.email,
      password: registerRequest.password, // In production, hash the password
      name: registerRequest.name,
    });

    const response: ApiResponse<{ userId: string; email: string }> = {
      success: true,
      message: 'Registration successful',
      data: { 
        userId: user.id,
        email: user.email
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Register error:', error);
    const response: ApiResponse = {
      success: false,
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    };
    res.status(500).json(response);
  }
});

app.listen(port, (): void => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
