
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
   MONGODB_URI=mongodb+srv://johnkenethferrera:wXD0pguBwNLhkfC1@pressart-cluster.o22v9ez.mongodb.net/pressart-db?retryWrites=true&w=majority&appName=pressart-cluster
   JWT_SECRET=pressart_super_secure_jwt_key_for_production_make_it_very_long_and_random_123456789
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=https://your-app-name.vercel.app

5. After deployment, test:
   https://your-backend-name.railway.app/api/health

🎯 Your MongoDB Atlas is already configured and ready!
