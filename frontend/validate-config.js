#!/usr/bin/env node

/**
 * Frontend validation script
 * Run before starting the Next.js dev/build process
 */

const { validateFrontendConfig, printFrontendStartupBanner } = require('./app/lib/config-validator');

printFrontendStartupBanner();

const result = validateFrontendConfig();

if (!result.valid) {
  console.error('\n💥 Frontend configuration validation failed!');
  console.error('Fix the errors above before starting the application.\n');
  process.exit(1);
}

console.log('✅ Starting Next.js...\n');
