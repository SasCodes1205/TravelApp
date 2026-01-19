import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import colors from '../../assets/colors/theme';
import ActualLogo from '../../components/ActualLogo';

// Import the Google icon instead of using the logo as fallback
import googleIcon from '../../assets/images/google.png';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserToken, error } = useContext(AuthContext);

  const handleLogin = () => {
    // For frontend-only development, we'll just set the userToken directly
    // This will make the AuthContext think we're logged in
    setUserToken('dummy-token');
    
    /* 
    BACKEND INTEGRATION:
    Replace the above code with the actual API call using AuthContext's login function:
    
    1. Connect to backend API endpoint: POST /api/users/login
    2. Implementation:
       if (email && password) {
         try {
           // Call the login method from AuthContext which uses ApiService
           login(email, password);
           // The AuthContext will handle token storage and state updates
         } catch (error) {
           // Error handling is managed in AuthContext
         }
       } else {
         // Client-side validation
         Alert.alert('Error', 'Please enter both email and password');
       }
    */
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };
  
  // Add Google OAuth Integration
  const handleGoogleSignIn = () => {
    /* 
    BACKEND INTEGRATION:
    1. Connect to backend API endpoint: GET /api/users/auth/google
    2. Implementation:
       - Use Google OAuth library or Expo AuthSession
       - After successful Google authentication, send the token to backend
       - Backend should validate the token and create/login the user
       - Then get the user token from the response and store it in AuthContext
    */
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <ActualLogo size={230} showText={false} />
          </View>
          
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.googleButton}>
              <Image 
                source={googleIcon}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <View style={styles.dividerLine} />
            </View>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
              <Text style={styles.registerButtonText}>Login</Text>
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Don't have an account? </Text>
              <TouchableOpacity style={styles.registerButtonLink} onPress={handleRegister}>
                <Text style={styles.loginLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: height * 0.07, // More top padding to match design
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '80%',
    maxWidth: 350,
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#F8F0DC',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8D5B0',
  },
  input: {
    width: '100%',
    padding: 15,
    fontSize: 16,
    color: '#555',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#F8F0DC',
    borderRadius: 30,
    padding: 13,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E8D5B0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  registerButton: {
    backgroundColor: '#F8F0DC',
    borderRadius: 50,
    padding: 12,
    alignItems: 'center',
    marginTop: 5,
    width: '50%',
    borderWidth: 1,
    borderColor: '#E8D5B0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  registerButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: colors.error,
    marginBottom: 10,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  registerButtonLink: {
    padding: 2,
  },
  loginText: {
    color: '#333',
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LoginScreen; 