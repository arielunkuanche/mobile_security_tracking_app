# React Native Safety Alert App

This project is a React Native application designed to enhance personal safety by providing real-time proximity alerts based on reported offenses from the UK Police API. The app incorporates features like vibration alerts, notifications, and custom user settings for a safer experience.

## Features

- **Map Visualization**: Displays reported offenses as markers on a map.
- **Proximity Alerts**: Triggers vibration and notifications when within a user-defined proximity of offenses.
- **Custom Settings**:
  - Configurable vibration settings with a time range and proximity.
  - Manage notification and location permissions.
- **User Account Management**: User authentication via Firebase.
- **Privacy Modal**: Clear information on data usage and app permissions.

## Technologies Used

### Frontend
- **React Native**: Framework for building mobile applications.
- **Expo**: Simplifies the development process with features like location and notification handling.
- **React Native Paper**: UI components library for styling.

### Backend & APIs
- **Firebase Authentication**: Handles user sign-in and sign-out.
- **Firebase Firestore**: Stores user settings.
- **UK Police API**: Fetches offense data for real-time alerts.

### Libraries and Utilities
- **Geolib**: Calculates distances between locations to trigger proximity alerts.
- **Expo Notifications**: Manages push notifications.
- **Expo Location**: Handles location permissions and current user location.
- **AsyncStorage**: Persists user settings locally.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/arielunkuanche/mobile_security_tracking_app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mobile_security_tracking_app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Expo development server:
   ```bash
   npm start
   ```
5. Scan the QR code with Expo Go (on iOS or Android) to run the app on your device.

## Usage

1. Launch the app and log in with Firebase Authentication.
2. Access the settings to enable vibration and configure the proximity range and time range.
3. View reported offenses on the map.
4. Receive alerts when within proximity of offenses during the configured time range.

## File Structure

```
.
├── components
│   ├── CameraControls.jsx
│   ├── ContactsComponent.jsx
│   ├── EditContact.jsx
│   ├── EditProfile.jsx
│   ├── LoginScreen.jsx
│   ├── MediaActions.jsx
│   ├── OffensePickerComponent.jsx
│   ├── SearchScreen
│   ├── TabBar.jsx
│   ├── VibrationComponent.jsx
├── custom-hooks
│   ├── useFetchOffenseOnLocation.jsx
│   ├── useFetchOffenseOnType.jsx
├── config
│   ├── FirebaseConfig.jsx
├── utils
│   ├── timeValidation.jsx
├── app
│   ├── _layout.jsx
│   ├── contacts.jsx
│   ├── index.jsx
│   ├── media.jsx
│   ├── profile.jsx
├── assets
│   ├── fonts
│   │   ├── Outfit-Bold.ttf
│   │   ├── Outfit-Medium.ttf
│   │   ├── Outfit-Regular.ttf
│   ├── images
│       ├── books.jpg
│       ├── photographer.jpg
├── README.md
```

## Known Issues

1. **Expo Go Limitation**: Notifications may not display correctly in Expo Go. Test on a standalone build.
2. **Mock Data Testing**: The app uses mock location data for testing since offense data is UK-based.

## Future Enhancements

- Add altitude handling for precise location-based alerts.
- Support for additional datasets beyond the UK Police API.
- Enhanced privacy features with granular permission controls.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

