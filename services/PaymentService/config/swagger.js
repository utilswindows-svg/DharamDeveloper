const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Payment Service API',
    version: '1.0.0',
    description: 'API documentation for customer payment creation, status checking, and webhook updates.',
  },
  servers: [
    { url: 'http://localhost:5001', description: 'Local development server' },
  ],
  tags: [
    { name: 'Payments', description: 'Payment creation and status endpoints' },
  ],
  paths: {
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
            description: 'Payment identifier',
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
    schemas: {
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
