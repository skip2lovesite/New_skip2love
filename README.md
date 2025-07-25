# Skip2Love - Romantic Ad Posting App

A beautiful, romantic-themed mobile app for posting and browsing personal ads with integrated messaging and profile system.

## Features

- 🌹 **Romantic Theme**: Beautiful pink gradient design with modern UI
- 📱 **Mobile-First**: Built with React Native for optimal mobile experience
- 🖼️ **Image Gallery**: Upload up to 4 images per ad with scrollable gallery
- 💬 **In-App Messaging**: Direct messaging between users
- 👤 **Profile System**: Complete user profiles with photos and contact info
- 🔒 **Authentication**: Secure login/signup with Supabase
- ☁️ **Cloud Storage**: Images hosted on Cloudinary
- 💳 **Subscription Tiers**: Free and premium ($5.99) plans

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL)
- **Image Storage**: Cloudinary
- **Authentication**: Supabase Auth
- **UI Components**: React Native Paper
- **Navigation**: Expo Router

## Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Android device or emulator (for Termux setup)
- Supabase account
- Cloudinary account

## Installation & Setup

### 1. Clone and Install Dependencies

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd skip2love

# Install dependencies
npm install

# Install Expo CLI globally if not already installed
npm install -g @expo/cli
\`\`\`

### 2. Supabase Setup

1. **Create Tables**: Run the SQL script in \`scripts/01-create-tables.sql\` in your Supabase SQL editor

2. **Configure Authentication**:
   - Go to Authentication > Settings in your Supabase dashboard
   - Enable email confirmation if desired
   - Set up any additional auth providers

3. **Set up Row Level Security**: The SQL script already includes RLS policies

### 3. Cloudinary Setup

1. **Create Upload Preset**:
   - Go to your Cloudinary dashboard
   - Navigate to Settings > Upload
   - Create a new upload preset named \`skip2love_preset\`
   - Set it to "Unsigned" for easier mobile uploads
   - Configure folder as \`skip2love\`

2. **Update Configuration**: The Cloudinary credentials are already configured in \`lib/cloudinary.ts\`

### 4. Environment Setup

The app uses hardcoded credentials for simplicity, but for production, create a \`.env\` file:

\`\`\`env
EXPO_PUBLIC_SUPABASE_URL=https://earodrhfffzvwgrajhhg.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dyzhukr9m
EXPO_PUBLIC_CLOUDINARY_API_KEY=865377189421577
EXPO_PUBLIC_CLOUDINARY_API_SECRET=10zr0oYwvK_Wnok5v-TMJvb123g
\`\`\`

### 5. Running the App

\`\`\`bash
# Start the development server
npx expo start

# For Android (Termux)
npx expo start --android

# For iOS
npx expo start --ios

# For web
npx expo start --web
\`\`\`

### 6. Termux Setup (Android)

If you're using Termux on Android:

\`\`\`bash
# Update packages
pkg update && pkg upgrade

# Install Node.js
pkg install nodejs

# Install Git
pkg install git

# Clone and setup the project
git clone <your-repo-url>
cd skip2love
npm install
npx expo start --tunnel
\`\`\`

## App Structure

\`\`\`
skip2love/
├── app/
│   ├── (auth)/          # Authentication screens
│   ├── (tabs)/          # Main app tabs
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Welcome screen
├── components/          # Reusable components
├── contexts/           # React contexts
├── lib/               # Utilities and configurations
└── scripts/           # Database setup scripts
\`\`\`

## Key Features Explained

### 1. **Dashboard**
- Shows all active ads
- Price hidden until ad is clicked
- Search functionality
- Pull-to-refresh

### 2. **Ad Creation**
- Upload up to 4 images
- Required profile to post
- Categories and location tags

### 3. **Profile System**
- Avatar upload
- Contact information (email, phone, city)
- Optional bio
- Profile required for posting

### 4. **Messaging**
- Direct messaging between users
- Message threads organized by conversation
- Real-time updates

### 5. **Subscription System**
- Free tier with basic features
- Premium tier ($5.99) with enhanced features
- Venmo payment integration (to be implemented)

## Database Schema

### Tables:
- \`profiles\`: User profile information
- \`ads\`: Posted advertisements
- \`messages\`: Direct messages between users
- \`conversations\`: Message thread organization
- \`subscriptions\`: User subscription status

## Customization

### Theme Colors
Edit the theme in \`app/_layout.tsx\`:

\`\`\`typescript
const theme = {
  colors: {
    primary: '#FF6B9D',      // Main pink
    secondary: '#FF8E9B',    // Secondary pink
    tertiary: '#FFB4B4',     // Light pink
    background: '#FFF5F8',   // Background
    // ... other colors
  },
}
\`\`\`

### Adding Features
1. Create new screens in appropriate directories
2. Update navigation in \`_layout.tsx\` files
3. Add database tables/columns as needed
4. Update TypeScript types in \`lib/supabase.ts\`

## Troubleshooting

### Common Issues:

1. **Expo CLI not found**: Install globally with \`npm install -g @expo/cli\`

2. **Supabase connection issues**: 
   - Check your project URL and API key
   - Ensure RLS policies are set up correctly

3. **Image upload failures**:
   - Verify Cloudinary upload preset is configured
   - Check API credentials

4. **Build errors**:
   - Clear Expo cache: \`npx expo start --clear\`
   - Reinstall dependencies: \`rm -rf node_modules && npm install\`

### Termux Specific:
- Use \`--tunnel\` flag if local network access is limited
- Ensure storage permissions are granted
- Use \`pkg install\` instead of \`apt install\`

## Payment Integration (Future)

The app is prepared for Venmo payment integration. To implement:

1. Add Venmo SDK or API integration
2. Update subscription flow in the app
3. Add webhook handlers for payment verification
4. Update database with transaction records

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase and Cloudinary documentation
3. Open an issue in the repository

## License

This project is licensed under the MIT License.
\`\`\`

---

**Skip2Love** - Where connections begin! 💕
