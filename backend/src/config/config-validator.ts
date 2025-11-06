/**
 * Configuration Validator
 * Validates all required environment variables and connections on startup
 * Prevents runtime errors by catching misconfigurations early
 */

interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface RequiredEnvVar {
  name: string;
  description: string;
  validator?: (value: string) => boolean;
  critical?: boolean; // If true, app won't start without it
}

const requiredEnvVars: RequiredEnvVar[] = [
  {
    name: 'PORT',
    description: 'Server port',
    validator: (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 65536,
    critical: true
  },
  {
    name: 'NODE_ENV',
    description: 'Node environment',
    validator: (val) => ['development', 'production', 'test'].includes(val),
    critical: true
  },
  {
    name: 'MYSQL_HOST',
    description: 'MySQL host',
    critical: true
  },
  {
    name: 'MYSQL_PORT',
    description: 'MySQL port',
    validator: (val) => !isNaN(Number(val)) && Number(val) > 0,
    critical: true
  },
  {
    name: 'MYSQL_USER',
    description: 'MySQL user',
    critical: true
  },
  {
    name: 'MYSQL_PASSWORD',
    description: 'MySQL password',
    critical: true
  },
  {
    name: 'MYSQL_DATABASE',
    description: 'MySQL database name',
    critical: true
  },
  {
    name: 'JWT_SECRET',
    description: 'JWT secret key',
    validator: (val) => val.length >= 32,
    critical: true
  },
  {
    name: 'ENCRYPTION_KEY',
    description: 'Encryption key for sensitive data',
    critical: true
  },
  {
    name: 'ENCRYPTION_IV',
    description: 'Encryption initialization vector',
    validator: (val) => val.length === 16,
    critical: true
  },
  {
    name: 'COOKIE_SECRET',
    description: 'Cookie secret key',
    critical: true
  },
  {
    name: 'FRONTEND_URL',
    description: 'Frontend URL for CORS',
    validator: (val) => val.startsWith('http://') || val.startsWith('https://'),
    critical: true
  },
  {
    name: 'REDIS_HOST',
    description: 'Redis host',
    critical: true
  },
  {
    name: 'REDIS_PORT',
    description: 'Redis port',
    validator: (val) => !isNaN(Number(val)) && Number(val) > 0,
    critical: true
  }
];

export function validateConfiguration(): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log('\n🔍 Validating Backend Configuration...\n');

  // Validate environment variables
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.name];

    if (!value) {
      const message = `❌ Missing ${envVar.critical ? 'CRITICAL' : 'required'} environment variable: ${envVar.name} (${envVar.description})`;
      if (envVar.critical) {
        errors.push(message);
      } else {
        warnings.push(message);
      }
      console.error(message);
      continue;
    }

    // Validate value format if validator provided
    if (envVar.validator && !envVar.validator(value)) {
      const message = `❌ Invalid value for ${envVar.name}: ${value} (${envVar.description})`;
      if (envVar.critical) {
        errors.push(message);
      } else {
        warnings.push(message);
      }
      console.error(message);
      continue;
    }

    console.log(`✅ ${envVar.name}: ${maskSensitive(envVar.name, value)}`);
  }

  // Display summary
  console.log('\n📊 Configuration Summary:\n');
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Port: ${process.env.PORT}`);
  console.log(`MySQL: ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`);
  console.log(`Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`API Base: /api/v1/auth`);

  if (warnings.length > 0) {
    console.warn(`\n⚠️  ${warnings.length} warning(s) found`);
  }

  if (errors.length > 0) {
    console.error(`\n💥 ${errors.length} critical error(s) found - Application cannot start!\n`);
  } else {
    console.log('\n✅ All critical configurations validated successfully!\n');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export async function validateDatabaseConnection(): Promise<boolean> {
  try {
    console.log('🔍 Validating MySQL connection...');
    const mysql = require('mysql2/promise');
    
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    });

    await connection.ping();
    await connection.end();
    
    console.log('✅ MySQL connection successful\n');
    return true;
  } catch (error: any) {
    console.error('❌ MySQL connection failed:', error.message);
    console.error('   Check your database configuration and ensure MySQL is running\n');
    return false;
  }
}

export async function validateRedisConnection(): Promise<boolean> {
  try {
    console.log('🔍 Validating Redis connection...');
    const redis = require('redis');
    
    const client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });

    await client.connect();
    await client.ping();
    await client.quit();
    
    console.log('✅ Redis connection successful\n');
    return true;
  } catch (error: any) {
    console.error('❌ Redis connection failed:', error.message);
    console.error('   Check your Redis configuration and ensure Redis is running\n');
    return false;
  }
}

export async function validateAllConnections(): Promise<boolean> {
  console.log('\n🔗 Validating Service Connections...\n');
  
  const mysqlOk = await validateDatabaseConnection();
  const redisOk = await validateRedisConnection();
  
  if (mysqlOk && redisOk) {
    console.log('✅ All service connections validated successfully!\n');
    return true;
  }
  
  console.error('💥 One or more service connections failed!\n');
  return false;
}

function maskSensitive(key: string, value: string): string {
  const sensitiveKeys = ['PASSWORD', 'SECRET', 'KEY', 'IV'];
  
  if (sensitiveKeys.some(k => key.includes(k))) {
    return value.substring(0, 4) + '****' + value.substring(value.length - 4);
  }
  
  return value;
}

export function printStartupBanner(): void {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Backend Authentication Server');
  console.log('='.repeat(60));
}

export function printReadyBanner(port: string | number): void {
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Server is ready and listening on port ${port}`);
  console.log(`🌐 API: http://localhost:${port}/api/v1/auth`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log('='.repeat(60) + '\n');
}
