# SITAtlas - Development Documentation

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm/yarn package manager
- Docker & Docker Compose (for containerized deployment)
- MongoDB 4.4.x or higher
- Git

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/sitatlas.git
cd sitatlas
```

#### 2. Install dependencies

```bash
# Using yarn (recommended)
yarn install

# Or using npm
npm install
```

#### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/sitatlas
DATABASE_NAME=sitatlas

# PayloadCMS
PAYLOAD_SECRET=your-secret-key-min-32-chars
PAYLOAD_CONFIG_PATH=src/payload/payload.config.ts

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# OpenAI (for chatbot)
OPENAI_API_KEY=your-openai-api-key
OPENAI_ASSISTANT_ID=your-assistant-id

# Security
CSP_REPORT_URI=/api/csp-report
CORS_ORIGINS=http://localhost:3000
```

### Development Setup

#### Option 1: Local Development

```bash
# Start development server
yarn dev

# The application will be available at:
# - Frontend: http://localhost:3000
# - PayloadCMS Admin: http://localhost:3000/admin
```

#### Option 2: Docker Development

```bash
# Build and start containers
docker-compose -f docker-compose.dev.yml up --build

# Stop containers
docker-compose -f docker-compose.dev.yml down
```

### Database Seeding

```bash
# Seed the database with initial campus data
yarn seed

# This will:
# - Clear existing data
# - Import GeoJSON campus data
# - Create default admin user
# - Set up initial collections
```

### Production Deployment

#### Building for Production

```bash
# Build the application
yarn build

# Start production server
yarn serve
```

#### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### NGINX Configuration

For production deployment with NGINX:

```nginx
server {
    listen 80;
    server_name sitatlas.com www.sitatlas.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sitatlas.com;

    ssl_certificate /etc/letsencrypt/live/sitatlas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sitatlas.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Certificate Setup

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d sitatlas.com -d www.sitatlas.com

# Enable auto-renewal
sudo systemctl enable certbot.timer
```

---

## 📚 API Documentation

### GraphQL API

The main API endpoint for GraphQL queries:

```
POST /api/graphql
```

#### Example Query: Fetch Campus Features

```graphql
query GetCampusFeatures($level: Int!) {
  Features(where: { level: { equals: $level } }) {
    docs {
      id
      name
      type
      level
      block
      room
      amenities
      geometry {
        type
        coordinates
      }
    }
  }
}
```

### REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/features` | GET | Get all campus features |
| `/api/features/:id` | GET | Get specific feature details |
| `/api/search` | POST | Search for locations |
| `/api/route` | POST | Calculate route between points |
| `/api/chatbot` | POST | Chat with AI assistant |
| `/api/auth/login` | POST | User authentication |
| `/api/auth/logout` | POST | User logout |

### WebSocket Events

For real-time updates:

```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://sitatlas.com/ws');

// Listen for events
ws.on('room-update', (data) => {
  // Handle room availability updates
});

ws.on('navigation-update', (data) => {
  // Handle navigation updates
});
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run unit tests
yarn test:unit

# Run integration tests
yarn test:integration

# Run E2E tests with Playwright
yarn test:e2e

# Run E2E tests in headed mode
yarn test:e2e --headed

# Generate test report
yarn test:report
```

### Test Coverage

```bash
# Generate coverage report
yarn test:coverage

# View coverage report
open coverage/index.html
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('Campus navigation flow', async ({ page }) => {
  await page.goto('http://localhost:3000/maps');
  
  // Enable indoor mapping
  await page.getByRole('button', { name: 'Enable Indoor Map' }).click();
  
  // Search for location
  await page.getByPlaceholder('Search for a room').fill('Lecture Hall');
  await page.getByRole('option', { name: 'Lecture Hall 1' }).click();
  
  // Verify navigation
  await expect(page.getByText('Route to Lecture Hall 1')).toBeVisible();
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The project uses GitHub Actions for continuous integration and deployment:

<div align="center">
  <img src="assets-docs/cicd.png" alt="CI/CD Pipeline" width="70%">
</div>

#### CI Pipeline (`.github/workflows/docker-ci.yml`)

- **Trigger**: Push to `main` or `develop` branches
- **Steps**:
  1. Checkout code
  2. Setup Node.js environment
  3. Install dependencies
  4. Run linting
  5. Run unit tests
  6. Run integration tests
  7. Build application
  8. Run E2E tests
  9. Scan for vulnerabilities
  10. Build Docker image
  11. Push to DockerHub

#### CD Pipeline (`.github/workflows/docker-cd.yml`)

- **Trigger**: Successful CI pipeline on `main` branch
- **Steps**:
  1. Deploy to staging environment
  2. Run smoke tests
  3. Deploy to production
  4. Run health checks
  5. Notify team on Slack

### Manual Deployment

```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```


---