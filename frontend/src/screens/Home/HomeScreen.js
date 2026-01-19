import React, { useContext, useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  Animated,
  Platform,
  Modal,
  Alert
} from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import colors from '../../assets/colors/theme';
import ActualLogo from '../../components/ActualLogo';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../../services/api';

const { width } = Dimensions.get('window');

// Mock data for popular destinations
const popularDestinations = [
  { id: '1', name: 'Colombo', emoji: '🏙️', description: 'Capital city with vibrant culture' },
  { id: '2', name: 'Kandy', emoji: '⛰️', description: 'Home of the Temple of the Tooth Relic' },
  { id: '3', name: 'Galle', emoji: '🏰', description: 'Historic fort town on the coast' },
  { id: '4', name: 'Ella', emoji: '🌄', description: 'Mountain paradise with scenic views' },
  { id: '5', name: 'Sigiriya', emoji: '🗿', description: 'Ancient rock fortress' },
];

// Mock data for activities
const popularActivities = [
  { id: '1', name: 'Beaches', emoji: '🏖️' },
  { id: '2', name: 'Hiking', emoji: '🥾' },
  { id: '3', name: 'Wildlife', emoji: '🐘' },
  { id: '4', name: 'Temples', emoji: '🛕' },
  { id: '5', name: 'Tea Plantations', emoji: '🍵' },
];

// Mock data for weather
const currentWeather = {
  temp: '30°C',
  condition: 'Sunny',
  icon: '☀️',
  location: 'Colombo'
};

// Mock trip data to match the image
const mockTrips = {
  current: [
    { id: '1', name: 'downsouth', dates: '12-15 Sep 2023', image: null },
    { id: '2', name: 'Kandy', dates: '20-22 Oct 2023', image: null },
    { id: '3', name: 'Ella', dates: '5-10 Nov 2023', image: null },
  ],
  upcoming: [
    { id: '4', name: 'Galle', dates: '15-18 Dec 2023', image: null },
    { id: '5', name: 'Nuwara Eliya', dates: '1-5 Jan 2024', image: null },
  ],
  past: [
    { id: '6', name: 'Colombo', dates: '5-8 Jul 2023', image: null },
    { id: '7', name: 'Trincomalee', dates: '10-15 Aug 2023', image: null },
  ]
};

// Destination Card Component
const DestinationCard = ({ item, onPress }) => {
  const cardScale = useRef(new Animated.Value(1)).current;
  const cardRotate = useRef(new Animated.Value(0)).current;
  
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(cardScale, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardRotate, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardRotate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const cardTransform = {
    transform: [
      { scale: cardScale },
      { 
        rotateY: cardRotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '5deg']
        })
      }
    ]
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.destinationCard, cardTransform]}>
        <View style={styles.destinationEmoji}>
          <Text style={styles.emojiText}>{item.emoji}</Text>
        </View>
        <View style={styles.destinationInfo}>
          <Text style={styles.destinationName}>{item.name}</Text>
          <Text style={styles.destinationDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.destinationFooter}>
            <Text style={styles.exploreText}>Explore</Text>
            <Ionicons name="arrow-forward-circle" size={20} color={colors.primary} />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Activity Card Component
const ActivityButton = ({ item }) => {
  const [pressed, setPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    setPressed(true);
    Animated.timing(scaleAnim, {
      toValue: 0.92,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePress = () => {
    alert(`You selected ${item.name} activity!`);
  };
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View 
        style={[
          styles.activityButton,
          pressed && styles.activityButtonPressed,
          { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.activityEmojiContainer}>
          <Text style={styles.activityEmoji}>{item.emoji}</Text>
        </View>
        <Text style={styles.activityName}>{item.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Trip Item Component
const TripItem = ({ item, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };
  
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View 
        style={[
          styles.tripItem,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 2]
              })}
            ],
            shadowOpacity: translateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.25]
            })
          }
        ]}
      >
        <Text style={styles.tripName}>{item.name}</Text>
        <View style={styles.tripInfoRow}>
          <View style={styles.tripDateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#666" style={styles.tripIcon} />
            <Text style={styles.tripDate}>{item.dates}</Text>
          </View>
          <View style={styles.tripImageContainer}>
            {item.image ? (
              <Image source={item.image} style={styles.tripImage} />
            ) : (
              <View style={styles.tripImagePlaceholder}>
                <Ionicons name="image-outline" size={18} color="#999" />
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Enhanced WeatherCard Component with animations
const WeatherCard = () => {
  // Animation values for the clouds
  const cloud1Animation = useRef(new Animated.Value(0)).current;
  const cloud2Animation = useRef(new Animated.Value(0)).current;
  const clockPulseAnim = useRef(new Animated.Value(1)).current;
  
  // Time state
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentSeconds, setCurrentSeconds] = useState(0);
  
  useEffect(() => {
    // Animation for the first cloud - slower
    Animated.loop(
      Animated.timing(cloud1Animation, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();
    
    // Animation for the second cloud - faster
    Animated.loop(
      Animated.timing(cloud2Animation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
    
    // Clock pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(clockPulseAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(clockPulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ).start();
    
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      setCurrentTime(`${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`);
      setCurrentSeconds(seconds);
      
      // Format date: e.g., "Mon, 15 May"
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setCurrentDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`);
    };
    
    // Initial update
    updateTime();
    
    // Set interval to update time every second
    const interval = setInterval(updateTime, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Interpolate animations for cloud movement
  const cloud1Position = cloud1Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 250]
  });
  
  const cloud2Position = cloud2Animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 300]
  });

  return (
    <View style={styles.weatherCardContainer}>
      <View style={styles.weatherCard}>
        {/* Animated clouds */}
        <Animated.View 
          style={[
            styles.cloudIcon,
            { transform: [{ translateX: cloud1Position }], top: 5, opacity: 0.7 }
          ]}
        >
          <Text style={styles.cloudEmoji}>☁️</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.cloudIcon,
            { transform: [{ translateX: cloud2Position }], top: 30, opacity: 0.5 }
          ]}
        >
          <Text style={styles.cloudEmoji}>☁️</Text>
        </Animated.View>
        
        {/* Weather content */}
        <View style={styles.weatherContent}>
          <View style={styles.weatherIconContainer}>
            <Text style={styles.weatherIcon}>{currentWeather.icon}</Text>
          </View>
          
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherTemp}>{currentWeather.temp}</Text>
            <Text style={styles.weatherCondition}>{currentWeather.condition}</Text>
            <Text style={styles.weatherLocation}>{currentWeather.location}</Text>
          </View>
          
          {/* Clock component */}
          <TouchableOpacity 
            style={styles.clockContainer}
            onPress={() => Alert.alert("Time", "Current local time", [{ text: "OK" }])}
          >
            <Animated.Text 
              style={[
                styles.clockTime,
                { transform: [{ scale: clockPulseAnim }] }
              ]}
            >
              {currentTime}
            </Animated.Text>
            <Text style={styles.clockDate}>{currentDate}</Text>
            <View style={styles.secondsContainer}>
              <View style={[
                styles.secondsIndicator, 
                { width: `${(currentSeconds / 60) * 100}%` }
              ]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Full screen trips component
const TripsFullScreen = ({ isVisible, onClose, activeTab, setActiveTab, trips, onTripPress, isLoading }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>My Trips</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tripTabsFullScreen}>
          <TouchableOpacity 
            style={[styles.tripTabFull, activeTab === 'current' && styles.activeTabFull]}
            onPress={() => setActiveTab('current')}
          >
            <Text style={styles.tripTabText}>current</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tripTabFull, activeTab === 'upcoming' && styles.activeTabFull]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={styles.tripTabText}>upcoming</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tripTabFull, activeTab === 'past' && styles.activeTabFull]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={styles.tripTabText}>past</Text>
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading trips...</Text>
          </View>
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TripItem 
                item={item}
                onPress={() => {
                  onTripPress(item);
                  onClose();
                }}
              />
            )}
            contentContainerStyle={styles.tripListFullScreen}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const HomeScreen = ({ navigation }) => {
  const { userInfo, logout } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('');
  const [activeTripTab, setActiveTripTab] = useState('current');
  const [isLoading, setIsLoading] = useState(true);
  const dimensions = useWindowDimensions();
  const isSmallDevice = dimensions.width < 375;
  const [showTripsModal, setShowTripsModal] = useState(false);
  
  /* 
  BACKEND INTEGRATION:
  1. Add states for data from backend and fetch data when component mounts:
  
  // State for data from backend
  const [userTrips, setUserTrips] = useState({
    current: [],
    upcoming: [],
    past: []
  });
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  
  // Fetch user's trips
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch trips
        const tripsResponse = await ApiService.trips.getAllTrips();
        const tripsData = tripsResponse.data;
        
        // Sort trips into current, upcoming, and past
        const now = new Date();
        const categorizedTrips = {
          current: [],
          upcoming: [],
          past: []
        };
        
        tripsData.forEach(trip => {
          const startDate = new Date(trip.startDate);
          const endDate = new Date(trip.endDate);
          
          if (now >= startDate && now <= endDate) {
            categorizedTrips.current.push(trip);
          } else if (startDate > now) {
            categorizedTrips.upcoming.push(trip);
          } else {
            categorizedTrips.past.push(trip);
          }
        });
        
        setUserTrips(categorizedTrips);
        
        // Fetch destinations
        const destinationsResponse = await ApiService.locations.getLocations();
        setDestinations(destinationsResponse.data);
        
        // Fetch activities (add an activities endpoint to your API)
        // const activitiesResponse = await ApiService.activities.getActivities();
        // setActivities(activitiesResponse.data);
        
        // Fetch weather data for user's location
        if (userInfo && userInfo.location) {
          // Integrate with a weather API or your backend's weather service
          // const weatherResponse = await ApiService.weather.getWeather(userInfo.location);
          // setWeatherData(weatherResponse.data);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userInfo]);
  
  // Replace mockTrips with userTrips in the render function
  // Replace popularDestinations with destinations in the render function
  // Replace popularActivities with activities in the render function
  // Replace currentWeather with weatherData in the WeatherCard component
  */
  
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Additional animations
  const planCardAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const navBarAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    // Simulate loading from backend
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Animations sequence
    Animated.stagger(200, [
      // Animate plan card
      Animated.timing(planCardAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      // Animate destinations section
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Animate nav bar
      Animated.timing(navBarAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogout = () => {
    // Logout will trigger the AuthContext to clear userToken
    // which will cause AppNavigator to show the Login screen
    logout();
  };

  const navigateToCreateTrip = () => {
    navigation.navigate('CreateTrip');
  };

  const navigateToDestination = (destination) => {
    // In a real app, this would navigate to a details screen with the destination id
    alert(`Navigating to ${destination.name}. You can expand this to open a full details screen.`);
  };

  const navigateToTripDetail = (trip) => {
    // For trips with itinerary, navigate to the TripItineraryScreen
    if (trip.id === '1') {
      navigation.navigate('TripItinerary', { 
        tripName: trip.name,
        tripDays: 4,
        destination: 'Colombo'
      });
    } else {
      // Otherwise navigate to the regular trip detail
      navigation.navigate('TripDetail', { tripName: trip.name });
    }
  };

  const handleCreateTripPress = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigateToCreateTrip();
    });
  };

  // Open the trips full screen modal
  const openTripsFullScreen = () => {
    setShowTripsModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header with logout button, logo and user greeting */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <ActualLogo size={isSmallDevice ? 35 : 40} showText={false} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{userInfo?.name || 'User'}!</Text>
        </View>
        <View style={styles.avatarContainer}>
          <TouchableOpacity 
            style={styles.avatarTouchable}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.avatarShadow} />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "T"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Main content */}
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Weather Card */}
        <WeatherCard />
        
        {/* Trip planning card with 3D effect */}
        <Animated.View 
          style={[
            styles.planCard,
            {
              opacity: planCardAnim,
              transform: [
                { 
                  translateY: planCardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                },
                { 
                  scale: planCardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.planCardShadow} />
          <View style={styles.planCardContent}>
            <Text style={styles.planTitle}>Plan your next adventure!</Text>
            <Animated.View style={{
              transform: [{ scale: buttonAnim }]
            }}>
              <TouchableOpacity 
                style={styles.createTripButton}
                onPress={handleCreateTripPress}
                activeOpacity={0.8}
              >
                <Text style={styles.createTripButtonText}>create trip</Text>
                <Ionicons name="arrow-forward" size={18} color="#000" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
        
        {/* Popular Activities */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Popular Activities</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activitiesContainer}
          >
            {popularActivities.map(activity => (
              <ActivityButton key={activity.id} item={activity} />
            ))}
          </ScrollView>
        </View>
        
        {/* Trips section - Card only with trip preview */}
        <View style={styles.tripsCard}>
          {/* Trip tabs and header row */}
          <View style={styles.tripsSectionHeader}>
            <View style={styles.tripTabs}>
              <TouchableOpacity 
                style={[styles.tripTab, activeTripTab === 'current' && styles.activeTab]}
                onPress={() => setActiveTripTab('current')}
              >
                <Text style={styles.tripTabText}>current</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tripTab, activeTripTab === 'upcoming' && styles.activeTab]}
                onPress={() => setActiveTripTab('upcoming')}
              >
                <Text style={styles.tripTabText}>upcoming</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tripTab, activeTripTab === 'past' && styles.activeTab]}
                onPress={() => setActiveTripTab('past')}
              >
                <Text style={styles.tripTabText}>past</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={openTripsFullScreen}
            >
              <Ionicons name="expand-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          
          {/* Preview of trips - limited to 2 */}
          <View style={styles.tripListContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Loading trips...</Text>
              </View>
            ) : (
              <>
                {mockTrips[activeTripTab].slice(0, 2).map(item => (
                  <TripItem 
                    key={item.id}
                    item={item}
                    onPress={() => navigateToTripDetail(item)}
                  />
                ))}
              </>
            )}
          </View>
          
          {!isLoading && mockTrips[activeTripTab].length > 2 && (
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={openTripsFullScreen}
            >
              <Text style={styles.viewMoreText}>
                View {mockTrips[activeTripTab].length - 2} more {mockTrips[activeTripTab].length - 2 === 1 ? 'trip' : 'trips'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Popular Destinations */}
        <Animated.View 
          style={[
            styles.sectionContainer, 
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {popularDestinations.map((item) => (
            <DestinationCard 
              key={item.id} 
              item={item} 
              onPress={() => navigateToDestination(item)}
            />
          ))}
        </Animated.View>
        
        {/* Travel Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Travel Tip</Text>
          <Text style={styles.tipsContent}>
            Sri Lanka&apos;s best beaches are on the south and west coasts. Visit between December and April for the best weather!
          </Text>
        </View>
      </ScrollView>
      
      {/* Trips Modal for Full Screen view */}
      <TripsFullScreen 
        isVisible={showTripsModal}
        onClose={() => setShowTripsModal(false)}
        activeTab={activeTripTab}
        setActiveTab={setActiveTripTab}
        trips={mockTrips[activeTripTab]}
        onTripPress={navigateToTripDetail}
        isLoading={isLoading}
      />
      
      {/* Bottom navigation with 3D effect - reduced size */}
      <Animated.View 
        style={[
          styles.bottomNav,
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
        <TouchableOpacity style={styles.navButtonContainer}>
          <View style={styles.navButtonCircle}>
            <Ionicons name="home" size={22} color={colors.primary} />
          </View>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButtonContainer}
          onPress={navigateToCreateTrip}
        >
          <View style={styles.navButtonCircle}>
            <Ionicons name="add-circle" size={22} color={colors.primary} />
          </View>
          <Text style={styles.navLabel}>New Trip</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButtonContainer}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.navButtonCircle}>
            <Ionicons name="person" size={22} color={colors.primary} />
          </View>
          <Text style={styles.navLabel}>Profile</Text>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  logoContainer: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  avatarContainer: {
    marginLeft: 12,
    position: 'relative',
  },
  avatarTouchable: {
    borderRadius: 25,
    overflow: 'visible',
  },
  avatarShadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    padding: 12,
  },
  weatherCardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  weatherCard: {
    backgroundColor: colors.lightBlue,
    borderRadius: 16,
    height: 100,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  cloudIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  cloudEmoji: {
    fontSize: 24,
    color: 'white',
  },
  weatherContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    height: '100%',
    zIndex: 2,
  },
  weatherIconContainer: {
    marginRight: 16,
  },
  weatherIcon: {
    fontSize: 42,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 2,
  },
  weatherCondition: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 2,
  },
  weatherLocation: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.9,
  },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 8,
    minWidth: 100,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  clockTime: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  clockDate: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  secondsContainer: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  secondsIndicator: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  planCard: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  planCardShadow: {
    position: 'absolute',
    top: 4,
    left: 2,
    right: 2,
    bottom: 0,
    backgroundColor: '#000',
    borderRadius: 16,
    opacity: 0.1,
    transform: [{ translateY: 4 }],
  },
  planCardContent: {
    backgroundColor: '#E9E4DA',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textShadowColor: 'rgba(255,255,255,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  createTripButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightBlue,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  createTripButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionContainer: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  activitiesContainer: {
    paddingBottom: 5,
  },
  activityButton: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: colors.sand,
    borderRadius: 12,
    padding: 10,
    width: 80,
    height: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'space-between',
  },
  activityEmojiContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityEmoji: {
    fontSize: 26,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  activityName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  tripsCard: {
    backgroundColor: '#EBDED0', // Lighter sand color to match the image
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  tripsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tripTab: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 24,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center', 
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: colors.lightBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  tripTabText: {
    color: '#333',
    fontWeight: '600',
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  tripListContainer: {
    maxHeight: 220,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#555',
  },
  tripItem: {
    backgroundColor: '#EBDED0', // Match card background
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  tripInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  tripIcon: {
    marginRight: 4,
  },
  tripDate: {
    fontSize: 13,
    color: '#444',
  },
  tripImageContainer: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  tripImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
  },
  tripImagePlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  destinationCard: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  destinationEmoji: {
    width: 80,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  emojiText: {
    fontSize: 36,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  destinationInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  destinationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1A3C2B',
    textShadowColor: 'rgba(255,255,255,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  destinationDescription: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
  },
  destinationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  exploreText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 5,
  },
  tipsCard: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFF',
  },
  tipsContent: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 16 : 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  navButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#555',
    fontWeight: '500',
  },
  activityButtonPressed: {
    backgroundColor: '#D8C8B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  tripTabsFullScreen: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  tripTabFull: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    minWidth: 90,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  activeTabFull: {
    backgroundColor: colors.lightBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  tripListFullScreen: {
    padding: 12,
  },
  viewMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignSelf: 'center',
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
});

export default HomeScreen; 