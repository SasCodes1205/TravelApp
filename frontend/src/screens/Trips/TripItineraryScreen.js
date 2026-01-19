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
  Modal,
  FlatList
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../../assets/colors/theme';

const { width, height } = Dimensions.get('window');

// Generate hour options (from 12 AM to 11:30 PM in 30 min increments)
const timeOptions = [];
const periods = ['AM', 'PM'];

periods.forEach(period => {
  for (let hour = 0; hour < 12; hour++) {
    const displayHour = hour === 0 ? 12 : hour;
    timeOptions.push(`${displayHour}:00 ${period}`);
    timeOptions.push(`${displayHour}:30 ${period}`);
  }
});

// Helper function to convert time string to minutes for comparison
const timeToMinutes = (timeString) => {
  // Extract hour, minute, and period parts
  const [timePart, period] = timeString.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  
  // Convert 12-hour to 24-hour format
  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
};

// Compare two time strings
const isEndTimeAfterStartTime = (startTime, endTime) => {
  return timeToMinutes(endTime) > timeToMinutes(startTime);
};

// Helper functions for calculating time duration and display
const calculateDuration = (startTime, endTime) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
};

// Calculate width percentage for timeline visualization (max 80%)
const calculateDurationWidth = (startTime, endTime) => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;
  
  // Map duration to a reasonable percentage (1h = ~20%, max 80%)
  const percentage = Math.min(80, Math.max(15, durationMinutes / 15));
  return percentage;
};

// Get color based on duration
const getDurationColor = (startTime, endTime) => {
  const durationMinutes = timeToMinutes(endTime) - timeToMinutes(startTime);
  
  if (durationMinutes <= 30) {
    return '#8BC34A'; // Short - light green
  } else if (durationMinutes <= 120) {
    return '#42A5F5'; // Medium - light blue
  } else {
    return '#7E57C2'; // Long - light purple
  }
};

const TripItineraryScreen = ({ route, navigation }) => {
  // Get trip data from route params or use default values
  const { tripName = 'Trip Name', tripDays = 10 } = route.params || {};
  
  const [activeDay, setActiveDay] = useState(1);
  const [timeslots, setTimeslots] = useState([
    { id: '1', startTime: '09:00 AM', endTime: '10:00 AM', place: '', activity: '' }
  ]);
  const [editingTripName, setEditingTripName] = useState(false);
  const [localTripName, setLocalTripName] = useState(tripName);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectingStartTime, setSelectingStartTime] = useState(true);
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch trip data when component mounts:
     
     useEffect(() => {
       const fetchTripData = async () => {
         try {
           // Get tripId from route.params
           const { tripId } = route.params;
           if (tripId) {
             // Fetch trip details
             const tripResponse = await ApiService.trips.getTrip(tripId);
             const trip = tripResponse.data;
             
             // Update state with trip data
             setLocalTripName(trip.name);
             
             // Fetch trip itinerary
             const itineraryResponse = await ApiService.itineraries.getItinerary(trip.itineraryId);
             const itinerary = itineraryResponse.data;
             
             // Process and set timeslots based on the day
             const dayItinerary = itinerary.days.find(day => day.dayNumber === activeDay);
             if (dayItinerary) {
               setTimeslots(dayItinerary.timeslots.map(slot => ({
                 id: slot._id,
                 startTime: slot.startTime,
                 endTime: slot.endTime,
                 place: slot.place,
                 activity: slot.activity
               })));
             }
           }
         } catch (error) {
           console.error('Error fetching trip data:', error);
           // Handle error or show error message
         }
       };
       
       fetchTripData();
     }, [route.params?.tripId]);
  */
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnim = useRef(new Animated.Value(0.95)).current;
  const navBarAnim = useRef(new Animated.Value(0)).current;

  // Tab indicator position (using regular state instead of animated value)
  const [tabIndicatorLeft, setTabIndicatorLeft] = useState(0);

  // Tab options
  const tabOptions = ['Itinerary', 'Bookings', 'Checklists', 'Outfits'];
  const [activeTab, setActiveTab] = useState('Itinerary');
  
  // Refs for scroll views
  const dayScrollRef = useRef(null);
  
  // Plan view options
  const [viewMode, setViewMode] = useState('agenda'); // 'agenda', 'calendar', 'timeline'
  
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
    
    // Set initial tab indicator position
    setTabIndicatorLeft(0);
  }, []);
  
  const animateTabIndicator = (index) => {
    // Calculate the position based on screen width and tab index
    const newPosition = index * (width / tabOptions.length);
    setTabIndicatorLeft(newPosition);
  };

  const handleTabPress = (tab, index) => {
    setActiveTab(tab);
    animateTabIndicator(index);
    
    // Navigate to the appropriate screen based on tab selection
    if (tab === 'Bookings') {
      navigation.navigate('Bookings', { 
        tripName: localTripName,
        tripDays: tripDays
      });
    } else if (tab === 'Checklists') {
      navigation.navigate('Checklists', {
        tripName: localTripName,
        tripDays: tripDays
      });
    } else if (tab === 'Outfits') {
      navigation.navigate('Outfits', {
        tripName: localTripName,
        tripDays: tripDays
      });
    } else if (tab !== 'Itinerary') {
      // Provide feedback for other tabs not yet implemented
      Alert.alert(
        `${tab} Tab`,
        `The ${tab} feature will be available soon!`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    }
  };

  const handleDayPress = (day) => {
    setActiveDay(day);
    
    // Scroll to center the selected day
    if (dayScrollRef.current) {
      const scrollToX = (day - 2) * 90; // Approximate width of each day button
      dayScrollRef.current.scrollTo({ x: scrollToX > 0 ? scrollToX : 0, animated: true });
    }
    
    // Simplify animation to avoid conflicts
    Animated.sequence([
      Animated.timing(cardAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  const handleAddTimeSlot = () => {
    const newTimeslot = {
      id: `${Date.now()}`,
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      place: '',
      activity: ''
    };
    
    setTimeslots([...timeslots, newTimeslot]);
    
    /* 
    BACKEND INTEGRATION:
    Add API call to create a new timeslot:
    
    1. Connect to backend API endpoint: POST /api/itineraries/:itineraryId/days/:dayNumber/timeslots
    2. Implementation:
       try {
         const { tripId } = route.params;
         const newTimeslotData = {
           startTime: '09:00 AM',
           endTime: '10:00 AM',
           place: '',
           activity: '',
           dayNumber: activeDay
         };
         
         const response = await ApiService.itineraries.createTimeslot(
           tripId, 
           activeDay, 
           newTimeslotData
         );
         
         // Update the timeslot with the actual ID from backend
         const createdTimeslot = response.data;
         setTimeslots(prev => [...prev, {
           id: createdTimeslot._id,
           startTime: createdTimeslot.startTime,
           endTime: createdTimeslot.endTime,
           place: createdTimeslot.place,
           activity: createdTimeslot.activity
         }]);
       } catch (error) {
         console.error('Error adding timeslot:', error);
         // Handle error or show error message
       }
    */
  };
  
  const handleRemoveTimeSlot = (id) => {
    if (timeslots.length <= 1) {
      Alert.alert("Cannot Remove", "You need at least one time slot");
      return;
    }
    
    setTimeslots(timeslots.filter(slot => slot.id !== id));
    
    /* 
    BACKEND INTEGRATION:
    Add API call to delete a timeslot:
    
    1. Connect to backend API endpoint: DELETE /api/itineraries/:itineraryId/timeslots/:timeslotId
    2. Implementation:
       try {
         const { tripId } = route.params;
         await ApiService.itineraries.deleteTimeslot(tripId, id);
         
         // UI state is already updated above with the filter
       } catch (error) {
         console.error('Error removing timeslot:', error);
         // Handle error or show error message
         // If error occurs, you might want to revert the UI change
         // by re-fetching the timeslots
       }
    */
  };
  
  const toggleEditTripName = () => {
    if (editingTripName) {
      // Save the new trip name
      Alert.alert("Trip Name Updated", `Trip name changed to "${localTripName}"`);
      
      /* 
      BACKEND INTEGRATION:
      Add API call to update trip name:
      
      1. Connect to backend API endpoint: PUT /api/trips/:tripId
      2. Implementation:
         try {
           const { tripId } = route.params;
           await ApiService.trips.updateTrip(tripId, { name: localTripName });
           
           // Update navigation params to reflect the name change
           navigation.setParams({ tripName: localTripName });
         } catch (error) {
           console.error('Error updating trip name:', error);
           // Handle error or show error message
           // If error occurs, you might want to revert the UI change
           setLocalTripName(tripName); // Revert to original name
         }
      */
    }
    setEditingTripName(!editingTripName);
  };
  
  const handleAutoFill = () => {
    // Sample auto-fill data for demonstration
    const sampleActivities = [
      { startTime: '08:00 AM', endTime: '09:00 AM', place: 'Hotel', activity: 'Breakfast' },
      { startTime: '10:00 AM', endTime: '12:30 PM', place: 'Beach', activity: 'Swimming & sunbathing' },
      { startTime: '01:00 PM', endTime: '02:30 PM', place: 'Restaurant', activity: 'Lunch' },
      { startTime: '03:00 PM', endTime: '05:30 PM', place: 'City center', activity: 'Shopping' },
      { startTime: '07:00 PM', endTime: '09:00 PM', place: 'Local restaurant', activity: 'Dinner' }
    ];
    
    const autoFilledTimeslots = sampleActivities.map((item, index) => ({
      id: `autofill-${Date.now()}-${index}`,
      startTime: item.startTime,
      endTime: item.endTime,
      place: item.place,
      activity: item.activity
    }));
    
    setTimeslots(autoFilledTimeslots);
    
    Alert.alert(
      "Auto-Fill Complete",
      "Your day has been filled with suggested activities!",
      [{ text: 'OK', onPress: () => console.log('Auto-fill applied') }]
    );
  };
  
  const openTimePicker = (slot) => {
    setSelectedSlot(slot);
    setSelectedStartTime(slot.startTime);
    setSelectedEndTime(slot.endTime);
    setSelectingStartTime(true);
    setTimePickerVisible(true);
  };

  const handleTimeSelection = (time) => {
    if (selectingStartTime) {
      setSelectedStartTime(time);
      setSelectingStartTime(false);
    } else {
      // Validate that end time is after start time
      if (!isEndTimeAfterStartTime(selectedStartTime, time)) {
        Alert.alert(
          "Invalid Time Range",
          "End time must be after start time. Please select a later time.",
          [{ text: "OK" }]
        );
        return;
      }
      
      setSelectedEndTime(time);
      
      // Close modal and update the timeslot
      setTimePickerVisible(false);
      
      if (selectedSlot) {
        const updatedSlots = timeslots.map(item => 
          item.id === selectedSlot.id 
            ? {...item, startTime: selectedStartTime, endTime: time} 
            : item
        );
        setTimeslots(updatedSlots);
      }
    }
  };
  
  // Filter times for end time selection to only show times after the start time
  const getFilteredTimeOptions = () => {
    if (selectingStartTime) {
      return timeOptions;
    } else {
      const startTimeMinutes = timeToMinutes(selectedStartTime);
      return timeOptions.filter(time => timeToMinutes(time) > startTimeMinutes);
    }
  };

  // Create array of days based on tripDays
  const dayNumbers = Array.from({ length: tripDays }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F2EA" />
      
      {/* Header with home button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => Alert.alert("Share Trip", "Sharing functionality coming soon!")}
        >
          <Ionicons name="share-social-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Trip card with enhanced 3D effect */}
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
        {tabOptions.map((tab, index) => (
          <TouchableOpacity 
            key={tab}
            style={styles.tab}
            onPress={() => handleTabPress(tab, index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View 
          style={[
            styles.tabIndicator,
            {
              width: width / tabOptions.length,
              left: tabIndicatorLeft
            }
          ]} 
        />
      </View>
      
      {/* Day selector with 3D effect */}
      <View style={styles.daySelectorContainer}>
        <ScrollView 
          ref={dayScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelector}
          decelerationRate="fast"
          snapToInterval={90} // Approximate width of day button + margin
        >
          {dayNumbers.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                activeDay === day && styles.activeDayButton
              ]}
              onPress={() => handleDayPress(day)}
            >
              {/* Shadow layers for 3D effect */}
              {activeDay === day && (
                <>
                  <View style={[styles.buttonShadow, { opacity: 0.08, transform: [{ translateY: 4 }] }]} />
                  <View style={[styles.buttonShadow, { opacity: 0.04, transform: [{ translateY: 2 }] }]} />
                </>
              )}
              <Text 
                style={[
                  styles.dayButtonText,
                  activeDay === day && styles.activeDayButtonText
                ]}
              >
                Day{day}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addDayButton}
            onPress={() => Alert.alert(
              "Add Day",
              "Add another day to your trip?",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Add", 
                  onPress: () => {
                    const newTripDays = tripDays + 1;
                    navigation.setParams({ tripDays: newTripDays });
                    setTimeout(() => {
                      handleDayPress(newTripDays);
                    }, 300);
                  }
                }
              ]
            )}
          >
            <Ionicons name="add-circle" size={22} color={colors.primary} />
            <Text style={styles.addDayText}>Add</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Content area with 3D shadow effects */}
      <View style={styles.contentContainer}>
        <View style={styles.dayHeaderRow}>
          <Text style={styles.dayHeader}>Day {activeDay < 10 ? `0${activeDay}` : activeDay}</Text>
          <TouchableOpacity 
            style={styles.autoFillButton}
            onPress={handleAutoFill}
          >
            <Text style={styles.autoFillText}>Auto Fill</Text>
          </TouchableOpacity>
        </View>
        
        {/* Timeslots */}
        <ScrollView style={styles.timeslotsContainer}>
          {timeslots.map((slot) => (
            <View 
              key={slot.id} 
              style={styles.timeslotCard}
            >
              {/* Shadow layers for 3D depth */}
              <View style={styles.timeslotShadowLayer} />
              
              <View style={styles.timeRow}>
                <View style={styles.timeIndicator}>
                  <Ionicons name="time-outline" size={18} color="#666" />
                </View>
                <View style={styles.timeRangeContainer}>
                  <Text style={styles.timeRangeText}>
                    <Text style={styles.startTimeText}>{slot.startTime}</Text>
                    <Text style={styles.timeRangeSeparator}> - </Text>
                    <Text style={styles.endTimeText}>{slot.endTime}</Text>
                  </Text>
                  <View style={styles.timelineContainer}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineBar} />
                    <View 
                      style={[
                        styles.durationIndicator, 
                        { 
                          width: `${calculateDurationWidth(slot.startTime, slot.endTime)}%`,
                          backgroundColor: getDurationColor(slot.startTime, slot.endTime)
                        }
                      ]} 
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>
                        {calculateDuration(slot.startTime, slot.endTime)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.timeActions}>
                  <TouchableOpacity 
                    style={styles.timeAction}
                    onPress={() => openTimePicker(slot)}
                  >
                    <Ionicons name="pencil" size={16} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.timeAction}
                    onPress={() => handleRemoveTimeSlot(slot.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.placeRow}>
                <Ionicons name="location-outline" size={18} color="#666" />
                <TextInput
                  style={styles.placeInput}
                  placeholder="Add a place"
                  placeholderTextColor="#999"
                  value={slot.place}
                  onChangeText={(text) => {
                    const updatedSlots = timeslots.map(item => 
                      item.id === slot.id ? {...item, place: text} : item
                    );
                    setTimeslots(updatedSlots);
                  }}
                />
                <TouchableOpacity 
                  style={styles.imageContainer}
                  onPress={() => Alert.alert("Add Photo", "Take or select a photo for this location")}
                >
                  <Ionicons name="image-outline" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.activityInput}
                placeholder="Activity"
                placeholderTextColor="#999"
                value={slot.activity}
                onChangeText={(text) => {
                  const updatedSlots = timeslots.map(item => 
                    item.id === slot.id ? {...item, activity: text} : item
                  );
                  setTimeslots(updatedSlots);
                }}
              />
            </View>
          ))}
          
          {/* Add timeslot button */}
          <TouchableOpacity 
            style={styles.addTimeSlotButton}
            onPress={handleAddTimeSlot}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.addTimeSlotText}>add time slot</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Time Picker Modal */}
      <Modal
        visible={timePickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerContainer}>
            <View style={styles.timePickerHeader}>
              <Text style={styles.timePickerTitle}>
                Select {selectingStartTime ? 'Start' : 'End'} Time
              </Text>
              <TouchableOpacity
                onPress={() => setTimePickerVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.timePickerSteps}>
              <View style={[styles.step, selectingStartTime && styles.activeStep]}>
                <View style={[styles.stepNumber, selectingStartTime && styles.activeStepNumber]}>
                  <Text style={[styles.stepNumberText, selectingStartTime && styles.activeStepNumberText]}>1</Text>
                </View>
                <Text style={[styles.stepText, selectingStartTime && styles.activeStepText]}>Start Time</Text>
              </View>
              <View style={styles.stepConnector} />
              <View style={[styles.step, !selectingStartTime && styles.activeStep]}>
                <View style={[styles.stepNumber, !selectingStartTime && styles.activeStepNumber]}>
                  <Text style={[styles.stepNumberText, !selectingStartTime && styles.activeStepNumberText]}>2</Text>
                </View>
                <Text style={[styles.stepText, !selectingStartTime && styles.activeStepText]}>End Time</Text>
              </View>
            </View>
            
            {!selectingStartTime && (
              <View style={styles.timeSelectionPreview}>
                <View style={styles.previewStartTime}>
                  <Text style={styles.previewLabel}>Start</Text>
                  <Text style={styles.previewValue}>{selectedStartTime}</Text>
                </View>
                <View style={styles.previewConnector}>
                  <View style={styles.previewConnectorLine} />
                </View>
                <View style={styles.previewEndTime}>
                  <Text style={styles.previewLabel}>End</Text>
                  <Text style={styles.previewValue}>Selecting...</Text>
                </View>
              </View>
            )}
            
            <FlatList
              data={selectingStartTime ? timeOptions : getFilteredTimeOptions()}
              keyExtractor={(item) => item}
              style={styles.timeList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.timeOption,
                    (selectingStartTime && item === selectedStartTime) || 
                    (!selectingStartTime && item === selectedEndTime)
                      ? styles.selectedTimeOption 
                      : null
                  ]}
                  onPress={() => handleTimeSelection(item)}
                >
                  <Text style={[
                    styles.timeOptionText,
                    (selectingStartTime && item === selectedStartTime) || 
                    (!selectingStartTime && item === selectedEndTime)
                      ? styles.selectedTimeOptionText 
                      : null
                  ]}>
                    {item}
                  </Text>
                  {((selectingStartTime && item === selectedStartTime) || 
                    (!selectingStartTime && item === selectedEndTime)) && (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            
            {!selectingStartTime && selectedEndTime && (
              <View style={styles.selectedTimeDisplay}>
                <Text style={styles.selectedTimeLabel}>Selected Time Range:</Text>
                <Text style={styles.selectedTimeValue}>
                  {selectedStartTime} - {selectedEndTime}
                </Text>
                <Text style={styles.durationPreview}>
                  ({calculateDuration(selectedStartTime, selectedEndTime)})
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Bottom tab bar with animation */}
      <Animated.View 
        style={[
          styles.bottomTabBar,
          {
            transform: [
              { translateY: navBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              }) }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={[styles.bottomTab, styles.activeBottomTab]}
          onPress={() => {
            // Adding navigation ability for when other tabs might try to navigate back here
            navigation.navigate('TripItinerary', { tripName: localTripName, tripDays });
          }}
        >
          <View style={[styles.bottomTabIconContainer, styles.activeTabIconContainer]}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Plan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomTab}
          onPress={() => navigation.navigate('Gallery', { tripName: localTripName, tripDays })}
        >
          <View style={styles.bottomTabIconContainer}>
            <Ionicons name="image" size={24} color="#666" />
          </View>
          <Text style={styles.bottomTabText}>Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomTab}
          onPress={() => navigation.navigate('Reviews', { tripName: localTripName, tripDays })}
        >
          <View style={styles.bottomTabIconContainer}>
            <Ionicons name="star" size={24} color="#666" />
          </View>
          <Text style={styles.bottomTabText}>Reviews</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomTab}
          onPress={() => navigation.navigate('Group', { tripName: localTripName, tripDays })}
        >
          <View style={styles.bottomTabIconContainer}>
            <Ionicons name="people" size={24} color="#666" />
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
    backgroundColor: '#F5F2EA', // Light cream background
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
  shareButton: {
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
    backgroundColor: '#FEF9E7', // Lighter yellowish white
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    // Enhanced 3D effect with shadow
    backfaceVisibility: 'hidden',
    perspective: 1000,
    position: 'relative',
    zIndex: 1,
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
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  daySelectorContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  daySelector: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    backgroundColor: '#000',
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
  dayButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    position: 'relative',
    zIndex: 1,
    overflow: 'visible',
    minWidth: 70,
    alignItems: 'center',
  },
  activeDayButton: {
    backgroundColor: colors.lightBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 5,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeDayButtonText: {
    color: '#000',
  },
  addDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addDayText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  autoFillButton: {
    backgroundColor: '#A3D0B5', // Light green
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  autoFillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeslotsContainer: {
    flex: 1,
  },
  timeslotCard: {
    backgroundColor: '#E6E7EF', // Light grayish blue
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    // Enhanced 3D effect
    backfaceVisibility: 'hidden',
    perspective: 1000,
    transform: [{ rotateX: '2deg' }],
    position: 'relative',
    zIndex: 1,
  },
  timeslotShadowLayer: {
    position: 'absolute',
    top: 2,
    left: 1,
    right: 1,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: '#000',
    opacity: 0.06,
    transform: [{ translateY: 3 }],
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  timeRangeContainer: {
    flex: 1,
    position: 'relative',
    paddingBottom: 12,
  },
  timeRangeText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  startTimeText: {
    fontWeight: '600',
    color: '#3D6E9C', // A blue shade for start time
  },
  timeRangeSeparator: {
    color: '#666',
  },
  endTimeText: {
    fontWeight: '600',
    color: '#A83A3B', // A red shade for end time
  },
  timelineContainer: {
    position: 'relative',
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingRight: 70, // Make room for duration badge
    marginBottom: 4,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3D6E9C',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  timelineBar: {
    position: 'absolute',
    left: 4,
    top: 14,
    width: '87%',
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.08)',
    zIndex: 1,
  },
  durationIndicator: {
    position: 'absolute',
    left: 4,
    top: 11,
    height: 8,
    borderRadius: 4,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    opacity: 0.85,
  },
  durationBadge: {
    position: 'absolute',
    right: 0,
    top: 3,
    paddingVertical: 3,
    paddingHorizontal: 9,
    backgroundColor: 'white',
    borderRadius: 12,
    zIndex: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  quickEditButton: {
    position: 'absolute',
    left: 16,
    top: 0,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    zIndex: 3,
  },
  timeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAction: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeInput: {
    flex: 1,
    marginLeft: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 40,
  },
  imageContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  activityInput: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 40,
  },
  addTimeSlotButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(66, 133, 244, 0.08)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  addTimeSlotText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
    color: colors.primary,
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
  },
  activeBottomTab: {
    // Styles for the active tab
  },
  activeTabIconContainer: {
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
  },
  activeBottomTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  
  // Time Picker Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContainer: {
    width: width * 0.85,
    height: height * 0.6,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  timePickerSteps: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  step: {
    alignItems: 'center',
    opacity: 0.6,
  },
  activeStep: {
    opacity: 1,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStepNumber: {
    backgroundColor: colors.primary,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#757575',
  },
  activeStepNumberText: {
    color: 'white',
  },
  stepText: {
    fontSize: 12,
    color: '#757575',
  },
  activeStepText: {
    fontWeight: 'bold',
    color: '#333',
  },
  stepConnector: {
    width: 40,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  timeSelectionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(66, 133, 244, 0.05)',
  },
  previewStartTime: {
    flex: 2,
    alignItems: 'center',
  },
  previewConnector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewConnectorLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#BDBDBD',
  },
  previewEndTime: {
    flex: 2,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeList: {
    flex: 1,
  },
  timeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedTimeOption: {
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeOptionText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  selectedTimeDisplay: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  selectedTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectedTimeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  durationPreview: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
});

export default TripItineraryScreen; 