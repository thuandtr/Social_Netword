# 🚀 Docker Quick Start Guide

## Prerequisites
- Docker Desktop installed and running
- PowerShell or Command Prompt

## Start the Application

### Option 1: Quick Start (Recommended)
```powershell
# Navigate to project root
cd d:\ITITIU20316\Auth_MERN\FS_Auth_ReactJS

# Build and start all services
docker-compose up --build
```

### Option 2: Background Mode
```powershell
# Start in detached mode (runs in background)
docker-compose up -d --build

# View logs
docker-compose logs -f
```

## Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

## Common Commands

```powershell
# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Check status
docker-compose ps
```

## First Time Setup

1. **Start Docker Desktop**
2. **Open PowerShell in project root**
3. **Run the application**:
   ```powershell
   docker-compose up --build
   ```
4. **Wait for all services to start** (usually 1-2 minutes)
5. **Open browser** to http://localhost:3000

## Troubleshooting

### Port Already in Use
```powershell
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Stop the process or change ports in docker-compose.yml
```

### Services Won't Start
```powershell
# Clean rebuild
docker-compose down -v
docker-compose up --build
```

### Database Connection Issues
```powershell
# Check MySQL is running
docker-compose logs mysql

# Wait for "ready for connections" message
```

## Need More Help?

- See `DOCKER_COMMANDS.md` for detailed commands
- See `DOCKER_README.md` for complete documentation
- See `DOCKER_UPDATE_SUMMARY.md` for recent changes
