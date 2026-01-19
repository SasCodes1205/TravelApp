import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../../assets/colors/theme';
import { Ionicons } from '@expo/vector-icons';

const TripDetailScreen = ({ route, navigation }) => {
  // Get the tripId and tripName parameters from route, or use default values if not provided
  const { tripId, tripName = 'Trip' } = route.params || {};
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch detailed trip information when component mounts:
  
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        if (tripId) {
          // Fetch detailed trip information
          const response = await ApiService.trips.getTripById(tripId);
          setTripDetails(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trip details:', error);
        setLoading(false);
        // Handle error or show error message
      }
    };
    
    fetchTripDetails();
  }, [tripId]);
  */

  // For now, just display a simple message
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{tripName} Details</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>
      
      {/* 
      BACKEND INTEGRATION:
      Once backend is connected, replace with:
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : tripDetails ? (
        <ScrollView style={styles.detailsContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.tripName}>{tripDetails.name}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Trip Information</Text>
            <Text style={styles.infoText}>Destination: {tripDetails.destination}</Text>
            <Text style={styles.infoText}>
              Dates: {new Date(tripDetails.startDate).toLocaleDateString()} - 
              {new Date(tripDetails.endDate).toLocaleDateString()}
            </Text>
            <Text style={styles.infoText}>Duration: {tripDetails.duration} days</Text>
          </View>
          
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('TripItinerary', { 
                tripId: tripDetails._id,
                tripName: tripDetails.name,
                tripDays: tripDetails.duration
              })}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.white} />
              <Text style={styles.navButtonText}>Itinerary</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('Bookings', { 
                tripId: tripDetails._id,
                tripName: tripDetails.name,
                tripDays: tripDetails.duration
              })}
            >
              <Ionicons name="bookmark-outline" size={20} color={colors.white} />
              <Text style={styles.navButtonText}>Bookings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.errorText}>Trip not found.</Text>
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
  Add styles for trip details once backend is connected:
  
  detailsContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tripName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 15,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  navButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  navButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  */
});

export default TripDetailScreen; 