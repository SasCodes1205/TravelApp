import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/utils/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import CustomSplashScreen from './src/components/CustomSplashScreen';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the default Expo splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('Error preventing splash screen from auto-hiding');
});

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  // Handle app initialization
  useEffect(() => {
    async function prepare() {
      try {
        // Perform any initialization tasks here (loading fonts, etc.)
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // App is ready to render
        setAppIsReady(true);
        
        // Hide the native Expo splash screen as soon as possible
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error initializing app:', e);
      }
    }

    prepare();
  }, []);

  // Handle custom splash screen completion
  const handleSplashComplete = () => {
    setIsSplashVisible(false);
  };

  // Don't render anything until app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
      
      {/* 
        Custom splash screen rendered on top of everything
        This ensures it appears immediately when the app starts
      */}
      {isSplashVisible && (
        <CustomSplashScreen onFinish={handleSplashComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});