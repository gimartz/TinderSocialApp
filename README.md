# Tinder-Style Social Chat UI

A React Native application featuring a Tinder-style swipeable card interface with integrated chat functionality and tab navigation.

## 📱 Features Implemented

### 1. Home Screen
- **Swipeable User Cards**: Interactive card deck with smooth swipe gestures
- **User Profiles**: Display user information including name, age, and avatar
- **Like/Dislike Actions**: Swipe right to like, left to dislike
- **Visual Feedback**: Animated indicators showing swipe direction

### 2. Chat Screen
- **Message List**: Displays all active conversations
- **Individual Chat View**: One-on-one messaging interface
- **Sender Differentiation**: Distinct styling for sent vs. received messages
- **Message Bubbles**: Clean, modern chat bubble design with timestamps

### 3. Navigation
- **Bottom Tab Navigation**: Three-tab structure
  - Home (Swipe cards)
  - Chats (Conversations)
  - Profile (User profile)
- **Smooth Transitions**: Seamless navigation between screens

### 4. Additional Features
- **TypeScript Integration**: Fully typed components and data structures
- **Responsive Design**: Optimized for various screen sizes
- **Mock Data**: Pre-populated with sample users and conversations
- **Clean UI/UX**: Modern, intuitive interface design

## 🚀 Project Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/tinder-chat-ui.git
   cd tinder-chat-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on Android**
   ```bash
   npm run android
   # or
   yarn android
   ```

6. **Run on iOS** (macOS only)
   ```bash
   npm run ios
   # or
   yarn ios
   ```


## 📦 Dependencies

### Core Dependencies
- `react-native`: ^0.76.0
- `react-navigation/native`: ^6.x
- `react-navigation/bottom-tabs`: ^6.x
- `react-navigation/stack`: ^6.x

### Additional Libraries
- `react-native-gesture-handler`: For swipe gestures
- `react-native-reanimated`: For smooth animations
- `react-native-vector-icons`: For icons

## 🎯 Assumptions Made

1. **No Authentication**: The app uses a mock user profile and doesn't require login
2. **Static Data**: All user profiles and messages are hardcoded (no API integration)
3. **No Real-time Updates**: Messages don't update in real-time (no WebSocket/Firebase)
4. **Single User Perspective**: The app shows a single user's view of matches and chats
5. **Simplified Matching**: Swiping right doesn't require mutual matching to enable chat
6. **No Image Upload**: Profile pictures use placeholder URLs
7. **Basic Profile**: Profile screen shows minimal user information
8. **No Message Sending**: Chat interface is read-only (displays mock messages)



## 🔨 Building APK

### Debug APK
```bash
cd android
./gradlew assembleDebug
```
APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

## 📥 Download APK

**APK File**: [Download from Google Drive](https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing)

## 🧪 Testing

The app has been tested on:
- Android 11+ (Physical device and emulator)
- iOS 14+ (Simulator)
- Various screen sizes (from small phones to tablets)
