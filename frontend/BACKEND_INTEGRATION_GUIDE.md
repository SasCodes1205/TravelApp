# Backend Integration Guide

This document provides a comprehensive guide to integrating the frontend screens with the backend API. Each section outlines the integration points for a specific screen in the travel app.

## Table of Contents
1. [Authentication](#authentication)
   - [Login Screen](#login-screen)
   - [Register Screen](#register-screen)
2. [Home](#home)
   - [Home Screen](#home-screen)
3. [Trip Management](#trip-management)
   - [Create Trip Screen](#create-trip-screen)
   - [Trips Screen](#trips-screen)
   - [Trip Detail Screen](#trip-detail-screen)
   - [Trip Itinerary Screen](#trip-itinerary-screen)
4. [Trip Features](#trip-features)
   - [Bookings Screen](#bookings-screen)
   - [Checklists Screen](#checklists-screen)
   - [Gallery Screen](#gallery-screen)
   - [Reviews Screen](#reviews-screen)
   - [Outfits Screen](#outfits-screen)
   - [Group Screen](#group-screen)
5. [User Management](#user-management)
   - [Profile Screen](#profile-screen)
6. [API Structure](#api-structure)
7. [Data Models](#data-models)
8. [Authentication & Security](#authentication--security)
9. [Real-time Features](#real-time-features)
10. [Error Handling](#error-handling)

## Authentication

### Login Screen
- **Fetch**: None initially
- **Create**: POST to `/api/users/login`
  - Send credentials (email, password)
  - Receive JWT token and user information
- **Error Handling**: 
  - 401: Invalid credentials
  - 403: Account locked or disabled
  - 404: User not found

### Register Screen
- **Fetch**: None initially
- **Create**: POST to `/api/users/signup`
  - Send user data (name, email, password)
  - Receive JWT token and user information
- **Error Handling**: 
  - 400: Validation errors (password requirements, invalid email)
  - 409: Email already exists
- **Additional**:
  - POST `/api/users/verify-email` for email verification
  - POST `/api/users/auth/google` for Google authentication

## Home

### Home Screen
- **Fetch**:
  - GET `/api/trips` to retrieve user's trips (sorted into current, upcoming, past)
  - GET `/api/locations` to retrieve popular destinations
  - GET `/api/activities` to retrieve popular activities
  - GET `/api/weather?location={userLocation}` to fetch weather data
- **Update**: None
- **Delete**: None
- **Cache Strategy**: Cache trip and destination data with a TTL of 1 hour; weather data with a TTL of 15 minutes

## Trip Management

### Create Trip Screen
- **Fetch**: 
  - GET `/api/locations/search?q={query}` for destination search suggestions
  - GET `/api/users/{userId}/contacts` to get contact list for trip members
- **Create**: POST to `/api/trips`
  - Send trip details (name, destination, startDate, endDate, members, description, budget)
  - Receive new trip ID and redirect to Trip Itinerary screen
- **Error Handling**: Display appropriate messages for validation errors
- **Validation**: Ensure endDate > startDate, valid destination format

### Trips Screen
- **Fetch**: GET `/api/trips/user/{userId}` to retrieve all user's trips
- **Query Parameters**:
  - `status`: Filter by trip status (upcoming, current, past)
  - `limit`: Number of trips to return (pagination)
  - `offset`: Starting index for pagination
  - `sortBy`: Sort field (date, name, destination)
  - `order`: Sort order (asc, desc)
- **Update**: None
- **Delete**: None
- **Navigation**: Pass tripId to Trip Detail or Trip Itinerary screens

### Trip Detail Screen
- **Fetch**: GET `/api/trips/{tripId}` to retrieve detailed trip information
- **Update**: PUT `/api/trips/{tripId}` to update basic trip info
- **Delete**: DELETE `/api/trips/{tripId}` to cancel or delete a trip
- **Navigation**: Provides links to Trip Itinerary and Bookings screens
- **Permission Handling**: Check if user has permission to view/edit this trip

### Trip Itinerary Screen
- **Fetch**:
  - GET `/api/itineraries/trip/{tripId}` to retrieve trip itinerary
  - GET `/api/itineraries/{itineraryId}/days/{dayNumber}/timeslots` to retrieve timeslots for a specific day
  - GET `/api/locations/nearby?lat={lat}&lng={lng}&radius={radius}` for place suggestions
- **Create**:
  - POST `/api/itineraries/{itineraryId}/days/{dayNumber}/timeslots` to create a new timeslot
- **Update**:
  - PUT `/api/itineraries/{itineraryId}/timeslots/{timeslotId}` to update timeslot details
  - PUT `/api/trips/{tripId}` to update trip name
  - PATCH `/api/itineraries/{itineraryId}/days/{dayNumber}/reorder` to reorder timeslots
- **Delete**:
  - DELETE `/api/itineraries/{itineraryId}/timeslots/{timeslotId}` to remove a timeslot
- **Batch Operations**:
  - POST `/api/itineraries/{itineraryId}/days/{dayNumber}/timeslots/batch` for creating multiple timeslots
  - PUT `/api/itineraries/{itineraryId}/days/{dayNumber}/timeslots/batch` for updating multiple timeslots

## Trip Features

### Bookings Screen
- **Fetch**: 
  - GET `/api/bookings/trip/{tripId}` to retrieve trip bookings
  - GET `/api/bookings/trip/{tripId}?type={bookingType}` to filter by booking type
- **Create**: POST `/api/bookings` to create a new booking
- **Update**: PUT `/api/bookings/{bookingId}` to update booking details
- **Delete**: DELETE `/api/bookings/{bookingId}` to remove a booking
- **Additional**:
  - GET `/api/bookings/types` to get list of booking types
  - POST `/api/bookings/{bookingId}/attachments` to upload booking confirmations/PDFs
  - GET `/api/bookings/{bookingId}/attachments` to retrieve attachments

### Checklists Screen
- **Fetch**: GET `/api/checklists/trip/{tripId}` to retrieve trip checklists
- **Create**:
  - POST `/api/checklists` to create a new checklist
  - POST `/api/checklists/{checklistId}/items` to add a checklist item
  - POST `/api/checklists/templates/{templateId}/apply` to apply a checklist template
- **Update**:
  - PUT `/api/checklists/{checklistId}` to update checklist details
  - PUT `/api/checklists/{checklistId}/items/{itemId}` to update an item (e.g., mark as completed)
  - PATCH `/api/checklists/{checklistId}/items/{itemId}/complete` to toggle completion status
- **Delete**:
  - DELETE `/api/checklists/{checklistId}` to remove a checklist
  - DELETE `/api/checklists/{checklistId}/items/{itemId}` to remove a checklist item
- **Template Management**:
  - GET `/api/checklists/templates` to get checklist templates
  - POST `/api/checklists/{checklistId}/save-as-template` to save as a reusable template

### Gallery Screen
- **Fetch**: 
  - GET `/api/media/trip/{tripId}/photos` to retrieve trip photos
  - GET `/api/media/trip/{tripId}/photos?day={dayNumber}` to filter by day
  - GET `/api/media/trip/{tripId}/photos?member={memberId}` to filter by member
- **Create**: POST `/api/media/photos` to upload a new photo (multipart/form-data)
- **Update**: PUT `/api/media/photos/{photoId}` to update photo metadata
- **Delete**: DELETE `/api/media/photos/{photoId}` to remove a photo
- **Additional**:
  - POST `/api/media/photos/{photoId}/tags` to add a tag to a photo
  - DELETE `/api/media/photos/{photoId}/tags/{tag}` to remove a tag
  - POST `/api/media/trip/{tripId}/photos/batch` to upload multiple photos
  - GET `/api/media/trip/{tripId}/photos/download` to download all photos as zip

### Reviews Screen
- **Fetch**: 
  - GET `/api/reviews/trip/{tripId}` to retrieve trip reviews
  - GET `/api/reviews/location/{locationId}` to get reviews for a location
- **Create**: 
  - POST `/api/reviews` to create a new review
  - POST `/api/reviews/{reviewId}/image` to upload a review image (multipart/form-data)
- **Update**: PUT `/api/reviews/{reviewId}` to update review details
- **Delete**: DELETE `/api/reviews/{reviewId}` to remove a review
- **Additional**:
  - POST `/api/reviews/{reviewId}/like` to like a review
  - DELETE `/api/reviews/{reviewId}/like` to unlike a review
  - POST `/api/reviews/{reviewId}/comments` to comment on a review
  - GET `/api/reviews/{reviewId}/comments` to get review comments

### Outfits Screen
- **Fetch**: 
  - GET `/api/outfits/trip/{tripId}` to retrieve trip outfits
  - GET `/api/outfits/trip/{tripId}?day={dayNumber}` to filter by day
- **Create**:
  - POST `/api/outfits` to create a new outfit
  - POST `/api/outfits/{outfitId}/photo` to upload an outfit photo (multipart/form-data)
- **Update**: PUT `/api/outfits/{outfitId}` to update outfit details
- **Delete**: DELETE `/api/outfits/{outfitId}` to remove an outfit
- **Additional**:
  - GET `/api/outfits/suggestions?weather={weatherType}&activities={activities}` for outfit suggestions based on weather and activities
  - POST `/api/outfits/{outfitId}/copy?day={targetDay}` to copy outfit to another day

### Group Screen
- **Fetch**: GET `/api/trips/{tripId}/members` to retrieve trip members
- **Create**: 
  - POST `/api/trips/{tripId}/invite` to invite members via email
  - POST `/api/trips/{tripId}/invite/bulk` for bulk invitations
- **Update**: 
  - PUT `/api/trips/{tripId}/members/{memberId}/role` to change member role
  - PUT `/api/trips/{tripId}/members/{memberId}/permissions` to update permissions
- **Delete**: DELETE `/api/trips/{tripId}/members/{memberId}` to remove a member
- **Additional**:
  - GET `/api/trips/{tripId}/invitations` to view pending invitations
  - DELETE `/api/trips/{tripId}/invitations/{invitationId}` to cancel an invitation
  - POST `/api/trips/invitations/{invitationToken}/accept` to accept an invitation
  - POST `/api/trips/invitations/{invitationToken}/decline` to decline an invitation
  - POST `/api/trips/{tripId}/members/{memberId}/message` to send a message to a member

## User Management

### Profile Screen
- **Fetch**: GET `/api/users/{userId}` to retrieve user profile
- **Update**: PUT `/api/users/{userId}` to update user profile
- **Additional**:
  - GET `/api/users/{userId}/stats` to retrieve user statistics
  - GET `/api/users/{userId}/activity` to retrieve recent activity
  - GET `/api/users/{userId}/trip-history` to retrieve trip history
  - PUT `/api/users/{userId}/password` to update password
  - PUT `/api/users/{userId}/preferences` to update app preferences
  - POST `/api/users/{userId}/avatar` to upload profile picture (multipart/form-data)
  - DELETE `/api/users/{userId}` to deactivate account

## API Structure

The backend API is structured around the following main resources:

- `/api/users`: User authentication and profile management
- `/api/trips`: Trip creation and management
- `/api/itineraries`: Trip itineraries and timeslots
- `/api/bookings`: Travel bookings (flights, hotels, etc.)
- `/api/checklists`: Trip preparation checklists
- `/api/media`: Photos and other media files
- `/api/reviews`: Place and experience reviews
- `/api/outfits`: Travel outfit planning
- `/api/locations`: Destinations and places
- `/api/activities`: Travel activities
- `/api/weather`: Weather information for locations

All API endpoints are implemented in the `ApiService.js` file, which provides a centralized service for making HTTP requests to the backend. This service handles authentication, error handling, and data formatting.

## Data Models

### User
```javascript
{
  _id: String,
  name: String,
  email: String,
  password: String (hashed),
  avatar: String (URL),
  role: String (enum: 'user', 'admin'),
  preferences: {
    notifications: Boolean,
    darkMode: Boolean,
    emailUpdates: Boolean
  },
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Trip
```javascript
{
  _id: String,
  name: String,
  destination: String,
  description: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  budget: Number,
  currency: String,
  status: String (enum: 'planning', 'active', 'completed', 'cancelled'),
  visibility: String (enum: 'private', 'shared', 'public'),
  coverImage: String (URL),
  owner: { type: ObjectId, ref: 'User' },
  members: [
    {
      user: { type: ObjectId, ref: 'User' },
      role: String (enum: 'owner', 'editor', 'viewer'),
      joinedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Itinerary
```javascript
{
  _id: String,
  trip: { type: ObjectId, ref: 'Trip' },
  days: [
    {
      dayNumber: Number,
      date: Date,
      timeslots: [
        {
          _id: String,
          startTime: String,
          endTime: String,
          place: String,
          activity: String,
          description: String,
          location: {
            lat: Number,
            lng: Number,
            name: String,
            address: String
          },
          createdBy: { type: ObjectId, ref: 'User' },
          createdAt: Date,
          updatedAt: Date
        }
      ]
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication & Security

### JWT Token Management
- Token is stored in localStorage or secure HTTP-only cookies
- Token structure includes:
  - User ID
  - Permissions
  - Expiration time
- Token refresh mechanism should be implemented
- Token rotation for security enhancement

### Permissions Structure
- Permission levels:
  - `owner`: Full access to modify trip and manage members
  - `editor`: Can edit trip details but not manage members
  - `viewer`: Read-only access to trip details

### Security Measures
- All API requests should use HTTPS
- Implement rate limiting for auth endpoints
- Use CSRF tokens for form submissions
- Validate all incoming data on the server side
- Sanitize user-generated content to prevent XSS

## Real-time Features

The app includes several real-time features using WebSockets:

### Trip Collaboration
- Changes to itinerary by one user are immediately visible to others
- Implement using Socket.IO or similar WebSocket library:

```javascript
// Example socket connection in frontend
socket.on('itinerary_update', (data) => {
  // Update local state with the new timeslot data
  updateTimeslotInState(data.timeslotId, data.newData);
});

// When a user adds a timeslot
socket.emit('itinerary_add_timeslot', {
  tripId: currentTripId,
  dayNumber: selectedDay,
  timeslotData: newTimeslotData
});
```

### Group Chat
- Real-time messaging between trip members:

```javascript
// Listen for new messages
socket.on('new_message', (message) => {
  // Add message to local chat state
  addMessageToChat(message);
});

// Send a message
socket.emit('send_message', {
  tripId: currentTripId,
  content: messageText,
  senderId: currentUserId
});
```

### Notifications
- Real-time notifications for trip updates, invitations, etc.:

```javascript
// Listen for notifications
socket.on('notification', (notification) => {
  // Add notification to local state
  addNotification(notification);
});
```

## Error Handling

### API Error Structure
```javascript
{
  status: Number, // HTTP status code
  code: String,  // Application-specific error code
  message: String, // User-friendly error message
  details: {} // Additional details for debugging
}
```

### Common Error Codes
- `AUTH_001`: Authentication required
- `AUTH_002`: Token expired
- `AUTH_003`: Insufficient permissions
- `VAL_001`: Validation error
- `RES_001`: Resource not found
- `RES_002`: Resource already exists
- `SRV_001`: Server error

### Error Handling Implementation
The ApiService wrapper should implement proper error handling:

```javascript
try {
  const response = await ApiService.trips.getTripById(tripId);
  setTripDetails(response.data);
} catch (error) {
  if (error.status === 404) {
    // Trip not found
    navigation.navigate('Trips');
    Alert.alert('Error', 'Trip not found');
  } else if (error.status === 403) {
    // No permission
    Alert.alert('Access Denied', 'You do not have permission to view this trip');
  } else {
    // General error
    Alert.alert('Error', 'Something went wrong. Please try again.');
    console.error('Error fetching trip details:', error);
  }
}
```

### Connection Error Handling
- Implement retry logic for transient failures
- Provide offline functionality where possible:

```javascript
// Example offline handling in ApiService
createBooking: async (bookingData) => {
  try {
    return await api.post('/bookings', bookingData);
  } catch (error) {
    if (!navigator.onLine) {
      // Store the request for later
      offlineQueue.push({
        type: 'post',
        endpoint: '/bookings',
        data: bookingData
      });
      return { offline: true, message: 'Booking will be created when online' };
    }
    throw error;
  }
}
```

For detailed implementation examples, refer to the commented code in each screen file. 