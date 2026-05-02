const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Gateway Documentation',
    version: '1.0.0',
    description: 'Central API Gateway documentation aggregating Auth Service, User Service, and Payment Service endpoints.',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Local development gateway' },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and OTP endpoints' },
    { name: 'User', description: 'User profile and account endpoints' },
    { name: 'Payments', description: 'Payment creation and management endpoints' },
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
    '/api/users/profile': {
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
    '/api/payments/create': {
      post: {
        tags: ['Payments'],
        summary: 'Create a new payment request',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePaymentRequest' },
            },
          },
        },
        responses: {
          '201': { description: 'Payment request created successfully' },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/api/payments/status/{paymentId}': {
      get: {
        tags: ['Payments'],
        summary: 'Get payment status by ID',
        parameters: [
          {
            name: 'paymentId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Payment identifier (UUID)',
          },
        ],
        responses: {
          '200': { description: 'Payment status returned' },
          '404': { description: 'Payment not found' },
        },
      },
    },
    '/api/payments/webhook': {
      post: {
        tags: ['Payments'],
        summary: 'Receive payment status updates from webhook providers',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WebhookUpdateRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Webhook processed successfully' },
          '400': { description: 'Validation error' },
          '404': { description: 'Payment not found' },
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
      CreatePaymentRequest: {
        type: 'object',
        required: ['amount', 'customerEmail', 'paymentMethod'],
        properties: {
          amount: { type: 'number', example: 49.99 },
          currency: { type: 'string', example: 'USD' },
          customerEmail: { type: 'string', format: 'email', example: 'customer@example.com' },
          paymentMethod: { type: 'string', example: 'card_visa' },
        },
      },
      WebhookUpdateRequest: {
        type: 'object',
        required: ['paymentId', 'status'],
        properties: {
          paymentId: { type: 'string', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' },
          status: { type: 'string', example: 'completed' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
