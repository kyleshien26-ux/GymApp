# GymApp

A React Native fitness tracking application built with Expo and TypeScript.

## Features

- 📱 Cross-platform mobile app (iOS/Android)
- 🏋️ Workout tracking and logging
- 📊 Progress monitoring
- 📋 Exercise templates
- 🤖 AI-powered workout plans
- 📈 Personal records tracking
- 📏 Body measurements
- 📚 Workout history

## Tech Stack

- **React Native** 0.81.5
- **Expo** SDK 54
- **TypeScript**
- **Expo Router** for navigation
- **React Native Screens**

## Getting Started

### Prerequisites

- Node.js (14 or later)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on device)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd GymApp
\`\`\`

2. Navigate to the app directory:
\`\`\`bash
cd gym-app-native
\`\`\`

3. Install dependencies:
\`\`\`bash
npm install
\`\`\`

4. Start the development server:
\`\`\`bash
npx expo start
\`\`\`

## Project Structure

\`\`\`
gym-app-native/
├── app/                    # Main application code
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Home/Dashboard
│   │   ├── workouts.tsx   # Workouts screen
│   │   ├── progress.tsx   # Progress tracking
│   │   ├── templates.tsx  # Workout templates
│   │   ├── ai-plan.tsx    # AI workout plans
│   │   └── profile.tsx    # User profile
│   ├── exercises/         # Exercise-related screens
│   ├── history/           # Workout history
│   ├── log-workout/       # Workout logging
│   ├── measurements/      # Body measurements
│   ├── records/           # Personal records
│   └── templates/         # Template management
├── components/            # Reusable components
└── types/                # TypeScript definitions
\`\`\`

## Available Scripts

- \`npm start\` - Start the Expo development server
- \`npm run android\` - Run on Android device/emulator
- \`npm run ios\` - Run on iOS device/simulator
- \`npm run web\` - Run in web browser

## Known Issues

- ReactFabric boolean/string type error in Expo Go (does not affect functionality)

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
