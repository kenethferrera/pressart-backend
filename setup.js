const fs = require('fs');
const path = require('path');

// Create .env file if it doesn't exist
const envContent = `PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pressart-db
JWT_SECRET=pressart_super_secret_jwt_key_12345_make_this_random_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Contents:');
  console.log(envContent);
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🔧 Setup Instructions:');
console.log('1. Install MongoDB Community Server from: https://www.mongodb.com/try/download/community');
console.log('2. Make sure MongoDB service is running');
console.log('3. Run: npm run dev');
console.log('\n📊 You can also use MongoDB Atlas (cloud) instead of local installation');
console.log('Just replace MONGODB_URI in .env with your Atlas connection string');

console.log('\n🚀 To test the server without MongoDB:');
console.log('The server will show a connection error, but the API endpoints will be visible');
