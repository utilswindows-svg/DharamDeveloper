# API Gateway Documentation

## Overview
The API Gateway is a centralized entry point for all API requests in the microservices architecture. It handles:

- **Request Routing**: Routes requests to the appropriate backend services
- **Request/Response Logging**: Tracks all requests with unique IDs
- **Error Handling**: Centralized error handling and responses
- **Service Discovery**: Manages communication with backend services
- **Health Checks**: Monitors backend service availability

## Architecture

```
Frontend (Nginx) → API Gateway → Backend Services
                                 ├── Auth Service
                                 ├── User Service
                                 ├── MySQL DB
                                 └── Redis Cache
```

## API Endpoints

### Health Check
- **GET** `/health` - Check gateway and backend status

### Authentication Routes
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/signup` - User registration
- **POST** `/api/auth/refresh` - Refresh JWT token
- **POST** `/api/auth/request-otp` - Request OTP
- **POST** `/api/auth/verify-otp` - Verify OTP

### User Routes
- **GET** `/api/users/profile` - Get user profile
- **PUT** `/api/users/profile` - Update user profile
- **GET** `/api/users` - Get all users (admin only)
- **GET** `/api/users/:id` - Get user by ID

## Features

### Request ID Tracking
Every request is assigned a unique UUID that's logged and returned in responses for debugging.

### Error Handling
All errors are caught and formatted consistently:
```json
{
  "success": false,
  "message": "Error description",
  "requestId": "unique-id"
}
```

### Service Communication
The gateway uses axios to proxy requests to backend services with proper header forwarding.

## Environment Variables

```
NODE_ENV=development
GATEWAY_PORT=3001
BACKEND_URL=http://localhost:5000
LOG_LEVEL=debug
```

## Request Flow

1. Client sends request to Frontend (port 3000)
2. Nginx routes `/api/*` requests to API Gateway (port 3001)
3. API Gateway logs request with unique ID
4. Gateway proxies request to appropriate backend service
5. Backend processes request and returns response
6. Gateway logs response status and duration
7. Response is returned to client with request ID

## Adding New Routes

To add a new microservice route:

1. Create a new file in `api-gateway/routes/`
2. Implement proxy endpoints using the `proxyRequest` middleware
3. Import and register in `app.js`
4. Update docker-compose.yml if adding new backend service

Example:
```javascript
const express = require('express');
const { proxyRequest } = require('../middleware/proxy');

const router = express.Router();

router.get('/data', async (req, res, next) => {
  try {
    const result = await proxyRequest('GET', '/api/data', null, {
      'X-Request-ID': req.id,
      Authorization: req.headers.authorization,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

## Docker Deployment

The API Gateway runs as a container in the docker-compose stack:

```bash
docker-compose up --build
```

The gateway will:
- Be accessible at `http://localhost:3001` (internal)
- Be accessible at `http://localhost:3000/api/*` (through frontend)
- Automatically connect to backend service
- Log all requests and errors
