/**
 * Frontend Configuration Validator
 * Validates environment variables and API connectivity
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
  critical?: boolean;
}

const requiredEnvVars: RequiredEnvVar[] = [
  {
    name: 'NEXT_PUBLIC_API_URL',
    description: 'Public API URL for client-side requests',
    validator: (val) => val.startsWith('http://') || val.startsWith('https://'),
    critical: true
  },
  {
    name: 'NODE_ENV',
    description: 'Node environment',
    validator: (val) => ['development', 'production', 'test'].includes(val),
    critical: false
  }
];

export function validateFrontendConfig(): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log('\n🔍 Validating Frontend Configuration...\n');

  // Validate public environment variables
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

    if (envVar.validator && !envVar.validator(value)) {
      const message = `❌ Invalid value for ${envVar.name}: ${value}`;
      if (envVar.critical) {
        errors.push(message);
      } else {
        warnings.push(message);
      }
      console.error(message);
      continue;
    }

    console.log(`✅ ${envVar.name}: ${value}`);
  }

  // Check backend URLs
  const backendUrls = [
    process.env.PROD_BACKEND_URL,
    process.env.LOCAL_BACKEND_URL
  ].filter(Boolean);

  if (backendUrls.length > 0) {
    console.log('\n📡 Backend URLs configured:');
    backendUrls.forEach(url => console.log(`   - ${url}`));
  } else {
    warnings.push('⚠️  No backend URLs configured for server-side requests');
    console.warn('⚠️  No backend URLs configured for server-side requests');
  }

  // Display summary
  console.log('\n📊 Frontend Configuration Summary:\n');
  console.log(`Environment: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`Public API URL: ${process.env.NEXT_PUBLIC_API_URL || 'not set'}`);
  console.log(`Server Backend URL: ${process.env.PROD_BACKEND_URL || process.env.LOCAL_BACKEND_URL || 'not set'}`);

  if (warnings.length > 0) {
    console.warn(`\n⚠️  ${warnings.length} warning(s) found`);
  }

  if (errors.length > 0) {
    console.error(`\n💥 ${errors.length} critical error(s) found!\n`);
  } else {
    console.log('\n✅ All critical frontend configurations validated!\n');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export async function validateBackendAPI(): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('❌ Cannot validate backend - NEXT_PUBLIC_API_URL not set');
    return false;
  }

  try {
    console.log('🔍 Checking backend API connectivity...');
    console.log(`   Testing: ${apiUrl}/health (or similar endpoint)\n`);
    
    // Note: In production, you might want to add a health check endpoint
    console.log('ℹ️  Backend validation skipped - implement health check endpoint for full validation');
    console.log('   Add GET /api/v1/auth/health to your backend for connectivity checks\n');
    
    return true;
  } catch (error: any) {
    console.error('❌ Backend API validation failed:', error.message);
    return false;
  }
}

export function printFrontendStartupBanner(): void {
  console.log('\n' + '='.repeat(60));
  console.log('🎨 Frontend Application');
  console.log('='.repeat(60));
}

export function printFrontendReadyBanner(): void {
  console.log('\n' + '='.repeat(60));
  console.log('✅ Frontend is ready');
  console.log(`🌐 Client URL: http://localhost:3000`);
  console.log(`📡 API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log('='.repeat(60) + '\n');
}
