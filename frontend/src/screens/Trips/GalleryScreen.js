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
  Image,
  FlatList,
  Modal
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import colors from '../../assets/colors/theme';

const { width, height } = Dimensions.get('window');

// Sample tags for filtering
const imageTags = ['Beach', 'Food', 'Landmarks', 'People', 'Hotel', 'Transport', 'Activities', 'Scenery', 'Adventure'];

const GalleryScreen = ({ route, navigation }) => {
  // Get trip data from route params or use default values
  const { tripName = 'My Trip', tripDays = 10 } = route.params || {};
  
  const [photos, setPhotos] = useState([]);
  const [editingTripName, setEditingTripName] = useState(false);
  const [localTripName, setLocalTripName] = useState(tripName);
  const [selectedDayFilter, setSelectedDayFilter] = useState('All Days');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('All Members');
  const [selectedTagFilter, setSelectedTagFilter] = useState('All Tags');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Newest First');
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch trip photos when component mounts:
     
     useEffect(() => {
       const fetchTripPhotos = async () => {
         try {
           // Get tripId from route.params
           const { tripId } = route.params;
           if (tripId) {
             // Fetch photos for this trip
             const response = await ApiService.media.getTripPhotos(tripId);
             const photosData = response.data;
             
             // Update state with photos data
             setPhotos(photosData.map(photo => ({
               id: photo._id,
               uri: photo.imageUrl,
               day: photo.day,
               uploadedBy: photo.uploadedBy,
               tags: photo.tags || [],
               date: new Date(photo.createdAt),
               description: photo.description || ''
             })));
           }
         } catch (error) {
           console.error('Error fetching trip photos:', error);
           // Handle error or show error message
         }
       };
       
       fetchTripPhotos();
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

  const handleUploadPictures = () => {
    Alert.alert(
      "Upload Pictures",
      "Would you like to take a new photo or choose from your gallery?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: () => console.log("Take Photo pressed") },
        { text: "Choose from Gallery", onPress: () => console.log("Gallery pressed") }
      ]
    );
    
    /* 
    BACKEND INTEGRATION:
    Upload photos to the server:
    
    // For taking a new photo
    const takePhoto = async () => {
      try {
        // Use Expo's ImagePicker or Camera API to take a photo
        // Example with ImagePicker:
        // const result = await ImagePicker.launchCameraAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   allowsEditing: true,
        //   quality: 0.8,
        // });
        
        if (!result.cancelled) {
          uploadPhotoToServer(result.uri);
        }
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
    };
    
    // For selecting from gallery
    const pickFromGallery = async () => {
      try {
        // Use Expo's ImagePicker to pick from gallery
        // Example:
        // const result = await ImagePicker.launchImageLibraryAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   allowsEditing: true,
        //   quality: 0.8,
        // });
        
        if (!result.cancelled) {
          uploadPhotoToServer(result.uri);
        }
      } catch (error) {
        console.error('Error picking photo:', error);
        Alert.alert('Error', 'Failed to select photo. Please try again.');
      }
    };
    
    // Upload the photo to server
    const uploadPhotoToServer = async (uri) => {
      try {
        const { tripId } = route.params;
        
        // Create a FormData object for file upload
        const formData = new FormData();
        formData.append('photo', {
          uri: uri,
          name: 'photo.jpg',
          type: 'image/jpeg'
        });
        formData.append('tripId', tripId);
        formData.append('day', selectedDayFilter === 'All Days' ? 1 : parseInt(selectedDayFilter.split(' ')[1]));
        formData.append('tags', JSON.stringify([])); // Empty tags array initially
        
        // Upload the photo
        const response = await ApiService.media.uploadTripPhoto(formData);
        const newPhoto = response.data;
        
        // Add the new photo to the state
        setPhotos(prevPhotos => [
          {
            id: newPhoto._id,
            uri: newPhoto.imageUrl,
            day: newPhoto.day,
            uploadedBy: newPhoto.uploadedBy,
            tags: newPhoto.tags || [],
            date: new Date(newPhoto.createdAt),
            description: newPhoto.description || ''
          },
          ...prevPhotos
        ]);
        
        Alert.alert('Success', 'Photo uploaded successfully');
      } catch (error) {
        console.error('Error uploading photo:', error);
        Alert.alert('Error', 'Failed to upload photo. Please try again.');
      }
    };
    
    // Replace console.log calls with the above functions
    */
  };

  const toggleDayFilter = () => {
    const dayOptions = ['All Days', ...Array.from({ length: tripDays }, (_, i) => `Day ${i + 1}`)];
    
    Alert.alert(
      "Filter by Day",
      "Select a day to filter photos",
      dayOptions.map(day => ({
        text: day,
        onPress: () => setSelectedDayFilter(day)
      }))
    );
  };

  const toggleMemberFilter = () => {
    // Sample members - in a real app, you'd get this from your trip data
    const memberOptions = ['All Members', 'You', 'John', 'Sarah', 'Mike', 'Emma'];
    
    Alert.alert(
      "Filter by Member",
      "Select a member to filter photos",
      memberOptions.map(member => ({
        text: member,
        onPress: () => setSelectedMemberFilter(member)
      }))
    );
  };

  const toggleTagFilter = () => {
    const tagOptions = ['All Tags', ...imageTags];
    
    Alert.alert(
      "Filter by Tag",
      "Select a tag to filter photos",
      tagOptions.map(tag => ({
        text: tag,
        onPress: () => setSelectedTagFilter(tag)
      }))
    );
  };

  const resetAllFilters = () => {
    setSelectedDayFilter('All Days');
    setSelectedMemberFilter('All Members');
    setSelectedTagFilter('All Tags');
    setSelectedSort('Newest First');
    setIsFilterModalVisible(false);
  };

  const handleFilterOptions = () => {
    setIsFilterModalVisible(true);
  };

  const FilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterModalVisible}
      onRequestClose={() => setIsFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            <TouchableOpacity 
              onPress={() => setIsFilterModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            {/* Sort By Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.optionsContainer}>
                {['Newest First', 'Oldest First', 'A-Z', 'Z-A'].map(sort => (
                  <TouchableOpacity 
                    key={sort}
                    style={[
                      styles.optionButton,
                      selectedSort === sort && styles.optionButtonSelected
                    ]}
                    onPress={() => setSelectedSort(sort)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedSort === sort && styles.optionTextSelected
                    ]}>{sort}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Days Filter Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Filter by Day</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    selectedDayFilter === 'All Days' && styles.optionButtonSelected
                  ]}
                  onPress={() => setSelectedDayFilter('All Days')}
                >
                  <Text style={[
                    styles.optionText,
                    selectedDayFilter === 'All Days' && styles.optionTextSelected
                  ]}>All Days</Text>
                </TouchableOpacity>
                
                {Array.from({ length: tripDays }, (_, i) => `Day ${i + 1}`).map(day => (
                  <TouchableOpacity 
                    key={day}
                    style={[
                      styles.optionButton,
                      selectedDayFilter === day && styles.optionButtonSelected
                    ]}
                    onPress={() => setSelectedDayFilter(day)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedDayFilter === day && styles.optionTextSelected
                    ]}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tags Filter Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Filter by Tag</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    selectedTagFilter === 'All Tags' && styles.optionButtonSelected
                  ]}
                  onPress={() => setSelectedTagFilter('All Tags')}
                >
                  <Text style={[
                    styles.optionText,
                    selectedTagFilter === 'All Tags' && styles.optionTextSelected
                  ]}>All Tags</Text>
                </TouchableOpacity>
                
                {imageTags.map(tag => (
                  <TouchableOpacity 
                    key={tag}
                    style={[
                      styles.optionButton,
                      selectedTagFilter === tag && styles.optionButtonSelected
                    ]}
                    onPress={() => setSelectedTagFilter(tag)}
                  >
                    <Text style={[
                      styles.optionText,
                      selectedTagFilter === tag && styles.optionTextSelected
                    ]}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetAllFilters}
            >
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
              onPress={() => Alert.alert("Trip Members", "View all members")}
            >
              <Ionicons name="people-outline" size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => Alert.alert("Add Member", "You can add trip members here")}
            >
              <Ionicons name="add" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      
      {/* Upload Pictures Button */}
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={handleUploadPictures}
      >
        <Ionicons name="add" size={20} color="#666" />
        <Text style={styles.uploadText}>Upload Pictures</Text>
      </TouchableOpacity>
      
      {/* Filters Row */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersRow}
      >
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleDayFilter}
        >
          <Text style={styles.filterText}>{selectedDayFilter}</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleMemberFilter}
        >
          <Text style={styles.filterText}>{selectedMemberFilter}</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleTagFilter}
        >
          <Text style={styles.filterText}>{selectedTagFilter}</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterOptionsButton}
          onPress={handleFilterOptions}
        >
          <Ionicons name="filter" size={20} color="#666" />
        </TouchableOpacity>
      </ScrollView>
      
      {/* Photo Gallery */}
      <View style={styles.galleryContainer}>
        {photos.length > 0 ? (
          <FlatList
            data={photos}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.photoItem}
                onPress={() => Alert.alert("View Photo", "Open full screen view")}
              >
                <Image 
                  source={{ uri: item.uri }}
                  style={styles.photoImage}
                  resizeMode="cover"
                />
                <View style={styles.photoInfo}>
                  <Text style={styles.photoDay}>{item.day}</Text>
                  <Text style={styles.photoLocation}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.photoGrid}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.emptyGalleryContainer}>
            <Ionicons name="images-outline" size={80} color="#CCC" />
            <Text style={styles.emptyGalleryText}>No photos yet</Text>
            <Text style={styles.emptyGallerySubText}>Upload some pictures to see them here</Text>
            
            <TouchableOpacity 
              style={styles.emptyStateUploadButton}
              onPress={handleUploadPictures}
            >
              <Text style={styles.emptyStateUploadText}>Upload Photos</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
      
      {/* Filter Modal */}
      <FilterModal />
      
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
          style={[styles.bottomTab, styles.activeBottomTab]}
        >
          <View style={[styles.bottomTabIconContainer, styles.activeTabIconContainer]}>
            <Ionicons name="image" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Gallery</Text>
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8D8D8',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  uploadText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 8,
  },
  filtersScrollView: {
    maxHeight: 50,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingRight: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5EFE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#444',
    marginRight: 6,
  },
  filterOptionsButton: {
    marginLeft: 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  galleryContainer: {
    flex: 1,
  },
  photoGrid: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  photoItem: {
    width: (width - 40) / 2,
    height: 180,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  photoDay: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  photoLocation: {
    fontSize: 10,
    color: '#FFF',
    marginTop: 2,
  },
  emptyGalleryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 200,
  },
  emptyGalleryText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginTop: 20,
  },
  emptyGallerySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateUploadButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 12,
  },
  emptyStateUploadText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 4,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  resetButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    width: '48%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  applyButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    width: '48%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500',
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

export default GalleryScreen; 