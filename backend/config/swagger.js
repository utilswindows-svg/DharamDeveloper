const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Auth Service API',
    version: '1.0.0',
    description: 'Authentication backend API documentation for signup, login, OTP, password reset, and user profile.',
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local development server' },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and OTP endpoints' },
    { name: 'User', description: 'User profile endpoints' },
  ],
  paths: {
    '/api/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Create a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupRequest' },
            },
          },
        },
        responses: {
          '201': { description: 'User created successfully' },
          '400': { description: 'Validation error' },
          '429': { description: 'Too many requests' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in an existing user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Authentication successful' },
          '400': { description: 'Validation error' },
          '401': { description: 'Invalid credentials' },
          '429': { description: 'Too many requests' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh an access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Refresh successful' },
          '400': { description: 'Invalid request' },
          '401': { description: 'Invalid refresh token' },
          '429': { description: 'Too many requests' },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset OTP',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'OTP sent if user exists' },
          '400': { description: 'Validation error' },
          '429': { description: 'Too many requests' },
        },
      },
    },
    '/api/auth/verify-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Verify an OTP code',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/VerifyOtpRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'OTP verified' },
          '400': { description: 'Validation error' },
          '429': { description: 'Too many requests' },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset a password after OTP verification',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Password reset successful' },
          '400': { description: 'Validation error' },
          '429': { description: 'Too many requests' },
        },
      },
    },
    '/api/user/profile': {
      get: {
        tags: ['User'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile returned' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      SignupRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          phone: { type: 'string', example: '+14155552671' },
          password: { type: 'string', format: 'password', example: 'StrongPass123' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          password: { type: 'string', format: 'password', example: 'StrongPass123' },
        },
      },
      RefreshRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGci...' },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          phone: { type: 'string', example: '+14155552671' },
          channel: { type: 'string', enum: ['email', 'sms'], example: 'email' },
        },
      },
      VerifyOtpRequest: {
        type: 'object',
        required: ['otp'],
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          phone: { type: 'string', example: '+14155552671' },
          otp: { type: 'string', example: '123456' },
          channel: { type: 'string', enum: ['email', 'sms'], example: 'email' },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['newPassword'],
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          phone: { type: 'string', example: '+14155552671' },
          newPassword: { type: 'string', format: 'password', example: 'NewStrongPass123' },
          channel: { type: 'string', enum: ['email', 'sms'], example: 'email' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
