// Common shared interfaces across all services

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  code?: string;
  statusCode: number;
  timestamp: string;
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  dependencies?: {
    [key: string]: {
      status: 'healthy' | 'unhealthy';
      responseTime?: number;
      error?: string;
    };
  };
}
