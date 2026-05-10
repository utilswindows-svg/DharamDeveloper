const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'WindowsUtils API',
    version: '1.2.0',
    description:
      'Complete API documentation for authentication, user profile, settings, two-factor auth, catalog, orders, PayPal payments, downloads, and feedback.',
  },
  servers: [
    { url: 'http://localhost:5000', description: 'Local development' },
    { url: 'https://windowsutils.com', description: 'Production' },
  ],
  tags: [
    { name: 'Auth', description: 'Signup, login, OTP, password reset, social login' },
    { name: 'User', description: 'Profile, settings, password, 2FA' },
    { name: 'Catalog', description: 'Public categories and products' },
    { name: 'Orders', description: 'Billing orders and PayPal payments' },
    { name: 'Downloads', description: 'License downloads and history' },
    { name: 'Feedback', description: 'Submit and list feedback' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Success: {
        type: 'object',
        properties: { success: { type: 'boolean', example: true }, message: { type: 'string' } },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation error' },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          accessToken: { type: 'string', example: 'eyJhbGciOi...' },
          refreshToken: { type: 'string', example: 'eyJhbGciOi...' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', nullable: true },
          avatar: { type: 'string', nullable: true },
          role: { type: 'string', example: 'user' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Settings: {
        type: 'object',
        properties: {
          emailNotifications: { type: 'boolean' },
          smsNotifications: { type: 'boolean' },
          marketingEmails: { type: 'boolean' },
          securityAlerts: { type: 'boolean' },
          twoFactor: { type: 'boolean' },
        },
      },
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
        properties: { refreshToken: { type: 'string' } },
      },
      ForgotPasswordRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', example: '+14155552671' },
          channel: { type: 'string', enum: ['email', 'sms'] },
        },
      },
      VerifyOtpRequest: {
        type: 'object',
        required: ['otp'],
        properties: {
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          otp: { type: 'string', example: '123456' },
          channel: { type: 'string', enum: ['email', 'sms'] },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['newPassword'],
        properties: {
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          newPassword: { type: 'string', format: 'password', example: 'NewStrongPass123' },
          channel: { type: 'string', enum: ['email', 'sms'] },
        },
      },
      SocialLoginRequest: {
        type: 'object',
        required: ['provider', 'accessToken'],
        properties: {
          provider: { type: 'string', enum: ['google', 'facebook'] },
          accessToken: { type: 'string' },
        },
      },
      UpdateProfileRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          phone: { type: 'string', example: '+14155552671' },
          avatar: { type: 'string', example: 'https://cdn.example.com/avatar.png' },
        },
      },
      UpdateSettingsRequest: {
        type: 'object',
        properties: {
          emailNotifications: { type: 'boolean' },
          smsNotifications: { type: 'boolean' },
          marketingEmails: { type: 'boolean' },
          securityAlerts: { type: 'boolean' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', format: 'password' },
          newPassword: { type: 'string', format: 'password' },
        },
      },
      Request2FARequest: {
        type: 'object',
        properties: { enable: { type: 'boolean', example: true } },
      },
      Verify2FARequest: {
        type: 'object',
        required: ['otp'],
        properties: { otp: { type: 'string', example: '123456' } },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          key: { type: 'string', example: 'email-tools' },
          label: { type: 'string', example: 'Email Tools' },
          sortOrder: { type: 'integer' },
          active: { type: 'boolean' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          slug: { type: 'string', example: 'mbox-to-pdf' },
          title: { type: 'string' },
          tagline: { type: 'string' },
          description: { type: 'string' },
          color: { type: 'string', example: 'text-primary' },
          startingPrice: { type: 'number', example: 49 },
          sortOrder: { type: 'integer' },
          active: { type: 'boolean' },
          category: { $ref: '#/components/schemas/Category' },
        },
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'country', 'zip', 'productSlug', 'productTitle', 'licenseName', 'subtotal', 'total'],
        properties: {
          firstName: { type: 'string', example: 'Jane' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', format: 'email' },
          company: { type: 'string' },
          country: { type: 'string', example: 'US' },
          zip: { type: 'string', example: '10001' },
          productSlug: { type: 'string', example: 'mbox-to-pdf' },
          productTitle: { type: 'string' },
          licenseName: { type: 'string', example: 'Personal' },
          licenseIndex: { type: 'integer', example: 0 },
          subtotal: { type: 'number', example: 49 },
          tax: { type: 'number', example: 0 },
          total: { type: 'number', example: 49 },
          currency: { type: 'string', example: 'USD' },
          seats: { type: 'integer', example: 1 },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          productSlug: { type: 'string' },
          productTitle: { type: 'string' },
          licenseName: { type: 'string' },
          licenseIndex: { type: 'integer' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          company: { type: 'string', nullable: true },
          country: { type: 'string' },
          zip: { type: 'string' },
          subtotal: { type: 'number' },
          tax: { type: 'number' },
          total: { type: 'number' },
          currency: { type: 'string' },
          paymentMethod: { type: 'string', example: 'paypal' },
          paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed'] },
          paypalOrderId: { type: 'string', nullable: true },
          paypalCaptureId: { type: 'string', nullable: true },
          payerEmail: { type: 'string', nullable: true },
          licenseKey: { type: 'string', nullable: true },
          expiresAt: { type: 'string', format: 'date-time', nullable: true },
          seats: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CapturePaypalRequest: {
        type: 'object',
        required: ['paypalOrderId'],
        properties: { paypalOrderId: { type: 'string', example: '5O190127TN364715T' } },
      },
      Download: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          orderId: { type: 'integer' },
          name: { type: 'string' },
          productSlug: { type: 'string' },
          version: { type: 'string' },
          purchaseDate: { type: 'string', format: 'date-time' },
          expiryDate: { type: 'string', format: 'date-time', nullable: true },
          status: { type: 'string', enum: ['active', 'expired'] },
          downloadUrl: { type: 'string' },
        },
      },
      DownloadHistoryItem: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          fileName: { type: 'string' },
          product: { type: 'string' },
          productSlug: { type: 'string' },
          version: { type: 'string' },
          size: { type: 'string' },
          device: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      RecordDownloadRequest: {
        type: 'object',
        properties: {
          fileName: { type: 'string' },
          fileSize: { type: 'string' },
          device: { type: 'string' },
        },
      },
      FeedbackRequest: {
        type: 'object',
        required: ['name', 'email', 'message'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email' },
          message: { type: 'string' },
        },
      },
      Feedback: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer', nullable: true },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          message: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Unauthorized',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      ValidationError: {
        description: 'Validation error',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      NotFound: {
        description: 'Resource not found',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      RateLimited: { description: 'Too many requests' },
    },
  },
  paths: {
    // ---------------- AUTH ----------------
    '/api/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Create a new user account',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SignupRequest' } } },
        },
        responses: {
          '201': {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/Success' },
                    { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } },
                    { $ref: '#/components/schemas/AuthTokens' },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '429': { $ref: '#/components/responses/RateLimited' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in with email & password',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          '200': {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/Success' },
                    { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } },
                    { $ref: '#/components/schemas/AuthTokens' },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '429': { $ref: '#/components/responses/RateLimited' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshRequest' } } },
        },
        responses: {
          '200': {
            description: 'New tokens',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthTokens' } } },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset OTP (email or SMS)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } } },
        },
        responses: {
          '200': { description: 'OTP sent if the user exists' },
          '400': { $ref: '#/components/responses/ValidationError' },
          '429': { $ref: '#/components/responses/RateLimited' },
        },
      },
    },
    '/api/auth/verify-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Verify an OTP code',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyOtpRequest' } } },
        },
        responses: {
          '200': { description: 'OTP verified' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password after OTP verification',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } } },
        },
        responses: {
          '200': { description: 'Password reset successful' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/auth/social': {
      post: {
        tags: ['Auth'],
        summary: 'Login or signup via Google / Facebook token',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SocialLoginRequest' } } },
        },
        responses: {
          '200': {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/Success' },
                    { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } },
                    { $ref: '#/components/schemas/AuthTokens' },
                  ],
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout — revoke all refresh tokens for the current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Logged out',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Success' } } },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },

    // ---------------- USER ----------------
    '/api/user/profile': {
      get: {
        tags: ['User'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' }, user: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      put: {
        tags: ['User'],
        summary: 'Update current user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfileRequest' } } },
        },
        responses: {
          '200': {
            description: 'Updated profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' }, user: { $ref: '#/components/schemas/User' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/settings': {
      get: {
        tags: ['User'],
        summary: 'Get user notification & security settings',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Settings',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' }, settings: { $ref: '#/components/schemas/Settings' } },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      put: {
        tags: ['User'],
        summary: 'Update notification settings (2FA excluded — use /2fa endpoints)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateSettingsRequest' } } },
        },
        responses: {
          '200': { description: 'Settings updated' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/change-password': {
      post: {
        tags: ['User'],
        summary: 'Change password (requires current password)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } },
        },
        responses: {
          '200': { description: 'Password updated' },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/2fa/request-otp': {
      post: {
        tags: ['User'],
        summary: 'Request OTP to enable or disable two-factor auth',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Request2FARequest' } } },
        },
        responses: {
          '200': { description: 'OTP sent via email' },
          '400': { $ref: '#/components/responses/ValidationError' },
          '429': { $ref: '#/components/responses/RateLimited' },
        },
      },
    },
    '/api/user/2fa/verify': {
      post: {
        tags: ['User'],
        summary: 'Verify OTP to toggle two-factor auth',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Verify2FARequest' } } },
        },
        responses: {
          '200': { description: '2FA state updated' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },

    // ---------------- CATALOG ----------------
    '/api/catalog/categories': {
      get: {
        tags: ['Catalog'],
        summary: 'List active categories',
        responses: {
          '200': {
            description: 'Categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/catalog/products': {
      get: {
        tags: ['Catalog'],
        summary: 'List products (optionally filtered)',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category key or "all"' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term' },
        ],
        responses: {
          '200': {
            description: 'Products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    categories: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
                    products: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/catalog/products/{slug}': {
      get: {
        tags: ['Catalog'],
        summary: 'Get a product by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Product',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' }, product: { $ref: '#/components/schemas/Product' } },
                },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/catalog/products/{slug}/og.svg': {
      get: {
        tags: ['Catalog'],
        summary: 'Dynamic 1200x630 OpenGraph SVG image',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'SVG image',
            content: { 'image/svg+xml': { schema: { type: 'string', format: 'binary' } } },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ---------------- ORDERS ----------------
    '/api/user/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List current user orders',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Orders',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a billing order (guest-friendly — auto-creates account if needed)',
        security: [{ bearerAuth: [] }, {}],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateOrderRequest' } } },
        },
        responses: {
          '201': {
            description: 'Order created',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/Success' },
                    {
                      type: 'object',
                      properties: {
                        order: { $ref: '#/components/schemas/Order' },
                        user: { $ref: '#/components/schemas/User' },
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' },
                        createdAccount: { type: 'boolean' },
                        tempPassword: { type: 'string', nullable: true },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/api/user/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get an order by ID',
        security: [{ bearerAuth: [] }, {}],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Order',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' }, order: { $ref: '#/components/schemas/Order' } },
                },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/user/orders/{id}/paypal/create': {
      post: {
        tags: ['Orders'],
        summary: 'Create a PayPal order for an existing billing order',
        security: [{ bearerAuth: [] }, {}],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'PayPal order created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' }, paypalOrderId: { type: 'string' } },
                },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/user/orders/{id}/paypal/capture': {
      post: {
        tags: ['Orders'],
        summary: 'Capture a PayPal order after buyer approval',
        security: [{ bearerAuth: [] }, {}],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CapturePaypalRequest' } } },
        },
        responses: {
          '200': {
            description: 'Payment captured — license key emailed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    order: { $ref: '#/components/schemas/Order' },
                    paypal: { type: 'object' },
                  },
                },
              },
            },
          },
          '400': { description: 'Payment not completed' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ---------------- DOWNLOADS ----------------
    '/api/user/downloads': {
      get: {
        tags: ['Downloads'],
        summary: 'List active downloadable licenses for the current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Active downloads',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    downloads: { type: 'array', items: { $ref: '#/components/schemas/Download' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/downloads/history': {
      get: {
        tags: ['Downloads'],
        summary: 'List date-wise download history',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Download history',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    history: { type: 'array', items: { $ref: '#/components/schemas/DownloadHistoryItem' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/api/user/downloads/{orderId}/record': {
      post: {
        tags: ['Downloads'],
        summary: 'Record a download event for a paid order',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: false,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RecordDownloadRequest' } } },
        },
        responses: {
          '201': { description: 'Download recorded' },
          '403': { description: 'Order not paid' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/api/user/admin/downloads': {
      get: {
        tags: ['Downloads'],
        summary: 'Admin: list every download event across all users',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'All download events',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    downloads: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/user/admin/users': {
      get: {
        tags: ['User'],
        summary: 'Admin: list all users with download & purchase stats',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    users: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/user/admin/users/{id}': {
      get: {
        tags: ['User'],
        summary: 'Admin: get a user with their orders and downloads',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'User detail with orders and downloads' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { description: 'Forbidden' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ---------------- FEEDBACK ----------------
    '/api/feedback': {
      post: {
        tags: ['Feedback'],
        summary: 'Submit feedback (public)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/FeedbackRequest' } } },
        },
        responses: {
          '201': {
            description: 'Feedback submitted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    feedback: { $ref: '#/components/schemas/Feedback' },
                  },
                },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
      get: {
        tags: ['Feedback'],
        summary: 'List all feedback (admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Feedback list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    feedback: { type: 'array', items: { $ref: '#/components/schemas/Feedback' } },
                  },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { description: 'Admin role required' },
        },
      },
    },

    // ---------------- HEALTH ----------------
    '/health': {
      get: {
        tags: ['Auth'],
        summary: 'Health check',
        responses: { '200': { description: 'OK' } },
      },
    },
    '/api/user/admin/licenses': {
      get: {
        tags: ['User'],
        summary: 'Admin: list all licenses (derived from paid orders)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'License list',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, licenses: { type: 'array', items: { type: 'object' } } } } } },
          },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { description: 'Admin role required' },
        },
      },
    },
    '/api/user/admin/licenses/{id}/revoke': {
      post: {
        tags: ['User'],
        summary: 'Admin: revoke a license (marks order refunded, expires now)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          '200': { description: 'License revoked', content: { 'application/json': { schema: { $ref: '#/components/schemas/Success' } } } },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '403': { description: 'Admin role required' },
          '404': { description: 'Not found' },
        },
      },
    },
  },
};

module.exports = swaggerSpec;
