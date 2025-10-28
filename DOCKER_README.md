# Docker Setup for Auth MERN Application

This document explains how to run the Auth MERN application using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed on your machine
- Docker Compose (usually included with Docker Desktop)

## Quick Start

1. **Clone the repository and navigate to the project root:**
   ```bash
   cd d:\ITITIU20316\Auth_MERN\FS_Auth_ReactJS
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MySQL: localhost:3306
   - Redis: localhost:6379

## Services

### Backend (Node.js/Express + TypeScript)
- **Port:** 5000
- **Build Context:** `./backend`
- **Dependencies:** MySQL, Redis
- **Health Checks:** Waits for MySQL and Redis to be ready

### Frontend (Next.js)
- **Port:** 3000
- **Build Context:** `./frontend`
- **Dependencies:** Backend service

### MySQL Database
- **Port:** 3306
- **Version:** MySQL 8.0
- **Database:** `test`
- **Username:** `root`
- **Password:** `test#1`
- **Initialization:** Runs `init.sql` on first startup

### Redis Cache
- **Port:** 6379
- **Version:** Redis 7 (Alpine)
- **Persistence:** Data stored in Docker volume

## Environment Variables

The docker-compose.yml file includes all necessary environment variables. Key variables:

- `NODE_ENV`: Set to "production"
- `MYSQL_HOST`: Points to the MySQL container
- `REDIS_HOST`: Points to the Redis container
- `JWT_SECRET`: Used for token generation
- `FRONTEND_URL`: CORS configuration

## Docker Commands

### Start services in background:
```bash
docker-compose up -d
```

### Stop all services:
```bash
docker-compose down
```

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
```

### Rebuild and restart:
```bash
docker-compose down
docker-compose up --build
```

### Remove volumes (WARNING: This will delete database data):
```bash
docker-compose down -v
```

## Development vs Production

### Development
For development, you might want to use volume mounts for hot reloading:

```yaml
# Add to backend service in docker-compose.yml
volumes:
  - ./backend/src:/app/src
  - ./backend/package.json:/app/package.json
```

### Production
The current setup is optimized for production with:
- Multi-stage builds for smaller images
- Non-root users for security
- Health checks for reliable deployments
- Proper dependency ordering

## Troubleshooting

### Common Issues:

1. **Port conflicts:**
   - Change ports in docker-compose.yml if 3000, 5000, 3306, or 6379 are in use

2. **Database connection issues:**
   - Ensure MySQL is fully started before backend (health checks handle this)
   - Check the `init.sql` file for proper database setup

3. **Build failures:**
   - Clean Docker cache: `docker system prune -a`
   - Check `.dockerignore` files are not excluding necessary files

4. **Permission issues (Linux/Mac):**
   - Ensure proper file permissions for Docker volumes

### Useful Debug Commands:

```bash
# Check container status
docker-compose ps

# Execute commands in containers
docker exec -it auth_backend sh
docker exec -it auth_mysql mysql -u root -p test

# Check networks
docker network ls
docker network inspect fs_auth_reactjs_auth_network
```

## Database Management

### Connect to MySQL:
```bash
docker exec -it auth_mysql mysql -u root -p test
```

### Backup database:
```bash
docker exec auth_mysql mysqldump -u root -ptest#1 test > backup.sql
```

### Restore database:
```bash
docker exec -i auth_mysql mysql -u root -ptest#1 test < backup.sql
```

## Security Considerations

1. **Environment Variables:** 
   - Don't commit .env files with production secrets
   - Use Docker secrets or external secret management for production

2. **Database Passwords:**
   - Change default passwords before production deployment
   - Use strong, unique passwords

3. **Network Security:**
   - The services communicate over a private Docker network
   - Only necessary ports are exposed to the host

## Scaling

To scale services (e.g., multiple backend instances):

```bash
docker-compose up --scale backend=3
```

Note: You'll need a load balancer for multiple backend instances.

## Production Deployment

For production deployment, consider:

1. Use environment-specific docker-compose files
2. Implement proper logging and monitoring
3. Use external databases for data persistence
4. Set up proper backup strategies
5. Implement health checks and restart policies
6. Use secrets management
7. Set up reverse proxy (nginx) for SSL termination