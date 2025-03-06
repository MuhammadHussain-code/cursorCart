#!/usr/bin/env node

/**
 * This script generates a secure random string that can be used for NEXTAUTH_SECRET
 * Run with: node scripts/generate-secret.js
 */

const crypto = require('crypto');

// Generate a secure random string for JWT secret
const secureSecret = crypto.randomBytes(32).toString('hex');

console.log('\n=== NextAuth Secret Generator ===');
console.log('\nAdd this to your .env file:');
console.log('\nNEXTAUTH_SECRET="' + secureSecret + '"');
console.log('\n=================================\n'); 