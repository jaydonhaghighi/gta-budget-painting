/**
 * Script to grant admin privileges to a Firebase user
 * Usage: node grant-admin.js <USER_UID>
 */

const https = require('https');

const USER_UID = process.argv[2];
const ADMIN_SECRET = 'gta-admin-2024';
const FUNCTION_URL = 'https://us-central1-gta-budget-painting.cloudfunctions.net/setAdminClaims';

if (!USER_UID) {
  console.error('❌ Error: Please provide a user UID');
  console.log('Usage: node grant-admin.js <USER_UID>');
  console.log('Example: node grant-admin.js abc123def456');
  process.exit(1);
}

const postData = JSON.stringify({
  uid: USER_UID,
  adminSecret: ADMIN_SECRET
});

const options = {
  hostname: 'us-central1-gta-budget-painting.cloudfunctions.net',
  port: 443,
  path: '/setAdminClaims',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🔐 Granting admin privileges...');
console.log('User UID:', USER_UID);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (response.success) {
        console.log('✅ Success! Admin privileges granted to user:', USER_UID);
        console.log('Response:', response.message);
      } else {
        console.error('❌ Error:', response.error);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(postData);
req.end();
