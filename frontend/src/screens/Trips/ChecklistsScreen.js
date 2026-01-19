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
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/colors/theme';

const { width, height } = Dimensions.get('window');

// Initial checklist data
const initialChecklists = [
  {
    id: '1',
    name: 'Checklist1',
    items: [
      { id: '1-1', text: 'item 01', completed: false },
      { id: '1-2', text: 'item 01', completed: false },
      { id: '1-3', text: 'item 01', completed: true },
      { id: '1-4', text: 'item 01', completed: false },
    ]
  }
];

const ChecklistsScreen = ({ route, navigation }) => {
  // Get trip data from route params or use default values
  const { tripName = 'Trip Name', tripDays = 10 } = route.params || {};
  
  const [checklists, setChecklists] = useState(initialChecklists);
  const [editingTripName, setEditingTripName] = useState(false);
  const [localTripName, setLocalTripName] = useState(tripName);
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch checklists data when component mounts:
  
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        // Get tripId from route.params
        const { tripId } = route.params;
        if (tripId) {
          // Fetch checklists for this trip
          const response = await ApiService.checklists.getTripChecklists(tripId);
          const checklistsData = response.data;
          
          // Update state with checklists data
          setChecklists(checklistsData.map(checklist => ({
            id: checklist._id,
            name: checklist.name,
            items: checklist.items.map(item => ({
              id: item._id,
              text: item.text,
              completed: item.completed
            }))
          })));
        }
      } catch (error) {
        console.error('Error fetching checklists:', error);
        // Handle error or show error message
      }
    };
    
    fetchChecklists();
  }, [route.params?.tripId]);
  */
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnim = useRef(new Animated.Value(0.95)).current;
  const navBarAnim = useRef(new Animated.Value(0)).current;

  // Tab options
  const tabOptions = ['Itinerary', 'Bookings', 'Checklists', 'Outfits'];
  const [activeTab, setActiveTab] = useState('Checklists');
  
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
      // We're already here
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

  const toggleItemCompletion = (checklistId, itemId) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedItems = checklist.items.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
        return { ...checklist, items: updatedItems };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
    
    /* 
    BACKEND INTEGRATION:
    Update item completion status on the backend:
    
    const updateItemStatus = async () => {
      try {
        // Find the item to get its current status
        const checklist = checklists.find(c => c.id === checklistId);
        const item = checklist.items.find(i => i.id === itemId);
        const newStatus = !item.completed;
        
        // Send update to backend
        await ApiService.checklists.updateChecklistItem(checklistId, itemId, {
          completed: newStatus
        });
      } catch (error) {
        console.error('Error updating item status:', error);
        // Revert the UI change if there's an error
        setChecklists(checklists); // Reset to previous state
        Alert.alert('Error', 'Failed to update item. Please try again.');
      }
    };
    
    updateItemStatus();
    */
  };

  const handleAddItem = (checklistId) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        const newItem = {
          id: `${checklistId}-${Date.now()}`,
          text: 'item 01',
          completed: false
        };
        return { ...checklist, items: [...checklist.items, newItem] };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
    
    /* 
    BACKEND INTEGRATION:
    Add new item to checklist on the backend:
    
    const addItemToBackend = async () => {
      try {
        const newItemData = {
          text: 'item 01',
          completed: false
        };
        
        // Send new item to backend
        const response = await ApiService.checklists.addChecklistItem(checklistId, newItemData);
        
        // Update the local state with the new ID from backend
        const newItemWithId = response.data;
        const finalChecklists = checklists.map(checklist => {
          if (checklist.id === checklistId) {
            const updatedItems = [...checklist.items];
            // Replace the temporary ID with the real one from backend
            updatedItems[updatedItems.length - 1].id = newItemWithId._id;
            return { ...checklist, items: updatedItems };
          }
          return checklist;
        });
        setChecklists(finalChecklists);
      } catch (error) {
        console.error('Error adding item:', error);
        // Remove the item if there's an error
        setChecklists(checklists); // Reset to previous state
        Alert.alert('Error', 'Failed to add item. Please try again.');
      }
    };
    
    addItemToBackend();
    */
  };

  const handleAddChecklist = () => {
    const newChecklist = {
      id: Date.now().toString(),
      name: `Checklist${checklists.length + 1}`,
      items: [
        { id: `${Date.now()}-1`, text: 'item 01', completed: false },
      ]
    };
    setChecklists([...checklists, newChecklist]);
    
    /* 
    BACKEND INTEGRATION:
    Add new checklist on the backend:
    
    const addChecklistToBackend = async () => {
      try {
        const { tripId } = route.params;
        const newChecklistData = {
          tripId: tripId,
          name: `Checklist${checklists.length + 1}`,
          items: [{ text: 'item 01', completed: false }]
        };
        
        // Send new checklist to backend
        const response = await ApiService.checklists.createChecklist(newChecklistData);
        
        // Update local state with real IDs from backend
        const createdChecklist = response.data;
        setChecklists(prevChecklists => 
          prevChecklists.map(checklist => 
            checklist.id === newChecklist.id ? {
              id: createdChecklist._id,
              name: createdChecklist.name,
              items: createdChecklist.items.map(item => ({
                id: item._id,
                text: item.text,
                completed: item.completed
              }))
            } : checklist
          )
        );
      } catch (error) {
        console.error('Error adding checklist:', error);
        // Remove the checklist if there's an error
        setChecklists(checklists.filter(checklist => checklist.id !== newChecklist.id));
        Alert.alert('Error', 'Failed to add checklist. Please try again.');
      }
    };
    
    addChecklistToBackend();
    */
  };

  const handleDeleteChecklist = (checklistId) => {
    Alert.alert(
      "Delete Checklist",
      "Are you sure you want to delete this checklist?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setChecklists(checklists.filter(checklist => checklist.id !== checklistId));
            
            /* 
            BACKEND INTEGRATION:
            Delete checklist on the backend:
            
            const deleteChecklistFromBackend = async () => {
              try {
                // Send delete request to backend
                await ApiService.checklists.deleteChecklist(checklistId);
                
                // UI state is already updated above with the filter
              } catch (error) {
                console.error('Error deleting checklist:', error);
                // Restore the checklist if there's an error
                const deletedChecklist = checklists.find(checklist => checklist.id === checklistId);
                if (deletedChecklist) {
                  setChecklists(prevChecklists => [...prevChecklists, deletedChecklist]);
                }
                Alert.alert('Error', 'Failed to delete checklist. Please try again.');
              }
            };
            
            deleteChecklistFromBackend();
            */
          }
        }
      ]
    );
  };

  const updateItemText = (checklistId, itemId, newText) => {
    const updatedChecklists = checklists.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedItems = checklist.items.map(item => {
          if (item.id === itemId) {
            return { ...item, text: newText };
          }
          return item;
        });
        return { ...checklist, items: updatedItems };
      }
      return checklist;
    });
    setChecklists(updatedChecklists);
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
      
      {/* Checklists Content */}
      <ScrollView style={styles.contentContainer}>
        {checklists.map((checklist) => (
          <View key={checklist.id} style={styles.checklistCard}>
            <View style={styles.checklistHeader}>
              <Text style={styles.checklistName}>{checklist.name}</Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteChecklist(checklist.id)}
              >
                <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
            
            {checklist.items.map((item) => (
              <View key={item.id} style={styles.checklistItem}>
                <TextInput
                  style={styles.itemText}
                  value={item.text}
                  onChangeText={(text) => updateItemText(checklist.id, item.id, text)}
                />
                <Switch
                  value={item.completed}
                  onValueChange={() => toggleItemCompletion(checklist.id, item.id)}
                  trackColor={{ false: '#E0E0E0', true: '#C4E8D1' }}
                  thumbColor={item.completed ? '#4BAF7A' : '#f4f3f4'}
                />
              </View>
            ))}
            
            {/* Add Item Button */}
            <TouchableOpacity 
              style={styles.addItemButton}
              onPress={() => handleAddItem(checklist.id)}
            >
              <Text style={styles.addItemText}>Add item</Text>
              <Ionicons name="add" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Add Checklist Button */}
        <TouchableOpacity 
          style={styles.addChecklistButton}
          onPress={handleAddChecklist}
        >
          <Text style={styles.addChecklistText}>add checklist</Text>
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
  checklistCard: {
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
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checklistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 5,
  },
  addItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 5,
  },
  addChecklistButton: {
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
  addChecklistText: {
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

export default ChecklistsScreen; 