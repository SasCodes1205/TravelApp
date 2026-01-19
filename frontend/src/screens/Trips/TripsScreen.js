import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../../assets/colors/theme';
import { AuthContext } from '../../utils/AuthContext';

const TripsScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch user's trips when component mounts:
  
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Get user ID from AuthContext
        const userId = userInfo?._id;
        if (userId) {
          // Fetch user's trips
          const response = await ApiService.trips.getUserTrips(userId);
          setTrips(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
        // Handle error or show error message
      }
    };
    
    fetchTrips();
  }, [userInfo]);
  */
  
  // For now, just display a simple message
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trips Screen</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      
      {/* 
      BACKEND INTEGRATION:
      Once backend is connected, replace with:
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : trips.length > 0 ? (
        <FlatList
          data={trips}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tripCard}
              onPress={() => navigation.navigate('TripItinerary', { 
                tripId: item._id,
                tripName: item.name,
                tripDays: calculateTripDays(item.startDate, item.endDate)
              })}
            >
              <Text style={styles.tripName}>{item.name}</Text>
              <Text style={styles.tripDates}>
                {new Date(item.startDate).toLocaleDateString()} - 
                {new Date(item.endDate).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No trips yet.</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTrip')}
          >
            <Text style={styles.createButtonText}>Create Trip</Text>
          </TouchableOpacity>
        </View>
      )}
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
  },
  /* 
  BACKEND INTEGRATION:
  Add styles for trip cards and buttons once backend is connected:
  
  tripCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  tripDates: {
    fontSize: 14,
    color: colors.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  createButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  */
});

export default TripsScreen; 