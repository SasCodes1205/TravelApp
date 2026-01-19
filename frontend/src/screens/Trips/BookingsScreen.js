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
  Animated,
  Dimensions,
  Platform,
  Alert,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../../assets/colors/theme';

const { width, height } = Dimensions.get('window');

// Mock booking data
const initialBookings = [
  { 
    id: '1', 
    name: 'booking1', 
    place: '', 
    type: '', 
    checkIn: '', 
    checkOut: '', 
    price: '' 
  }
];

const BookingsScreen = ({ route, navigation }) => {
  // Get trip data from route params or use default values
  const { tripName = 'Trip Name', tripDays = 10 } = route.params || {};
  
  const [bookings, setBookings] = useState(initialBookings);
  const [editingTripName, setEditingTripName] = useState(false);
  const [localTripName, setLocalTripName] = useState(tripName);
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch bookings data when component mounts:
     
     useEffect(() => {
       const fetchBookings = async () => {
         try {
           // Get tripId from route.params
           const { tripId } = route.params;
           if (tripId) {
             // Fetch bookings for this trip
             const response = await ApiService.bookings.getTripBookings(tripId);
             const bookingsData = response.data;
             
             // Update state with bookings data
             setBookings(bookingsData.map(booking => ({
               id: booking._id,
               name: booking.name,
               place: booking.place,
               type: booking.type,
               checkIn: booking.checkIn,
               checkOut: booking.checkOut,
               price: booking.price
             })));
           }
         } catch (error) {
           console.error('Error fetching bookings:', error);
           // Handle error or show error message
         }
       };
       
       fetchBookings();
     }, [route.params?.tripId]);
  */
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnim = useRef(new Animated.Value(0.95)).current;
  const navBarAnim = useRef(new Animated.Value(0)).current;

  // Tab options
  const tabOptions = ['Itinerary', 'Bookings', 'Checklists', 'Outfits'];
  const [activeTab, setActiveTab] = useState('Bookings');
  
  useEffect(() => {
    // Animate elements when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(navBarAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const handleTabPress = (tab) => {
    if (tab === 'Itinerary') {
      navigation.navigate('TripItinerary', { tripName: localTripName, tripDays });
    } else if (tab === 'Bookings') {
      // We're already here
    } else if (tab === 'Checklists') {
      navigation.navigate('Checklists', { tripName: localTripName, tripDays });
    } else if (tab === 'Outfits') {
      navigation.navigate('Outfits', { tripName: localTripName, tripDays });
    } else {
      Alert.alert(
        `${tab} Tab`,
        `The ${tab} feature will be available soon!`,
        [{ text: 'OK' }]
      );
    }
  };

  const toggleEditTripName = () => {
    setEditingTripName(!editingTripName);
  };

  const handleAddBooking = () => {
    const newBooking = { 
      id: Date.now().toString(), 
      name: `booking${bookings.length + 1}`, 
      place: '', 
      type: '', 
      checkIn: '', 
      checkOut: '', 
      price: '' 
    };
    setBookings([...bookings, newBooking]);
    
    /* 
    BACKEND INTEGRATION:
    Add API call to create a new booking:
    
    1. Connect to backend API endpoint: POST /api/bookings
    2. Implementation:
       try {
         const { tripId } = route.params;
         const newBookingData = {
           tripId: tripId,
           name: `booking${bookings.length + 1}`,
           place: '',
           type: '',
           checkIn: '',
           checkOut: '',
           price: ''
         };
         
         const response = await ApiService.bookings.createBooking(newBookingData);
         
         // Update the booking with the actual ID from backend
         const createdBooking = response.data;
         setBookings(prev => [...prev, {
           id: createdBooking._id,
           name: createdBooking.name,
           place: createdBooking.place,
           type: createdBooking.type,
           checkIn: createdBooking.checkIn,
           checkOut: createdBooking.checkOut,
           price: createdBooking.price
         }]);
       } catch (error) {
         console.error('Error adding booking:', error);
         // Handle error or show error message
       }
    */
  };

  const handleDeleteBooking = (id) => {
    Alert.alert(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setBookings(bookings.filter(booking => booking.id !== id));
            
            /* 
            BACKEND INTEGRATION:
            Add API call to delete a booking:
            
            1. Connect to backend API endpoint: DELETE /api/bookings/:bookingId
            2. Implementation:
               try {
                 await ApiService.bookings.deleteBooking(id);
                 
                 // UI state is already updated above with the filter
               } catch (error) {
                 console.error('Error deleting booking:', error);
                 // Handle error or show error message
                 // If error occurs, you might want to revert the UI change
                 // by re-fetching the bookings
               }
            */
          }
        }
      ]
    );
  };

  const updateBookingField = (id, field, value) => {
    const updatedBookings = bookings.map(booking => {
      if (booking.id === id) {
        return { ...booking, [field]: value };
      }
      return booking;
    });
    setBookings(updatedBookings);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header with home button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Trip card with 3D effect */}
      <Animated.View 
        style={[
          styles.tripCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: cardAnim }
            ]
          }
        ]}
      >
        <View style={styles.cardShadowLayer} />
        
        <View style={styles.tripNameRow}>
          {editingTripName ? (
            <TextInput
              style={styles.tripNameInput}
              value={localTripName}
              onChangeText={setLocalTripName}
              autoFocus
              onBlur={toggleEditTripName}
              onSubmitEditing={toggleEditTripName}
            />
          ) : (
            <Text style={styles.tripName}>{localTripName}</Text>
          )}
          <TouchableOpacity onPress={toggleEditTripName}>
            <Ionicons name={editingTripName ? "checkmark-circle" : "pencil"} size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tripDetails}>
          <TouchableOpacity 
            style={styles.dateRow}
            onPress={() => Alert.alert("Date Selection", "Calendar will open here")}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.dateText}>from-to</Text>
          </TouchableOpacity>
          
          <View style={styles.membersRow}>
            <TouchableOpacity 
              style={styles.members}
              onPress={() => Alert.alert("Trip Members", "View all members")}
            >
              <Ionicons name="people-outline" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => Alert.alert("Add Member", "You can add trip members here")}
            >
              <Ionicons name="add" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabOptions.map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => handleTabPress(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Bookings Content */}
      <ScrollView style={styles.contentContainer}>
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingIcon}>
                <Ionicons name="calendar" size={22} color="#666" />
              </View>
              <Text style={styles.bookingName}>{booking.name}</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => Alert.alert("Edit Name", "Edit booking name")}
              >
                <Ionicons name="pencil" size={18} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteBooking(booking.id)}
              >
                <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.bookingInputRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <TextInput
                style={styles.bookingInput}
                placeholder="Add a place"
                placeholderTextColor="#999"
                value={booking.place}
                onChangeText={(text) => updateBookingField(booking.id, 'place', text)}
              />
            </View>
            
            <View style={styles.bookingInputRow}>
              <Ionicons name="document-text-outline" size={20} color="#666" />
              <TextInput
                style={styles.bookingInput}
                placeholder="type ex: hotel, flight"
                placeholderTextColor="#999"
                value={booking.type}
                onChangeText={(text) => updateBookingField(booking.id, 'type', text)}
              />
            </View>
            
            <View style={styles.dateInputContainer}>
              <View style={styles.dateInputWrapper}>
                <Ionicons name="calendar-outline" size={18} color="#666" />
                <Text style={styles.dateInputLabel}>check-in</Text>
              </View>
              
              <View style={styles.dateInputWrapper}>
                <Ionicons name="calendar-outline" size={18} color="#666" />
                <Text style={styles.dateInputLabel}>check-out</Text>
              </View>
            </View>
            
            <View style={styles.bookingInputRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="price"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={booking.price}
                onChangeText={(text) => updateBookingField(booking.id, 'price', text)}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.imageUploadContainer}
              onPress={() => Alert.alert("Add Photo", "Take or select a photo")}
            >
              <View style={styles.imageUploadPlaceholder}>
                <Ionicons name="image-outline" size={32} color="#666" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Add Booking Button */}
        <TouchableOpacity 
          style={styles.addBookingButton}
          onPress={handleAddBooking}
        >
          <Text style={styles.addBookingText}>add booking</Text>
          <Ionicons name="add" size={20} color="#666" />
        </TouchableOpacity>
      </ScrollView>
      
      {/* Bottom tab bar with animation */}
      <Animated.View 
        style={[
          styles.bottomTabBar,
          {
            transform: [
              { 
                translateY: navBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }
            ],
            opacity: navBarAnim
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.bottomTab}
          onPress={() => navigation.navigate('TripItinerary', { tripName: localTripName, tripDays })}
        >
          <View style={styles.bottomTabIconContainer}>
            <Ionicons name="calendar-outline" size={22} color="#666" />
          </View>
          <Text style={styles.bottomTabText}>Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomTab}
          onPress={() => navigation.navigate('Gallery', { tripName: localTripName, tripDays })}
        >
          <View style={styles.bottomTabIconContainer}>
            <Ionicons name="image" size={22} color="#666" />
          </View>
          <Text style={styles.bottomTabText}>Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomTab}
          onPress={() => navigation.navigate('Reviews', { tripName: localTripName, tripDays })}
        >
          <View style={styles.bottomTabIconContainer}>
            <Ionicons name="star" size={22} color="#666" />
          </View>
          <Text style={styles.bottomTabText}>Reviews</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomTab}
          onPress={() => navigation.navigate('Group', { tripName: localTripName, tripDays })}
        >
          <View style={styles.bottomTabIconContainer}>
            <Ionicons name="people" size={22} color="#666" />
          </View>
          <Text style={styles.bottomTabText}>Group</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  tripCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFF9E5', // Slightly yellowish white
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    position: 'relative',
    zIndex: 1,
  },
  cardShadowLayer: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: 2,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: '#000',
    opacity: 0.05,
    transform: [{ translateY: 4 }],
  },
  tripNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tripNameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingBottom: 2,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  addButton: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    position: 'relative',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  bookingCard: {
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingIcon: {
    marginRight: 10,
  },
  bookingName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    padding: 5,
    marginRight: 5,
  },
  deleteButton: {
    padding: 5,
  },
  bookingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
  },
  bookingInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    width: '48%',
  },
  dateInputLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#999',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  imageUploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  imageUploadPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  addBookingButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C0C0C0',
  },
  addBookingText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    marginRight: 8,
  },
  bottomTabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12, // Extra padding for iOS
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginBottom: 4,
  },
  bottomTabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  }
});

export default BookingsScreen; 