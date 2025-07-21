import express from 'express';
import { ApiResponse, LoginRequest, RegisterRequest } from '@trusthive/interface-types';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res): void => {
  const response: ApiResponse<{ service: string }> = {
    success: true,
    message: 'Hello World from TrustHive Auth Service!',
    data: { service: 'auth-service' },
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

app.post('/login', (req, res): void => {
  const loginRequest: LoginRequest = req.body;
  
  const response: ApiResponse<{ token: string }> = {
    success: true,
    message: 'Login endpoint (not implemented)',
    data: { token: 'mock-token' },
    timestamp: new Date().toISOString()
  };
  
  // eslint-disable-next-line no-console
  console.log('Login request for:', loginRequest.email);
  res.json(response);
});

app.post('/register', (req, res): void => {
  const registerRequest: RegisterRequest = req.body;
  
  const response: ApiResponse<{ userId: string }> = {
    success: true,
    message: 'Register endpoint (not implemented)',  
    data: { userId: 'mock-user-id' },
    timestamp: new Date().toISOString()
  };
  
  // eslint-disable-next-line no-console
  console.log('Register request for:', registerRequest.email);
  res.json(response);
});

app.listen(port, (): void => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
});
