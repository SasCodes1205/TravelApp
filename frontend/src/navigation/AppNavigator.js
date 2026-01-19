import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet, View } from 'react-native';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import TripsScreen from '../screens/Trips/TripsScreen';
import TripDetailScreen from '../screens/Trips/TripDetailScreen';
import CreateTripScreen from '../screens/Trips/CreateTripScreen';
import TripItineraryScreen from '../screens/Trips/TripItineraryScreen';
import BookingsScreen from '../screens/Trips/BookingsScreen';
import ChecklistsScreen from '../screens/Trips/ChecklistsScreen';
import OutfitsScreen from '../screens/Trips/OutfitsScreen';
import GalleryScreen from '../screens/Trips/GalleryScreen';
import ReviewsScreen from '../screens/Trips/ReviewsScreen';
import GroupScreen from '../screens/Trips/GroupScreen';

// Auth Context
import { AuthContext } from '../utils/AuthContext';
import colors from '../assets/colors/theme';

const Stack = createStackNavigator();

// Custom 3D Title Component with enhanced styling
const StylishTitle = ({ title }) => (
  <View style={styles.titleContainer}>
    {/* Shadow layer for 3D effect */}
    <Text style={[styles.titleShadow, { opacity: 0.1, transform: [{ translateY: 4 }] }]}>
      {title}
    </Text>
    <Text style={[styles.titleShadow, { opacity: 0.2, transform: [{ translateY: 2 }] }]}>
      {title}
    </Text>
    {/* Main text */}
    <Text style={styles.titleText}>
      {title}
    </Text>
    {/* Highlight layer */}
    <Text style={[styles.titleHighlight, { opacity: 0.2, transform: [{ translateY: -1 }] }]}>
      {title}
    </Text>
  </View>
);

const AppNavigator = () => {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
            height: 65,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {userToken ? (
          // User is signed in
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                headerShown: false
              }} 
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ 
                headerShown: false 
              }} 
            />
            <Stack.Screen 
              name="Trips" 
              component={TripsScreen} 
              options={{ title: 'My Trips' }} 
            />
            <Stack.Screen 
              name="TripDetail" 
              component={TripDetailScreen} 
              options={({ route }) => ({ title: route.params?.tripName || 'Trip Details' })} 
            />
            <Stack.Screen 
              name="CreateTrip" 
              component={CreateTripScreen} 
              options={{ 
                headerTitle: () => <StylishTitle title="PLAN NEW TRIP" />,
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
              }} 
            />
            <Stack.Screen 
              name="TripItinerary" 
              component={TripItineraryScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Bookings" 
              component={BookingsScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Checklists" 
              component={ChecklistsScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Outfits" 
              component={OutfitsScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Gallery" 
              component={GalleryScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Reviews" 
              component={ReviewsScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Group" 
              component={GroupScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
          </>
        ) : (
          // User is not signed in
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ 
                headerShown: false,
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
    position: 'absolute',
    zIndex: 3,
  },
  titleShadow: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
    position: 'absolute',
    zIndex: 1,
  },
  titleHighlight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
    position: 'absolute',
    zIndex: 2,
  }
});

export default AppNavigator; 