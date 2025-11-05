# Docker Configuration Updates - November 5, 2025

## Summary of Changes

This document outlines the recent updates made to the Docker configuration for the Auth MERN application, specifically to support file uploads using Multer.

## Changes Made

### 1. Backend Dockerfile (`backend/Dockerfile`)

**Added:**
- Created `/app/uploads` directory with proper permissions
- Changed ownership to `backend:nodejs` user for security

```dockerfile
# Create uploads directory with proper permissions
RUN mkdir -p /app/uploads && chown -R backend:nodejs /app/uploads
```

**Why:** The application now supports file uploads (avatars, images) using Multer. Files need to be stored persistently and the backend user needs write permissions.

### 2. Docker Compose (`docker-compose.yml`)

**Added:**
- Volume mount for uploads: `uploads_data:/app/uploads`
- New named volume: `uploads_data`

**Changes to backend service:**
```yaml
volumes:
  - uploads_data:/app/uploads
```

**Changes to volumes section:**
```yaml
volumes:
  mysql_data:
  redis_data:
  uploads_data:  # New
```

**Why:** Using a Docker volume ensures uploaded files persist even when containers are recreated. This prevents data loss during deployments or restarts.

### 3. Backend .dockerignore

**Added:**
- `uploads` - Exclude local uploads from build context
- `*.md` - Exclude markdown files
- `PLAN.md`, `TOKEN_OPTIMIZATION.md` - Exclude documentation

**Why:** Reduces build context size and prevents local uploads from being copied into the image. Uploads are managed via volume instead.

### 4. Documentation Updates

**Created new files:**
- `DOCKER_COMMANDS.md` - Quick reference for common Docker commands
- `backend/.env.example` - Example environment variables for backend
- `frontend/.env.example` - Example environment variables for frontend

**Updated:**
- `DOCKER_README.md` - Added volumes section and file upload management commands

## Current Docker Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Compose                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Frontend │    │ Backend  │    │  MySQL   │              │
│  │ Next.js  │───▶│ Express  │───▶│ Database │              │
│  │  :3000   │    │  :5000   │    │  :3306   │              │
│  └──────────┘    └────┬─────┘    └──────────┘              │
│                       │                                       │
│                       │          ┌──────────┐                │
│                       └─────────▶│  Redis   │                │
│                                  │  :6379   │                │
│                                  └──────────┘                │
│                                                               │
│  ┌──────────────────── Volumes ───────────────────────┐     │
│  │                                                     │     │
│  │  • mysql_data    (Database persistence)            │     │
│  │  • redis_data    (Cache persistence)               │     │
│  │  • uploads_data  (File uploads - NEW)              │     │
│  │                                                     │     │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  Network: auth_network (bridge)                              │
└─────────────────────────────────────────────────────────────┘
```

## File Upload Flow

1. **Client** → Uploads file to `/api/v1/auth/upload` (or similar endpoint)
2. **Backend** → Multer middleware processes the upload
3. **Multer** → Saves file to `/app/uploads` directory
4. **Docker Volume** → Persists the file in `uploads_data` volume
5. **Backend** → Serves files via static middleware at `/uploads/*`
6. **Client** → Can access uploaded files at `http://localhost:5000/uploads/filename.jpg`

## Testing the Updated Configuration

### 1. Rebuild and Start Services

```powershell
# Stop existing containers
docker-compose down

# Rebuild with new configuration
docker-compose up --build
```

### 2. Verify Uploads Directory

```powershell
# Check if uploads directory exists
docker exec -it auth_backend ls -la /app

# Should show:
# drwxr-xr-x    2 backend  nodejs        4096 Nov  5 00:00 uploads
```

### 3. Test File Upload

```powershell
# After uploading a file through the application
docker exec -it auth_backend ls -la /app/uploads

# Should show uploaded files
```

### 4. Verify Volume Persistence

```powershell
# Upload a file through the app
# Restart the backend container
docker-compose restart backend

# Check if file still exists
docker exec -it auth_backend ls -la /app/uploads

# File should still be there (persisted via volume)
```

## Environment Variables

### Backend Environment Variables (in docker-compose.yml)

All necessary environment variables are already configured in `docker-compose.yml`:
- Database connection (MySQL)
- Cache connection (Redis)
- JWT secrets
- Encryption keys
- CORS configuration

### Local Development (.env files)

For local development (without Docker), use the `.env.example` files:

```powershell
# Backend
cd backend
cp .env.example .env
# Edit .env with your local settings

# Frontend
cd frontend
cp .env.example .env
# Edit .env with your local settings
```

## Volume Management

### Backup Uploads Volume

```powershell
# Create a backup of uploaded files
docker run --rm -v fs_auth_reactjs_uploads_data:/data -v ${PWD}:/backup ubuntu tar czf /backup/uploads-backup.tar.gz -C /data .
```

### Restore Uploads Volume

```powershell
# Restore from backup
docker run --rm -v fs_auth_reactjs_uploads_data:/data -v ${PWD}:/backup ubuntu tar xzf /backup/uploads-backup.tar.gz -C /data
```

### Inspect Volume

```powershell
docker volume inspect fs_auth_reactjs_uploads_data
```

## Security Considerations

### 1. File Permissions
- Backend runs as non-root user (`backend:nodejs`)
- Uploads directory has restricted permissions
- Only backend user can write to uploads

### 2. Volume Isolation
- Each volume is isolated to specific services
- Uploads are not accessible from other containers
- Data persists independently

### 3. Production Recommendations
- Use object storage (AWS S3, Google Cloud Storage) for production
- Implement file size limits in Multer configuration
- Add virus scanning for uploaded files
- Implement proper file validation and sanitization

## Next Steps

1. **Configure Multer** - Set file size limits and allowed file types
2. **Add Validation** - Validate file types, sizes, and contents
3. **Implement Cleanup** - Add cron job to clean up old/unused files
4. **Monitor Storage** - Set up monitoring for volume usage
5. **Production Setup** - Consider using cloud storage for production

## Troubleshooting

### Uploads Not Persisting

```powershell
# Check if volume exists
docker volume ls | Select-String "uploads"

# Check volume mount
docker inspect auth_backend | Select-String "Mounts" -Context 10

# Verify permissions
docker exec -it auth_backend ls -la /app/uploads
```

### Permission Denied Errors

```powershell
# Fix permissions
docker exec -u root -it auth_backend chown -R backend:nodejs /app/uploads
docker exec -u root -it auth_backend chmod -R 755 /app/uploads
```

### Volume Not Found

```powershell
# Recreate volume
docker-compose down
docker volume create fs_auth_reactjs_uploads_data
docker-compose up -d
```

## Resources

- [Docker Volumes Documentation](https://docs.docker.com/storage/volumes/)
- [Docker Compose Volumes](https://docs.docker.com/compose/compose-file/compose-file-v3/#volumes)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Express.js Static Files](https://expressjs.com/en/starter/static-files.html)

## Rollback Instructions

If you need to rollback these changes:

```powershell
# Stop containers
docker-compose down

# Remove the uploads volume (if desired)
docker volume rm fs_auth_reactjs_uploads_data

# Checkout previous version of files
git checkout HEAD~1 backend/Dockerfile
git checkout HEAD~1 docker-compose.yml
git checkout HEAD~1 backend/.dockerignore

# Rebuild
docker-compose up --build
```

---

**Last Updated:** November 5, 2025
**Status:** ✅ Ready for Testing
**Impact:** Low Risk - Only adds new volume, doesn't modify existing functionality
