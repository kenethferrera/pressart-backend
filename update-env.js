const fs = require('fs');
const path = require('path');

console.log('🔧 Updating .env file with MongoDB Atlas connection...\n');

// Your MongoDB connection string from Atlas
const MONGODB_URI = 'mongodb+srv://johnkenethferrera:wXD0pguBwNLhkfC1@pressart-cluster.o22v9ez.mongodb.net/pressart-db?retryWrites=true&w=majority&appName=pressart-cluster';

// Updated environment variables
const envContent = `PORT=3001
NODE_ENV=development
MONGODB_URI=${MONGODB_URI}
JWT_SECRET=pressart_super_secret_jwt_key_12345_make_this_random_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
`;

// Update .env file
fs.writeFileSync('.env', envContent);

console.log('✅ Updated .env file with MongoDB Atlas connection');
console.log('📝 Current .env contents:');
console.log(envContent);

console.log('\n🎯 What changed:');
console.log('- Updated MONGODB_URI to use MongoDB Atlas (cloud database)');
console.log('- Kept local development settings for frontend URL and port');

console.log('\n🚀 Your backend can now connect to:');
console.log('✅ MongoDB Atlas cloud database');
console.log('✅ Local frontend on port 3000');
console.log('✅ Ready for Railway deployment');

console.log('\n🧪 Test the connection by running:');
console.log('npm run dev');
console.log('\nThen visit: http://localhost:3001/api/health');
