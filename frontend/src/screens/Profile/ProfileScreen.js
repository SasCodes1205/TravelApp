import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../assets/colors/theme';
import { AuthContext } from '../../utils/AuthContext';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { userInfo, logout } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo?.name || 'Traveler',
    email: userInfo?.email || 'traveler@example.com',
    bio: userInfo?.bio || 'Avid traveler exploring the world one destination at a time.',
    phone: userInfo?.phone || '+1 555-123-4567',
    location: userInfo?.location || 'New York, USA'
  });

  /* 
  BACKEND INTEGRATION:
  1. Fetch user profile data when component mounts:
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get user ID from AuthContext
        const userId = userInfo?._id;
        if (userId) {
          // Fetch user profile data
          const response = await ApiService.auth.getProfile(userId);
          const profileData = response.data;
          
          // Update state with profile data
          setFormData({
            name: profileData.name,
            email: profileData.email,
            bio: profileData.bio,
            phone: profileData.phone,
            location: profileData.location
          });
          
          // Set preferences from backend data
          setNotifications(profileData.preferences?.notifications ?? true);
          setDarkMode(profileData.preferences?.darkMode ?? false);
          setEmailUpdates(profileData.preferences?.emailUpdates ?? true);
          
          // Also fetch real user stats
          // const statsResponse = await ApiService.users.getUserStats(userId);
          // setUserStats(statsResponse.data);
          
          // And trip history
          // const tripsResponse = await ApiService.trips.getUserTrips(userId);
          // setTripHistory(tripsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle error or show error message
      }
    };
    
    fetchUserProfile();
  }, [userInfo?._id]);
  */

  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnim = useRef(new Animated.Value(0.95)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  
  // User stats (mock data)
  const userStats = {
    tripsCount: 15,
    countriesVisited: 7,
    totalDistance: '12,450 km',
    daysOnTrip: 45
  };
  
  // Trip history (mock data)
  const tripHistory = [
    { id: '1', name: 'European Adventure', date: 'May 2023', destinations: 'Paris, Rome, Barcelona' },
    { id: '2', name: 'Asian Tour', date: 'December 2022', destinations: 'Tokyo, Seoul, Bangkok' },
    { id: '3', name: 'American Road Trip', date: 'August 2022', destinations: 'New York, Chicago, LA' }
  ];
  
  useEffect(() => {
    // Animate elements when component mounts
    Animated.stagger(200, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // If we were editing and now we're saving
      Alert.alert(
        "Save Changes",
        "Your profile has been updated!",
        [{ text: "OK" }]
      );
      
      /* 
      BACKEND INTEGRATION:
      Update user profile on the backend:
      
      const updateUserProfile = async () => {
        try {
          // Get user ID from AuthContext
          const userId = userInfo?._id;
          if (userId) {
            // Prepare data for API
            const profileData = {
              ...formData,
              preferences: {
                notifications,
                darkMode,
                emailUpdates
              }
            };
            
            // Send update to backend
            await ApiService.auth.updateProfile(userId, profileData);
            
            // Update the user info in AuthContext if needed
            // setUserInfo({...userInfo, ...formData});
          }
        } catch (error) {
          console.error('Error updating profile:', error);
          Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
      };
      
      updateUserProfile();
      */
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: logout }
      ]
    );
  };
  
  const handleTripPress = (trip) => {
    // In a real app, navigate to trip details
    navigation.navigate('TripDetail', { tripName: trip.name });
  };
  
  // 3D Card Component
  const Card3D = ({ children, style }) => {
    // Card animation values
    const cardScaleAnim = useRef(new Animated.Value(1)).current;
    const cardRotateXAnim = useRef(new Animated.Value(0)).current;
    const cardRotateYAnim = useRef(new Animated.Value(0)).current;
    
    const handlePressIn = () => {
      Animated.parallel([
        Animated.timing(cardScaleAnim, {
          toValue: 0.98,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cardRotateXAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cardRotateYAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    };
    
    const handlePressOut = () => {
      Animated.parallel([
        Animated.spring(cardScaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(cardRotateXAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cardRotateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    };
    
    return (
      <Animated.View
        style={[
          styles.card,
          style,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: cardAnim },
              { scale: cardScaleAnim },
              { 
                rotateX: cardRotateXAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '1deg']
                })
              },
              { 
                rotateY: cardRotateYAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '1deg']
                })
              }
            ]
          }
        ]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        <View style={styles.cardShadowLayer} />
        {children}
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header with animation */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              { 
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Profile</Text>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditToggle}
        >
          <Ionicons 
            name={isEditing ? "checkmark" : "pencil"} 
            size={24} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Avatar */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarShadow} />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{formData.name.charAt(0)}</Text>
            </View>
            
            {isEditing && (
              <TouchableOpacity 
                style={styles.changePhotoButton}
                onPress={() => Alert.alert("Change Photo", "This feature will be available soon!")}
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Your Name"
            />
          ) : (
            <Text style={styles.userName}>{formData.name}</Text>
          )}
          
          {isEditing ? (
            <TextInput
              style={styles.bioInput}
              value={formData.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              placeholder="Your Bio"
              multiline
            />
          ) : (
            <Text style={styles.userBio}>{formData.bio}</Text>
          )}
        </View>
        
        {/* User Stats in a 3D card */}
        <Card3D>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Your Travel Stats</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.tripsCount}</Text>
                <Text style={styles.statLabel}>Trips</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.countriesVisited}</Text>
                <Text style={styles.statLabel}>Countries</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.daysOnTrip}</Text>
                <Text style={styles.statLabel}>Days</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{userStats.totalDistance}</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
            </View>
          </View>
        </Card3D>
        
        {/* Account Information */}
        <Card3D>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Account Information</Text>
            
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={22} color={colors.primary} />
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoText}>{formData.email}</Text>
              )}
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={22} color={colors.primary} />
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{formData.phone}</Text>
              )}
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={22} color={colors.primary} />
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={formData.location}
                  onChangeText={(text) => handleInputChange('location', text)}
                  placeholder="Location"
                />
              ) : (
                <Text style={styles.infoText}>{formData.location}</Text>
              )}
            </View>
          </View>
        </Card3D>
        
        {/* Preferences */}
        <Card3D>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Preferences</Text>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceText}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E0E0E0', true: '#C4E8D1' }}
                thumbColor={notifications ? colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E0E0E0', true: '#C4E8D1' }}
                thumbColor={darkMode ? colors.primary : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceTextContainer}>
                <Text style={styles.preferenceText}>Email Updates</Text>
              </View>
              <Switch
                value={emailUpdates}
                onValueChange={setEmailUpdates}
                trackColor={{ false: '#E0E0E0', true: '#C4E8D1' }}
                thumbColor={emailUpdates ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>
        </Card3D>
        
        {/* Recent Trips */}
        <Card3D>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Recent Trips</Text>
            
            {tripHistory.map((trip) => (
              <TouchableOpacity 
                key={trip.id} 
                style={styles.tripItem}
                onPress={() => handleTripPress(trip)}
              >
                <View style={styles.tripInfo}>
                  <Text style={styles.tripName}>{trip.name}</Text>
                  <Text style={styles.tripDate}>{trip.date}</Text>
                  <Text style={styles.tripDestinations}>{trip.destinations}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#999" />
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Trips')}
            >
              <Text style={styles.viewAllText}>View All Trips</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </Card3D>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        {/* Version info */}
        <Text style={styles.versionText}>App version: 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 16,
  },
  avatarContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  avatarShadow: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    width: width * 0.7,
  },
  userBio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  bioInput: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    padding: 10,
    width: width * 0.8,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#FFF',
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
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  infoInput: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceText: {
    fontSize: 16,
    color: colors.text,
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    padding: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  tripDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tripDestinations: {
    fontSize: 14,
    color: '#999',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 6,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: colors.error || '#ff5252',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  }
});

export default ProfileScreen; 