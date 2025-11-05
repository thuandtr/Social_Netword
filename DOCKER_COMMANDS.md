# Docker Quick Reference Commands

## Build and Run

```powershell
# Build and start all services
docker-compose up --build

# Start in detached mode (background)
docker-compose up -d

# Build without cache (fresh build)
docker-compose build --no-cache

# Start specific service
docker-compose up backend
```

## Stop and Remove

```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

## Logs and Monitoring

```powershell
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
docker-compose logs redis

# View last 100 lines
docker-compose logs --tail=100 backend
```

## Container Management

```powershell
# List running containers
docker-compose ps

# List all containers (including stopped)
docker ps -a

# Restart a service
docker-compose restart backend

# Execute command in running container
docker exec -it auth_backend sh
docker exec -it auth_mysql bash
```

## Database Operations

```powershell
# Connect to MySQL
docker exec -it auth_mysql mysql -u root -p test

# Backup database
docker exec auth_mysql mysqldump -u root -ptest#1 test > backup.sql

# Restore database
docker exec -i auth_mysql mysql -u root -ptest#1 test < backup.sql

# View MySQL logs
docker-compose logs mysql
```

## Redis Operations

```powershell
# Connect to Redis CLI
docker exec -it auth_redis redis-cli

# Check Redis keys
docker exec -it auth_redis redis-cli KEYS "*"

# Flush all Redis data
docker exec -it auth_redis redis-cli FLUSHALL
```

## File Upload Management

```powershell
# List uploaded files
docker exec -it auth_backend ls -la /app/uploads

# Copy file from container to local
docker cp auth_backend:/app/uploads/filename.jpg ./filename.jpg

# Copy file from local to container
docker cp ./filename.jpg auth_backend:/app/uploads/filename.jpg

# Check uploads volume
docker volume inspect fs_auth_reactjs_uploads_data
```

## Volume Management

```powershell
# List all volumes
docker volume ls

# Inspect volume
docker volume inspect fs_auth_reactjs_mysql_data
docker volume inspect fs_auth_reactjs_redis_data
docker volume inspect fs_auth_reactjs_uploads_data

# Remove specific volume (when containers are stopped)
docker volume rm fs_auth_reactjs_uploads_data

# Remove all unused volumes
docker volume prune
```

## Network Management

```powershell
# List networks
docker network ls

# Inspect network
docker network inspect fs_auth_reactjs_auth_network

# View network connections
docker network inspect fs_auth_reactjs_auth_network | Select-String "Name"
```

## Debugging

```powershell
# Check container status
docker-compose ps

# View container resource usage
docker stats

# Inspect container details
docker inspect auth_backend

# View backend environment variables
docker exec -it auth_backend env

# Test backend connection from frontend container
docker exec -it auth_frontend wget -O- http://backend:5000/api/v1/auth/test
```

## Cleanup

```powershell
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused resources (containers, networks, images, volumes)
docker system prune -a

# Remove everything and start fresh (CAUTION)
docker-compose down -v; docker system prune -a -f
```

## Development Tips

```powershell
# Rebuild only backend
docker-compose build backend
docker-compose up -d backend

# View real-time logs for debugging
docker-compose logs -f backend frontend

# Shell into backend for debugging
docker exec -it auth_backend sh

# Check if services are healthy
docker-compose ps
```

## Production Deployment

```powershell
# Pull latest images
docker-compose pull

# Build for production
docker-compose -f docker-compose.yml build

# Deploy
docker-compose up -d

# Check health
docker-compose ps
docker-compose logs --tail=50
```

## Troubleshooting Common Issues

```powershell
# Port already in use
# Stop the process using the port or change the port in docker-compose.yml

# Database connection refused
docker-compose logs mysql
docker exec -it auth_mysql mysqladmin -u root -ptest#1 ping

# Redis not responding
docker exec -it auth_redis redis-cli ping

# Backend build fails
docker-compose build --no-cache backend
docker-compose logs backend

# File permissions issues (uploads)
docker exec -it auth_backend ls -la /app/uploads
docker exec -u root -it auth_backend chown -R backend:nodejs /app/uploads
```
