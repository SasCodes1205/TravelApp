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
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/colors/theme';

const { width, height } = Dimensions.get('window');

// Initial outfits data
const initialOutfits = [
  { id: '1', name: 'outfit01', image: null }
];

const OutfitsScreen = ({ route, navigation }) => {
  // Get trip data from route params or use default values
  const { tripName = 'Trip Name', tripDays = 10 } = route.params || {};
  
  const [outfits, setOutfits] = useState(initialOutfits);
  const [editingTripName, setEditingTripName] = useState(false);
  const [localTripName, setLocalTripName] = useState(tripName);
  const [activeDay, setActiveDay] = useState(1);
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch trip outfits when component mounts:
  
  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        // Get tripId from route.params
        const { tripId } = route.params;
        if (tripId) {
          // Fetch outfits for this trip
          const response = await ApiService.outfits.getTripOutfits(tripId);
          const outfitsData = response.data;
          
          // Update state with outfits data
          setOutfits(outfitsData.map(outfit => ({
            id: outfit._id,
            name: outfit.name,
            image: outfit.imageUrl || null,
            day: outfit.day,
            weather: outfit.weather,
            activities: outfit.activities
          })));
        }
      } catch (error) {
        console.error('Error fetching outfits:', error);
        // Handle error or show error message
      }
    };
    
    fetchOutfits();
  }, [route.params?.tripId]);
  */
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnim = useRef(new Animated.Value(0.95)).current;
  const navBarAnim = useRef(new Animated.Value(0)).current;

  // Tab options
  const tabOptions = ['Itinerary', 'Bookings', 'Checklists', 'Outfits'];
  const [activeTab, setActiveTab] = useState('Outfits');
  
  // Refs for scroll views
  const dayScrollRef = useRef(null);
  
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
      navigation.navigate('Bookings', { tripName: localTripName, tripDays });
    } else if (tab === 'Checklists') {
      navigation.navigate('Checklists', { tripName: localTripName, tripDays });
    } else if (tab === 'Outfits') {
      // We're already here
    }
  };

  const toggleEditTripName = () => {
    setEditingTripName(!editingTripName);
  };

  const handleDayPress = (day) => {
    setActiveDay(day);
    
    // Scroll to center the selected day
    if (dayScrollRef.current) {
      const scrollToX = (day - 2) * 80; // Approximate width of each day button
      dayScrollRef.current.scrollTo({ x: scrollToX > 0 ? scrollToX : 0, animated: true });
    }
    
    // Simple animation for day selection
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

  const handleAddOutfit = () => {
    const newOutfit = { 
      id: Date.now().toString(), 
      name: `outfit${outfits.length + 1}`,
      image: null
    };
    setOutfits([...outfits, newOutfit]);
    
    /* 
    BACKEND INTEGRATION:
    Create new outfit on the backend:
    
    const createOutfit = async () => {
      try {
        const { tripId } = route.params;
        const outfitData = {
          tripId: tripId,
          name: `outfit${outfits.length + 1}`,
          day: activeDay
        };
        
        // Send request to create outfit
        const response = await ApiService.outfits.createOutfit(outfitData);
        const createdOutfit = response.data;
        
        // Update local state with real ID from backend
        setOutfits(prevOutfits => 
          prevOutfits.map(outfit => 
            outfit.id === newOutfit.id 
              ? { ...outfit, id: createdOutfit._id } 
              : outfit
          )
        );
      } catch (error) {
        console.error('Error creating outfit:', error);
        // Remove the outfit if there's an error
        setOutfits(outfits);
        Alert.alert('Error', 'Failed to create outfit. Please try again.');
      }
    };
    
    createOutfit();
    */
  };

  const handleDeleteOutfit = (id) => {
    Alert.alert(
      "Delete Outfit",
      "Are you sure you want to delete this outfit?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setOutfits(outfits.filter(outfit => outfit.id !== id));
            
            /* 
            BACKEND INTEGRATION:
            Delete outfit from the backend:
            
            const deleteOutfit = async () => {
              try {
                // Send request to delete outfit
                await ApiService.outfits.deleteOutfit(id);
                
                // UI state is already updated above with the filter
              } catch (error) {
                console.error('Error deleting outfit:', error);
                // Restore the outfit if there's an error
                const deletedOutfit = outfits.find(outfit => outfit.id === id);
                if (deletedOutfit) {
                  setOutfits(prevOutfits => [...prevOutfits, deletedOutfit]);
                }
                Alert.alert('Error', 'Failed to delete outfit. Please try again.');
              }
            };
            
            deleteOutfit();
            */
          }
        }
      ]
    );
  };

  const handleEditOutfit = (id) => {
    Alert.alert(
      "Edit Outfit",
      "Edit outfit name or upload a photo",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Edit", onPress: () => console.log("Edit outfit", id) }
      ]
    );
    
    /* 
    BACKEND INTEGRATION:
    Update outfit details and upload photos:
    
    // Implementation for editing outfit name
    const editOutfitName = async (outfitId, newName) => {
      try {
        // Update outfit in the backend
        await ApiService.outfits.updateOutfit(outfitId, { name: newName });
        
        // Update in local state
        setOutfits(prevOutfits => 
          prevOutfits.map(outfit => 
            outfit.id === outfitId 
              ? { ...outfit, name: newName } 
              : outfit
          )
        );
      } catch (error) {
        console.error('Error updating outfit name:', error);
        Alert.alert('Error', 'Failed to update outfit. Please try again.');
      }
    };
    
    // Implementation for uploading outfit photo
    const uploadOutfitPhoto = async (outfitId, photoUri) => {
      try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append('photo', {
          uri: photoUri,
          name: 'outfit_photo.jpg',
          type: 'image/jpeg'
        });
        
        // Upload photo to backend
        const response = await ApiService.outfits.uploadOutfitPhoto(outfitId, formData);
        const imageUrl = response.data.imageUrl;
        
        // Update in local state
        setOutfits(prevOutfits => 
          prevOutfits.map(outfit => 
            outfit.id === outfitId 
              ? { ...outfit, image: imageUrl } 
              : outfit
          )
        );
      } catch (error) {
        console.error('Error uploading outfit photo:', error);
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    };
    
    // Replace console.log with these functions
    */
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
      
      {/* Outfits Content */}
      <ScrollView style={styles.contentContainer}>
        {outfits.map((outfit) => (
          <View key={outfit.id} style={styles.outfitCard}>
            <View style={styles.outfitHeader}>
              <Text style={styles.outfitName}>{outfit.name}</Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteOutfit(outfit.id)}
              >
                <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.outfitImageContainer}>
              {outfit.image ? (
                <Image 
                  source={{ uri: outfit.image }} 
                  style={styles.outfitImage} 
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.outfitPlaceholder}>
                  <Ionicons name="image-outline" size={48} color="#999" />
                </View>
              )}
              <TouchableOpacity 
                style={styles.editImageButton}
                onPress={() => handleEditOutfit(outfit.id)}
              >
                <Ionicons name="pencil" size={18} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {/* Add Outfit Button */}
        <TouchableOpacity 
          style={styles.addOutfitButton}
          onPress={handleAddOutfit}
        >
          <Text style={styles.addOutfitText}>add outfit</Text>
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
    backgroundColor: colors.lightBlue || '#A3C7E9',
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
    paddingHorizontal: 16,
    marginTop: 10,
  },
  outfitCard: {
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
  outfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  outfitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
  outfitImageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  outfitImage: {
    width: '100%',
    height: '100%',
  },
  outfitPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addOutfitButton: {
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
  addOutfitText: {
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

export default OutfitsScreen; 