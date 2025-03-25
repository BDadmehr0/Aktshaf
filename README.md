# Aktshaf

Aktshaf A city exploration system that shows the user's level of city discovery.

City Explorer App is a React Native application designed to help users explore their surroundings, track their movements, and visualize how much of a city they've covered. It uses GPS to display the user's current location on a map, highlights the areas they've visited, and calculates the percentage of the city they've explored based on predefined city boundaries. The app is built with React Native, utilizing `react-native-maps` and `react-native-geolocation-service`.

## Features

- **Real-time Location Tracking:** Display the user's current location on an interactive map.
- **City Boundary Visualization:** Show the boundaries of the city based on available map data.
- **Tracking Visited Areas:** Track and visualize the areas the user has explored, coloring the visited regions.
- **Exploration Progress:** Calculate and display the percentage of the city explored based on the user's movements.
  
## Long-Term Vision & Planning

### Milestones

#### **Phase 1: Core Functionality (Completed)**
- **Location Tracking:** Display user location on the map.
- **Basic Map Interaction:** Ability to interact with the map and zoom in/out.
- **Visited Areas:** Track areas the user has already visited and highlight them.
- **City Boundaries:** Display the boundaries of the city based on initial data.

#### **Phase 2: User Experience Enhancement**
- **Real-Time Tracking:** Implement real-time tracking to update the user's location and visited area continuously.
- **Improved Boundary Detection:** Enhance the accuracy of city boundaries by integrating additional data sources.
- **Path Tracing:** Visualize the path the user has walked with a trail line.

#### **Phase 3: Advanced Features & Optimization**
- **Exploration Percentage:** Automatically calculate and display the percentage of the city covered, based on the user’s movement.
- **Background Location Tracking:** Ensure the app continues tracking and updating the user’s location even when the app is in the background.
- **Battery Optimization:** Improve battery efficiency while tracking location in the background.
- **Offline Support:** Implement offline capabilities for areas with no network connection, enabling location tracking without internet access.
  
#### **Phase 4: User-Generated Data & Social Features**
- **User Profiles:** Allow users to create profiles and save their exploration data (i.e., how much of a city they've explored).
- **Sharing & Leaderboards:** Enable users to share their progress with friends or a community and introduce a leaderboard to motivate exploration.
  
#### **Phase 5: Cross-Platform & Device Support**
- **Android & iOS Optimization:** Ensure the app performs well on both platforms, adjusting for any platform-specific challenges.
- **Wearable Device Support:** Explore the possibility of integrating the app with wearable devices (e.g., smartwatches) to track exploration.
  
## Challenges

While building this application, several challenges need to be addressed:

- **GPS Accuracy & Battery Consumption:** Since the app uses continuous GPS tracking, ensuring that the location is accurate and doesn't drain the device's battery excessively is a significant challenge.
- **Handling Large Data Sets:** Storing and processing location data efficiently is crucial, as the app needs to track the user’s movement across potentially large cities.
- **Cross-Platform Compatibility:** Ensuring that the app runs smoothly on both Android and iOS requires platform-specific adjustments and optimizations.
- **Background Location Tracking:** Maintaining location tracking while the app is in the background, especially on iOS devices, is tricky and requires special permissions and configuration.
- **City Boundary Data Availability:** Acquiring reliable and detailed data for city boundaries might be challenging, as this requires access to accurate geographic datasets.
  
## How to Use

1. **Install Dependencies:**  
   ```bash
   npm install
   ```

2. **Run the App:**  
   Use Expo to run the app on your device.
   ```bash
   npx expo start
   ```

3. **Grant Permissions:**  
   Make sure to grant the necessary permissions for location access and background location tracking.

4. **Explore the Map:**  
   The app will show your current location and track your movements. It will highlight the areas you've already covered and display the percentage of the city you've explored.
