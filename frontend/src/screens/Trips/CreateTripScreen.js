import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/colors/theme';

const { width } = Dimensions.get('window');

const CreateTripScreen = ({ navigation }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferences, setPreferences] = useState('');
  const [tripName, setTripName] = useState('');

  // Animation values
  const cardAnimation = useRef(new Animated.Value(0)).current;
  const inputAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(inputAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreateTrip = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to TripItineraryScreen with trip details
      navigation.navigate('TripItinerary', {
        tripName: tripName || 'My Trip',
        tripDays: calculateTripDays(startDate, endDate) || 4,
        destination
      });
      
      /* 
      BACKEND INTEGRATION:
      1. Create a new trip in the database:
      
      const createNewTrip = async () => {
        try {
          // Prepare trip data for API
          const tripData = {
            name: tripName || 'My Trip',
            destination: destination,
            startDate: startDate, 
            endDate: endDate,
            preferences: preferences,
            createdBy: userInfo._id // Get from AuthContext
          };
          
          // Create trip in database
          const response = await ApiService.trips.createTrip(tripData);
          const createdTrip = response.data;
          
          // Create initial itinerary
          const itineraryResponse = await ApiService.itineraries.createItinerary({
            tripId: createdTrip._id,
            days: calculateTripDays(startDate, endDate) || 4
          });
          
          // Navigate with the backend data
          navigation.navigate('TripItinerary', {
            tripId: createdTrip._id,
            tripName: createdTrip.name,
            tripDays: calculateTripDays(startDate, endDate) || 4,
            destination: createdTrip.destination
          });
        } catch (error) {
          console.error('Error creating trip:', error);
          Alert.alert('Error', 'Failed to create trip. Please try again.');
        }
      };
      
      createNewTrip();
      */
    });
  };

  // Helper function to calculate number of days in a trip
  const calculateTripDays = (start, end) => {
    // If dates aren't provided, return default of 4 days
    if (!start || !end) return 4;
    
    // In a real app, this would parse the dates and calculate the difference
    return 4; // Placeholder for now
  };

  // Animation styles
  const cardStyle = {
    transform: [
      {
        translateY: cardAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
    opacity: cardAnimation,
  };

  const inputStyle = {
    opacity: inputAnimation,
    transform: [
      {
        translateX: inputAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        }),
      },
    ],
  };

  const buttonScale = {
    transform: [{ scale: buttonAnimation }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Main content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.formCard, cardStyle]}>
          {/* Destination Input */}
          <Animated.View style={[styles.inputContainer, inputStyle]}>
            <Text style={styles.label}>Where to?</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: Colombo"
              placeholderTextColor="#888"
              value={destination}
              onChangeText={setDestination}
            />
          </Animated.View>
          
          {/* Dates Input */}
          <Animated.View style={[styles.inputContainer, inputStyle, { delay: 100 }]}>
            <Text style={styles.label}>Dates</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={18} color="#555" />
                <Text style={styles.dateText}>start date</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={18} color="#555" />
                <Text style={styles.dateText}>end date</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          {/* Preferences Input */}
          <Animated.View style={[styles.inputContainer, inputStyle, { delay: 200 }]}>
            <Text style={styles.label}>Preference</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: adventure, religious, relaxing"
              placeholderTextColor="#888"
              value={preferences}
              onChangeText={setPreferences}
            />
          </Animated.View>
          
          {/* Trip Name Input */}
          <Animated.View style={[styles.inputContainer, inputStyle, { delay: 300 }]}>
            <Text style={styles.label}>Trip Name</Text>
            <TextInput
              style={styles.input}
              placeholder="add name"
              placeholderTextColor="#888"
              value={tripName}
              onChangeText={setTripName}
            />
          </Animated.View>
          
          {/* Bottom buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.addUserButton}>
              <Ionicons name="add" size={20} color="#555" />
              <Text style={styles.addUserText}>add users</Text>
            </TouchableOpacity>
            
            <Animated.View style={buttonScale}>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateTrip}
                activeOpacity={0.8}
              >
                <Text style={styles.createButtonText}>Plan Trip</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  formCard: {
    backgroundColor: colors.sand,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
    // 3D effect with multiple shadows
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#333',
    // 3D inset effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  dateContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
    // 3D inset effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateText: {
    color: '#555',
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  addUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    // 3D effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  addUserText: {
    color: '#555',
    marginLeft: 5,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    justifyContent: 'center',
    // Enhanced 3D effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default CreateTripScreen; 