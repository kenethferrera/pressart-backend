const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing Backend for Deployment...\n');

// Your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://johnkenethferrera:wXD0pguBwNLhkfC1@pressart-cluster.o22v9ez.mongodb.net/pressart-db?retryWrites=true&w=majority&appName=pressart-cluster';

// Production environment variables
const productionEnv = `PORT=3001
NODE_ENV=production
MONGODB_URI=${MONGODB_URI}
JWT_SECRET=pressart_super_secure_jwt_key_for_production_make_it_very_long_and_random_123456789
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app-name.vercel.app`;

// Create production env file
fs.writeFileSync('.env.production', productionEnv);

console.log('✅ Created .env.production file');
console.log('📝 Production Environment Variables:');
console.log(productionEnv);

// Check if package.json has engines
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (!packageJson.engines) {
  packageJson.engines = { "node": "18.x" };
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('\n✅ Added Node.js version to package.json');
}

// Create Railway deployment instructions
const railwayInstructions = `
🚂 RAILWAY DEPLOYMENT INSTRUCTIONS:

1. Create GitHub Repository:
   - Go to GitHub and create new repo: 'pressart-backend'
   - Don't initialize with README

2. Push Code to GitHub:
   git init
   git add .
   git commit -m "Initial backend deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/pressart-backend.git
   git push -u origin main

3. Deploy on Railway:
   - Go to: https://railway.app
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your pressart-backend repository

4. Environment Variables (Add these in Railway Variables tab):
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=${MONGODB_URI}
   JWT_SECRET=pressart_super_secure_jwt_key_for_production_make_it_very_long_and_random_123456789
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-app-name.vercel.app

5. After deployment, test:
   https://your-backend-name.railway.app/api/health

🎯 Your MongoDB Atlas is already configured and ready!
`;

fs.writeFileSync('RAILWAY_DEPLOYMENT.md', railwayInstructions);
console.log('\n✅ Created RAILWAY_DEPLOYMENT.md with step-by-step instructions');

console.log('\n🎉 Backend is ready for deployment!');
console.log('\n📋 Next Steps:');
console.log('1. Create GitHub repository for backend');
console.log('2. Push code to GitHub');
console.log('3. Deploy to Railway');
console.log('4. Configure environment variables');

console.log('\n🔗 Your MongoDB connection is ready:');
console.log(MONGODB_URI);
