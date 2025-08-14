# PressArt Digital Art Store - Project Guide

## Project Overview
A React-based digital art store with lazy loading, checkout chatbot, image previews, and category management.

## Tech Stack
- **Frontend**: React 18.2.0, React Router 6.3.0
- **Styling**: Tailwind CSS 3.3.0
- **Animations**: Framer Motion 10.16.4
- **Notifications**: React Hot Toast 2.4.1
- **Build Tool**: Create React App 5.0.1

## Project Structure
```
src/
├── components/
│   ├── CategoryCard.js          # Category display cards
│   ├── CheckoutChatbot.js       # Floating checkout interface
│   ├── HeaderCarousel.js        # Homepage carousel
│   ├── ImageModal.js            # Full-screen image viewer
│   ├── LazyImage.js             # Lazy loading image component
│   ├── Navigation.js            # Main navigation bar
│   ├── PerformanceDashboard.js  # Performance monitoring (dev only)
│   ├── SimpleImageTest.js       # Individual image display
│   └── TestimonialsCarousel.js  # Customer testimonials
├── config/
│   └── categories.js            # Category definitions and image paths
├── context/
│   └── AuthContext.js           # Authentication context
├── hooks/
│   └── useLazyLoad.js           # Custom lazy loading hook
├── pages/
│   ├── About.js                 # About page
│   ├── CategoryPage.js          # Category detail page
│   ├── Contact.js               # Contact page
│   ├── CustomDecorPage.js       # Custom decor request page
│   ├── Home.js                  # Homepage
│   ├── Login.js                 # Login page
│   └── Shop.js                  # Shop page
├── utils/
│   ├── consoleFilter.js         # Console log filtering
│   └── performance.js           # Performance monitoring
├── App.js                       # Main app component
├── index.js                     # Entry point
└── index.css                    # Global styles

public/
├── Images/                      # All category images
│   ├── Among Us/

│   ├── Collage/
│   ├── DC Heroes/
│   ├── Digital Illustration/
│   ├── Doodle Art/
│   ├── Esoteric/
│   ├── League of Legends/
│   ├── Mortal Kombat/
│   ├── Motavational/
│   ├── Paintings/
│   ├── Religion/
│   └── Space/
├── custom-decor-icon.svg        # Custom category icon
├── placeholder-image.svg        # Image placeholder
└── manifest.json               # PWA manifest
```

## Key Features

### 1. Lazy Loading System
**Files**: `src/components/LazyImage.js`, `src/hooks/useLazyLoad.js`
- Image loading with loading states
- Placeholder display during loading
- Smooth opacity transitions
- Error handling for failed loads
- Performance optimization with lazy loading

### 2. Checkout Chatbot System
**File**: `src/components/CheckoutChatbot.js`
- Draggable floating button (middle-right/left only)
- Item code input with paste functionality
- Size and quantity selection
- Cart management with edit capabilities
- Image preview from cart items
- Recent items appear first

### 3. Image Modal System
**File**: `src/components/ImageModal.js`
- Full-screen image viewing with animations
- Navigation between images with arrow keys
- Copy item code functionality
- Keyboard navigation (ESC to close, arrow keys)
- Configurable info display

### 4. Category Management System
**File**: `src/config/categories.js`
- Category definitions with IDs, names, and descriptions
- Preview image paths for each category
- Custom category support for special features
- Image file mapping for each category

### 5. Category Page with Image Grid
**File**: `src/pages/CategoryPage.js`
- Dynamic image loading based on category selection
- Item code generation from filenames
- Modal integration for full-screen viewing
- Loading states with skeleton placeholders
- Error handling for missing images
- Infinite re-render prevention with proper useEffect dependencies

### 6. Performance Optimizations
**Files**: `src/utils/performance.js`
- Performance monitoring and optimization
- Image loading optimization
- Performance metrics tracking

### 7. Console Filtering System
**File**: `src/utils/consoleFilter.js`
- Customizable keyword filtering
- Preserves important error messages
- Reduces console noise in development
- Configurable blocked keywords

### 8. Google OAuth Authentication System
**Files**: `src/components/GoogleOAuthButton.js`, `src/context/AuthContext.js`
- Google OAuth integration with @react-oauth/google
- JWT token validation and expiration checking
- Secure localStorage session management
- Automatic logout on token expiration
- Protected routes with authentication checks
- User session persistence across browser sessions
- Error handling for authentication failures

## Critical Fixes Applied

### 1. Infinite Re-render Prevention
**Problem**: CategoryPage useEffect had `images.length` in dependency array causing infinite loops
**Solution**: Removed `images.length` from dependencies, added refs to track initialization

### 2. Motion Animation Flicker Fix
**Problem**: All motion components had `initial={{ opacity: 0 }}` causing page flicker
**Solution**: Set `initial={false}` for all motion components

### 3. Auto-rotation Disabled
**Problem**: HeaderCarousel and TestimonialsCarousel auto-rotation caused blinking
**Solution**: Temporarily disabled auto-rotation intervals

### 4. Image Path Corrections
**Problem**: HeaderCarousel used wrong file extensions (.jpg/.png instead of .avif)
**Solution**: Updated all image paths to use correct .avif extensions

### 5. StrictMode Disabled in Development
**Problem**: React 18 StrictMode caused double-mounting and visible re-renders
**Solution**: Disabled StrictMode in development mode

## Setup Instructions

### 1. Create New React Project
```bash
npx create-react-app digital-art-store
cd digital-art-store
```

### 2. Install Dependencies
```bash
npm install react-router-dom framer-motion react-hot-toast @react-oauth/google jwt-decode
npm install -D tailwindcss autoprefixer postcss
```

### 3. Configure Tailwind CSS
```bash
npx tailwindcss init -p
```

**tailwind.config.js**:
- Content paths for all React components
- Custom color palette with primary and secondary colors
- Extended theme configuration
- Plugin support for additional features

### 4. Copy Image Assets
- Create `public/Images/` directory
- Copy all category images maintaining the exact folder structure
- Ensure all images are `.avif` format

### 5. Copy Source Files
- Copy all source files maintaining the exact structure
- Ensure all imports and paths are correct

### 6. Configure Google OAuth
- Create `.env` file in project root with:
  ```
  REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
  ```
- Follow Google Cloud Console setup (see GOOGLE_OAUTH_COMPLETE_SETUP.md)
- Configure authorized origins and redirect URIs

### 7. Start Development Server
```bash
npm start
```

## Important Notes

### Performance Considerations
- Lazy loading is implemented for all images
- Motion animations are optimized to prevent flicker
- Console filtering reduces log noise

### Browser Compatibility
- Requires modern browser with AVIF support
- Lazy loading uses Intersection Observer API

### Development vs Production
- StrictMode disabled in development to prevent double-mounting
- Performance dashboard only shows in development
- Console filtering active in both environments

### Image Requirements
- All images must be in AVIF format
- Maintain exact folder structure and naming
- Images should be optimized for web (reasonable file sizes)

## Troubleshooting

### Common Issues
1. **Images not loading**: Check file paths and AVIF support
2. **Infinite re-renders**: Ensure useEffect dependencies are correct
3. **Flickering**: Verify all motion components use `initial={false}`
4. **Console spam**: Adjust console filter keywords as needed
5. **Development server issues**: Ensure you're in the correct directory (`digital-art-store`) when running `npm start`

### Debug Mode
- Console logs show image loading status
- Performance dashboard available in development

### Quick Start Commands
```bash
# Navigate to project directory
cd digital-art-store

# Install dependencies (if needed)
npm install

# Start development server
npm start

# Access the app
# Open http://localhost:3000 in your browser
```

This project guide contains all the critical implementation details needed to recreate the digital art store without the errors encountered during development.
