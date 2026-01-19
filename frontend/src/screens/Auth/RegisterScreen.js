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

// Import the Google icon
import googleIcon from '../../assets/images/google.png';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const { register, error } = useContext(AuthContext);

  const handleRegister = () => {
    // For frontend-only development
    navigation.navigate('Login');
    
    /* 
    BACKEND INTEGRATION:
    Replace the above code with the actual API call using AuthContext's register function:
    
    1. Connect to backend API endpoint: POST /api/users/signup
    2. Implementation:
       if (name && email && password && confirmPassword) {
         if (password !== confirmPassword) {
           Alert.alert('Error', 'Passwords do not match');
           return;
         }
         
         try {
           // Call the register method from AuthContext which uses ApiService
           register({ name, email, password });
           // AuthContext will handle the response, store tokens, and navigate on success
         } catch (error) {
           // Error handling is managed in AuthContext
         }
       } else {
         Alert.alert('Error', 'Please fill in all fields');
       }
    */
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  // Add Google OAuth Integration
  const handleGoogleSignUp = () => {
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
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <ActualLogo size={140} showText={false} />
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
            
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity style={styles.loginButtonLink} onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  inputContainer: {
    width: '90%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: '#F8F0DC',
    borderWidth: 1,
    borderColor: '#E8D5B0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    color: '#555',
    height: 55,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#F8F0DC',
    borderWidth: 1,
    borderColor: '#E8D5B0',
    borderRadius: 30,
    padding: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
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
    marginVertical: 15,
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 12,
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '100%',
  },
  registerButtonText: {
    color: '#fff',
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
  loginButtonLink: {
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

export default RegisterScreen; 