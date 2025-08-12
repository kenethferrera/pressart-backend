const fs = require('fs');
const path = require('path');

// Update .env file to use port 3001
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update port from 5000 to 3001
  envContent = envContent.replace('PORT=5000', 'PORT=3001');
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated backend port to 3001');
  console.log('📝 Updated .env file:');
  console.log(envContent);
} else {
  // Create new .env file with port 3001
  const newEnvContent = `PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pressart-db
JWT_SECRET=pressart_super_secret_jwt_key_12345_make_this_random_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
`;
  
  fs.writeFileSync(envPath, newEnvContent);
  console.log('✅ Created .env file with port 3001');
  console.log('📝 Created .env file:');
  console.log(newEnvContent);
}

console.log('\n🚀 Backend will now run on: http://localhost:3001');
console.log('📊 Health check: http://localhost:3001/api/health');
