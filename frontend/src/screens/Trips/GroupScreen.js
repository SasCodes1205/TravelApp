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

// Initial group members data
const initialMembers = [
  { id: '1', name: 'User01', role: 'Owner', avatar: null },
  { id: '2', name: 'User02', role: '', avatar: null },
  { id: '3', name: 'User03', role: '', avatar: null }
];

const GroupScreen = ({ route, navigation }) => {
  // Get trip data from route params or use default values
  const { tripName = 'Trip Name', tripDays = 10 } = route.params || {};
  
  const [members, setMembers] = useState(initialMembers);
  const [editingTripName, setEditingTripName] = useState(false);
  const [localTripName, setLocalTripName] = useState(tripName);
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch trip members when component mounts:
  
  useEffect(() => {
    const fetchTripMembers = async () => {
      try {
        // Get tripId from route.params
        const { tripId } = route.params;
        if (tripId) {
          // Fetch members for this trip
          const response = await ApiService.trips.getTripMembers(tripId);
          const membersData = response.data;
          
          // Update state with members data
          setMembers(membersData.map(member => ({
            id: member._id,
            name: member.name || member.email,
            role: member.role || '',
            avatar: member.avatarUrl || null,
            email: member.email
          })));
        }
      } catch (error) {
        console.error('Error fetching trip members:', error);
        // Handle error or show error message
      }
    };
    
    fetchTripMembers();
  }, [route.params?.tripId]);
  */
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnim = useRef(new Animated.Value(0.95)).current;
  const navBarAnim = useRef(new Animated.Value(0)).current;
  
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
  
  const toggleEditTripName = () => {
    setEditingTripName(!editingTripName);
  };

  const handleAddMember = () => {
    Alert.alert(
      "Add a Friend",
      "Select someone from your contacts or invite via email",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Invite via Email", onPress: () => console.log("Invite via email") },
        { text: "Select from Contacts", onPress: () => console.log("Select from contacts") }
      ]
    );
    
    /* 
    BACKEND INTEGRATION:
    Add member to trip:
    
    // Implementation for inviting via email
    const inviteViaEmail = async () => {
      try {
        // Show prompt for email input
        // Example with a custom prompt component or additional Alert
        
        // Once we have the email
        const email = 'user@example.com'; // This would come from user input
        const { tripId } = route.params;
        
        // Send invitation to backend
        const response = await ApiService.trips.inviteMember(tripId, { email });
        
        // If the backend returns the member object right away
        const invitedMember = response.data;
        
        // Add new member to local state
        setMembers(prevMembers => [
          ...prevMembers, 
          {
            id: invitedMember._id,
            name: invitedMember.email, // Use email as name initially
            role: 'Invited', // Indicate pending status
            avatar: null
          }
        ]);
        
        Alert.alert('Success', 'Invitation sent to ' + email);
      } catch (error) {
        console.error('Error inviting member:', error);
        Alert.alert('Error', 'Failed to send invitation. Please try again.');
      }
    };
    
    // Implementation for selecting from contacts
    const selectFromContacts = async () => {
      try {
        // Use contacts API to get user contacts
        // This would integrate with the device contacts
        
        // Once a contact is selected
        const selectedContact = { name: 'User04', email: 'user04@example.com' };
        const { tripId } = route.params;
        
        // Send invitation to backend
        const response = await ApiService.trips.inviteMember(tripId, { 
          email: selectedContact.email,
          name: selectedContact.name
        });
        
        // If the backend returns the member object right away
        const invitedMember = response.data;
        
        // Add new member to local state
        setMembers(prevMembers => [
          ...prevMembers, 
          {
            id: invitedMember._id,
            name: invitedMember.name || invitedMember.email,
            role: 'Invited',
            avatar: null
          }
        ]);
        
        Alert.alert('Success', 'Invitation sent to ' + selectedContact.name);
      } catch (error) {
        console.error('Error inviting contact:', error);
        Alert.alert('Error', 'Failed to send invitation. Please try again.');
      }
    };
    
    // Replace console.log with these functions
    */
  };

  const handleDeleteMember = (id) => {
    // Don't allow deleting the owner
    const member = members.find(m => m.id === id);
    if (member.role === 'Owner') {
      Alert.alert(
        "Cannot Delete Owner",
        "The trip owner cannot be removed from the group."
      );
      return;
    }

    Alert.alert(
      "Remove Member",
      "Are you sure you want to remove this member from your trip?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            setMembers(members.filter(member => member.id !== id));
            
            /* 
            BACKEND INTEGRATION:
            Remove member from the trip:
            
            const removeMember = async () => {
              try {
                const { tripId } = route.params;
                
                // Send request to remove member
                await ApiService.trips.removeMember(tripId, id);
                
                // UI state is already updated above with the filter
              } catch (error) {
                console.error('Error removing member:', error);
                // Restore the member if there's an error
                const removedMember = members.find(member => member.id === id);
                if (removedMember) {
                  setMembers(prevMembers => [...prevMembers, removedMember]);
                }
                Alert.alert('Error', 'Failed to remove member. Please try again.');
              }
            };
            
            removeMember();
            */
          }
        }
      ]
    );
  };

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
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.dateText}>from-to</Text>
          </TouchableOpacity>
          
          <View style={styles.membersRow}>
            <TouchableOpacity 
              style={styles.members}
              onPress={() => {}}
            >
              <Ionicons name="people-outline" size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddMember}
            >
              <Ionicons name="add" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      
      {/* Group Members Content */}
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.memberContentContainer}
      >
        {members.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              {member.role ? (
                <Text style={styles.memberRole}>{member.role}</Text>
              ) : null}
            </View>
            
            <View style={styles.memberActions}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color="#666" />
              </View>
              
              {member.role !== 'Owner' && (
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMember(member.id)}
                >
                  <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        
        {/* Add Member Button */}
        <TouchableOpacity 
          style={styles.addMemberButton}
          onPress={handleAddMember}
        >
          <Text style={styles.addMemberText}>Add a Friend</Text>
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
          style={[styles.bottomTab, styles.activeBottomTab]}
          onPress={() => navigation.navigate('Group', { tripName: localTripName, tripDays })}
        >
          <View style={[styles.bottomTabIconContainer, styles.activeTabIconContainer]}>
            <Ionicons name="people" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Group</Text>
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
  contentContainer: {
    flex: 1,
  },
  memberContentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DADADA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  memberRole: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 8,
  },
  deleteButton: {
    padding: 5,
  },
  addMemberButton: {
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addMemberText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
  activeBottomTab: {
    // Styles for the active tab
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
  activeTabIconContainer: {
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
  },
  bottomTabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeBottomTabText: {
    color: colors.primary,
    fontWeight: '600',
  }
});

export default GroupScreen; 