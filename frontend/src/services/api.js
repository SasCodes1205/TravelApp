import axios from 'axios';

// Create an axios instance with our base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL for the backend from server.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Services
const ApiService = {
  // Auth services
  auth: {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users/signup', userData),
    getProfile: (userId) => api.get(`/users/${userId}`),
    updateProfile: (userId, profileData) => api.put(`/users/${userId}`, profileData),
    forgotPassword: (email) => api.post('/users/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/users/reset-password', { token, newPassword }),
    googleAuth: () => api.get('/users/auth/google'),
    verifyEmail: (token) => api.get(`/users/verify-email/${token}`),
  },
  
  // Trip services
  trips: {
    getAllTrips: () => api.get('/trips'),
    getUserTrips: (userId) => api.get(`/trips/user/${userId}`),
    getTrip: (tripId) => api.get(`/trips/${tripId}`),
    getTripById: (tripId) => api.get(`/trips/${tripId}`), // Alias for getTrip
    createTrip: (tripData) => api.post('/trips', tripData),
    updateTrip: (tripId, tripData) => api.put(`/trips/${tripId}`, tripData),
    deleteTrip: (tripId) => api.delete(`/trips/${tripId}`),
    getTripMembers: (tripId) => api.get(`/trips/${tripId}/members`),
    addTripMember: (tripId, memberData) => api.post(`/trips/${tripId}/members`, memberData),
    removeTripMember: (tripId, memberId) => api.delete(`/trips/${tripId}/members/${memberId}`),
    inviteMember: (tripId, inviteData) => api.post(`/trips/${tripId}/invite`, inviteData),
    removeMember: (tripId, memberId) => api.delete(`/trips/${tripId}/members/${memberId}`),
  },
  
  // Itinerary services
  itineraries: {
    getItineraries: () => api.get('/itineraries'),
    getItinerary: (itineraryId) => api.get(`/itineraries/${itineraryId}`),
    getTripItinerary: (tripId) => api.get(`/itineraries/trip/${tripId}`),
    createItinerary: (itineraryData) => api.post('/itineraries', itineraryData),
    updateItinerary: (itineraryId, itineraryData) => api.put(`/itineraries/${itineraryId}`, itineraryData),
    deleteItinerary: (itineraryId) => api.delete(`/itineraries/${itineraryId}`),
    createTimeslot: (itineraryId, dayNumber, timeslotData) => api.post(`/itineraries/${itineraryId}/days/${dayNumber}/timeslots`, timeslotData),
    updateTimeslot: (itineraryId, timeslotId, timeslotData) => api.put(`/itineraries/${itineraryId}/timeslots/${timeslotId}`, timeslotData),
    deleteTimeslot: (itineraryId, timeslotId) => api.delete(`/itineraries/${itineraryId}/timeslots/${timeslotId}`),
  },
  
  // Location services
  locations: {
    getLocations: () => api.get('/locations'),
    getLocation: (locationId) => api.get(`/locations/${locationId}`),
    searchLocations: (query) => api.get(`/locations/search?q=${query}`),
    getPopularDestinations: () => api.get('/locations/popular'),
    getLocationActivities: (locationId) => api.get(`/locations/${locationId}/activities`),
  },
  
  // Booking services
  bookings: {
    getBookings: () => api.get('/bookings'),
    getTripBookings: (tripId) => api.get(`/bookings/trip/${tripId}`),
    getBooking: (bookingId) => api.get(`/bookings/${bookingId}`),
    createBooking: (bookingData) => api.post('/bookings', bookingData),
    updateBooking: (bookingId, bookingData) => api.put(`/bookings/${bookingId}`, bookingData),
    deleteBooking: (bookingId) => api.delete(`/bookings/${bookingId}`),
  },
  
  // Checklist services
  checklists: {
    getChecklists: () => api.get('/checklists'),
    getTripChecklists: (tripId) => api.get(`/checklists/trip/${tripId}`),
    getChecklist: (checklistId) => api.get(`/checklists/${checklistId}`),
    createChecklist: (checklistData) => api.post('/checklists', checklistData),
    updateChecklist: (checklistId, checklistData) => api.put(`/checklists/${checklistId}`, checklistData),
    deleteChecklist: (checklistId) => api.delete(`/checklists/${checklistId}`),
    addChecklistItem: (checklistId, itemData) => api.post(`/checklists/${checklistId}/items`, itemData),
    updateChecklistItem: (checklistId, itemId, itemData) => api.put(`/checklists/${checklistId}/items/${itemId}`, itemData),
    deleteChecklistItem: (checklistId, itemId) => api.delete(`/checklists/${checklistId}/items/${itemId}`),
  },
  
  // Outfits services
  outfits: {
    getTripOutfits: (tripId) => api.get(`/outfits/trip/${tripId}`),
    getOutfit: (outfitId) => api.get(`/outfits/${outfitId}`),
    createOutfit: (outfitData) => api.post('/outfits', outfitData),
    updateOutfit: (outfitId, outfitData) => api.put(`/outfits/${outfitId}`, outfitData),
    deleteOutfit: (outfitId) => api.delete(`/outfits/${outfitId}`),
    uploadOutfitPhoto: (outfitId, formData) => api.post(`/outfits/${outfitId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  },
  
  // Media services for trip photos
  media: {
    getTripPhotos: (tripId) => api.get(`/media/trip/${tripId}/photos`),
    getPhoto: (photoId) => api.get(`/media/photos/${photoId}`),
    uploadTripPhoto: (formData) => api.post('/media/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
    updatePhoto: (photoId, photoData) => api.put(`/media/photos/${photoId}`, photoData),
    deletePhoto: (photoId) => api.delete(`/media/photos/${photoId}`),
    addPhotoTag: (photoId, tag) => api.post(`/media/photos/${photoId}/tags`, { tag }),
    removePhotoTag: (photoId, tag) => api.delete(`/media/photos/${photoId}/tags/${tag}`),
  },
  
  // Weather services
  weather: {
    getWeather: (location) => api.get(`/weather?location=${location}`),
    getForecast: (location, days = 7) => api.get(`/weather/forecast?location=${location}&days=${days}`),
  },
  
  // User stats and activity
  users: {
    getUserStats: (userId) => api.get(`/users/${userId}/stats`),
    getUserActivity: (userId) => api.get(`/users/${userId}/activity`),
    getUserTripHistory: (userId) => api.get(`/users/${userId}/trip-history`),
  },
  
  // Reviews and ratings
  reviews: {
    getTripReviews: (tripId) => api.get(`/reviews/trip/${tripId}`),
    getLocationReviews: (locationId) => api.get(`/reviews/location/${locationId}`),
    createReview: (reviewData) => api.post('/reviews', reviewData),
    updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
    deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
    uploadReviewImage: (reviewId, formData) => api.post(`/reviews/${reviewId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  },
  
  // Activities recommendations
  activities: {
    getActivities: () => api.get('/activities'),
    getPopularActivities: () => api.get('/activities/popular'),
    getLocationActivities: (locationId) => api.get(`/activities/location/${locationId}`),
    getTripActivities: (tripId) => api.get(`/activities/trip/${tripId}`),
  },
};

export default ApiService; 