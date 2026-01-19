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

// Initial reviews data
const initialReviews = [
  { id: '1', name: 'Review1', place: '', type: '', content: '', image: null }
];

const ReviewsScreen = ({ route, navigation }) => {
  // Get trip data from route params or use default values
  const { tripName = 'Trip Name', tripDays = 10 } = route.params || {};
  
  const [reviews, setReviews] = useState(initialReviews);
  const [editingTripName, setEditingTripName] = useState(false);
  const [localTripName, setLocalTripName] = useState(tripName);
  
  /* 
  BACKEND INTEGRATION:
  1. Fetch trip reviews when component mounts:
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Get tripId from route.params
        const { tripId } = route.params;
        if (tripId) {
          // Fetch reviews for this trip
          const response = await ApiService.reviews.getTripReviews(tripId);
          const reviewsData = response.data;
          
          // Update state with reviews data
          setReviews(reviewsData.map(review => ({
            id: review._id,
            name: review.name,
            place: review.place || '',
            type: review.type || '',
            content: review.content || '',
            image: review.imageUrl || null,
            rating: review.rating || 0,
            createdAt: new Date(review.createdAt)
          })));
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Handle error or show error message
      }
    };
    
    fetchReviews();
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

  const handleAddReview = () => {
    const newReview = { 
      id: Date.now().toString(), 
      name: `Review${reviews.length + 1}`, 
      place: '', 
      type: '', 
      content: '', 
      image: null 
    };
    setReviews([...reviews, newReview]);
    
    /* 
    BACKEND INTEGRATION:
    Create new review on the backend:
    
    const createReview = async () => {
      try {
        const { tripId } = route.params;
        const reviewData = {
          tripId: tripId,
          name: `Review${reviews.length + 1}`,
          place: '',
          type: '',
          content: '',
          rating: 0
        };
        
        // Send request to create review
        const response = await ApiService.reviews.createReview(reviewData);
        const createdReview = response.data;
        
        // Update local state with real ID from backend
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === newReview.id 
              ? { ...review, id: createdReview._id } 
              : review
          )
        );
      } catch (error) {
        console.error('Error creating review:', error);
        // Remove the review if there's an error
        setReviews(reviews);
        Alert.alert('Error', 'Failed to create review. Please try again.');
      }
    };
    
    createReview();
    */
  };

  const handleDeleteReview = (id) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setReviews(reviews.filter(review => review.id !== id));
            
            /* 
            BACKEND INTEGRATION:
            Delete review from the backend:
            
            const deleteReview = async () => {
              try {
                // Send request to delete review
                await ApiService.reviews.deleteReview(id);
                
                // UI state is already updated above with the filter
              } catch (error) {
                console.error('Error deleting review:', error);
                // Restore the review if there's an error
                const deletedReview = reviews.find(review => review.id === id);
                if (deletedReview) {
                  setReviews(prevReviews => [...prevReviews, deletedReview]);
                }
                Alert.alert('Error', 'Failed to delete review. Please try again.');
              }
            };
            
            deleteReview();
            */
          }
        }
      ]
    );
  };

  const updateReviewField = (id, field, value) => {
    const updatedReviews = reviews.map(review => {
      if (review.id === id) {
        return { ...review, [field]: value };
      }
      return review;
    });
    setReviews(updatedReviews);
    
    /* 
    BACKEND INTEGRATION:
    Update review field on the backend:
    
    // Debounce the API calls to prevent too many requests
    // This should be implemented with a proper debounce function
    const updateReviewOnBackend = async () => {
      try {
        // Send only the updated field to the API
        const updateData = { [field]: value };
        
        // Update review in the backend
        await ApiService.reviews.updateReview(id, updateData);
        
        // UI state is already updated above
      } catch (error) {
        console.error('Error updating review:', error);
        // Revert to the previous value if there's an error
        const originalReview = reviews.find(review => review.id === id);
        if (originalReview) {
          // Only update this specific review and field
          setReviews(prevReviews => 
            prevReviews.map(review => 
              review.id === id 
                ? { ...review, [field]: originalReview[field] } 
                : review
            )
          );
        }
        Alert.alert('Error', 'Failed to update review. Please try again.');
      }
    };
    
    // Call the update function with some delay to avoid too many API calls
    // Ideally use a proper debounce implementation
    // setTimeout(updateReviewOnBackend, 500);
    */
  };

  const handleAddImage = (id) => {
    Alert.alert(
      "Add Image",
      "Would you like to take a photo or select from gallery?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: () => console.log("Take photo") },
        { text: "Select from Gallery", onPress: () => console.log("Select from gallery") }
      ]
    );
    
    /* 
    BACKEND INTEGRATION:
    Upload images for reviews:
    
    // Implementation for taking a photo
    const takePhoto = async () => {
      try {
        // Use Expo's ImagePicker or Camera API to take a photo
        // Example with ImagePicker:
        // const result = await ImagePicker.launchCameraAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   allowsEditing: true,
        //   aspect: [4, 3],
        //   quality: 0.8,
        // });
        
        // if (!result.cancelled) {
        //   uploadImage(id, result.uri);
        // }
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
    };
    
    // Implementation for selecting from gallery
    const selectFromGallery = async () => {
      try {
        // Use Expo's ImagePicker to select from gallery
        // Example:
        // const result = await ImagePicker.launchImageLibraryAsync({
        //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   allowsEditing: true,
        //   aspect: [4, 3],
        //   quality: 0.8,
        // });
        
        // if (!result.cancelled) {
        //   uploadImage(id, result.uri);
        // }
      } catch (error) {
        console.error('Error selecting image:', error);
        Alert.alert('Error', 'Failed to select image. Please try again.');
      }
    };
    
    // Function to upload image to server
    const uploadImage = async (reviewId, imageUri) => {
      try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          name: 'review_image.jpg',
          type: 'image/jpeg'
        });
        
        // Upload image to backend
        const response = await ApiService.reviews.uploadReviewImage(reviewId, formData);
        const imageUrl = response.data.imageUrl;
        
        // Update in local state
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === reviewId 
              ? { ...review, image: imageUrl } 
              : review
          )
        );
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      }
    };
    
    // Replace console.log with these functions
    */
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
      
      {/* Reviews Content */}
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.reviewsContentContainer}
      >
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewName}>{review.name}</Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteReview(review.id)}
              >
                <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.reviewInputRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <TextInput
                style={styles.reviewInput}
                placeholder="Add a place"
                placeholderTextColor="#999"
                value={review.place}
                onChangeText={(text) => updateReviewField(review.id, 'place', text)}
              />
            </View>
            
            <View style={styles.reviewInputRow}>
              <Ionicons name="document-text-outline" size={20} color="#666" />
              <TextInput
                style={styles.reviewInput}
                placeholder="type ex: hotel, restaurant"
                placeholderTextColor="#999"
                value={review.type}
                onChangeText={(text) => updateReviewField(review.id, 'type', text)}
              />
            </View>
            
            <View style={styles.reviewImageRow}>
              <View style={styles.imageContainer}>
                {review.image ? (
                  <Image 
                    source={{ uri: review.image }} 
                    style={styles.reviewImage} 
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={32} color="#999" />
                  </View>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={() => handleAddImage(review.id)}
              >
                <Ionicons name="add" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.reviewContentInput}
              placeholder="Write your review"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={review.content}
              onChangeText={(text) => updateReviewField(review.id, 'content', text)}
            />
            
            <TouchableOpacity 
              style={styles.editReviewButton}
              onPress={() => console.log('Edit review', review.id)}
            >
              <Ionicons name="pencil" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Add Review Button */}
        <TouchableOpacity 
          style={styles.addReviewButton}
          onPress={handleAddReview}
        >
          <Text style={styles.addReviewText}>Add Review</Text>
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
          style={[styles.bottomTab, styles.activeBottomTab]}
        >
          <View style={[styles.bottomTabIconContainer, styles.activeTabIconContainer]}>
            <Ionicons name="star" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.bottomTabText, styles.activeBottomTabText]}>Reviews</Text>
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
  contentContainer: {
    flex: 1,
  },
  reviewsContentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  reviewCard: {
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
  reviewInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
  },
  reviewInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  reviewImageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  reviewContentInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 8,
  },
  editReviewButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addReviewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  addReviewText: {
    fontSize: 16,
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

export default ReviewsScreen; 