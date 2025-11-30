# GymApp

A simple iOS fitness tracking app built with React Native and Expo.

## What it does

Track your workouts, monitor progress, and manage exercise routines. Built specifically for iOS devices.

## Features

- Workout logging and tracking
- Progress monitoring over time
- Custom exercise templates
- AI workout plan suggestions
- Personal records tracking
- Body measurements
- Workout history

## Built with

- React Native 0.81.5
- Expo SDK 54
- TypeScript
- Expo Router for navigation

## Setup

You'll need Node.js and Expo CLI installed.

```bash
git clone https://github.com/kyleshien26-ux/GymApp.git
cd GymApp/gym-app-native
npm install
npx expo start
```

Use the Expo Go app on your iPhone to scan the QR code and test the app.

## Project Structure

```
gym-app-native/
├── app/                    
│   ├── (tabs)/            # Main app tabs
│   ├── exercises/         # Exercise screens
│   ├── history/           # Workout history
│   ├── log-workout/       # Workout logging
│   └── templates/         # Template management
└── components/            # Shared components
```

## Running the app

- `npm start` - Start development server
- `npm run ios` - Run on iOS simulator

## Notes

There's a known ReactFabric error in Expo Go that doesn't affect the app's functionality. The web version works fine for development.
