import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';

// Prevent the default splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {});

const { width, height } = Dimensions.get('window');

const CustomSplashScreen = ({ onFinish }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const heartbeatAnim = useRef(new Animated.Value(1)).current;
  
  // Loading dots animation values
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;
  
  // Background values
  const bgFadeAnim = useRef(new Animated.Value(0)).current;
  
  // Animation control
  const animationCompleted = useRef(false);
  
  useEffect(() => {
    // Hide the native splash screen immediately when our component mounts
    setTimeout(() => {
      SplashScreen.hideAsync().catch(e => console.log('Could not hide splash screen', e));
    }, 0);
    
    // Heartbeat animation (more pronounced)
    const heartbeatAnimation = Animated.loop(
      Animated.sequence([
        // Beat 1 - Quick pulse up
        Animated.timing(heartbeatAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        // Come back down
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Small pause between beats
        Animated.delay(300),
        // Beat 2 - Quick pulse up again
        Animated.timing(heartbeatAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        // Back to normal
        Animated.timing(heartbeatAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Longer pause before next heartbeat
        Animated.delay(1000),
      ])
    );
    
    // Loading dots animation
    const dotsAnimation = Animated.loop(
      Animated.sequence([
        // First dot
        Animated.timing(dotAnim1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Second dot
        Animated.timing(dotAnim2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Third dot
        Animated.timing(dotAnim3, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Pause
        Animated.delay(300),
        // Reset all dots
        Animated.parallel([
          Animated.timing(dotAnim1, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim2, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim3, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        // Short pause before next cycle
        Animated.delay(100),
      ])
    );
    
    // Fade in background
    const backgroundAnimation = Animated.timing(bgFadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });
    
    // Main animation sequence
    const mainAnimation = Animated.sequence([
      // Fade in background first
      backgroundAnimation,
      
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
    ]);
    
    // Start animations
    heartbeatAnimation.start();
    dotsAnimation.start();
    mainAnimation.start();
    
    // Force completion after exactly 2 seconds
    const timer = setTimeout(() => {
      if (!animationCompleted.current) {
        animationCompleted.current = true;
        
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // Stop all animations and call onFinish
          heartbeatAnimation.stop();
          dotsAnimation.stop();
          if (onFinish) onFinish();
        });
      }
    }, 2000);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      heartbeatAnimation.stop();
      dotsAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background gradient */}
      <Animated.View style={[styles.background, { opacity: bgFadeAnim }]}>
        <LinearGradient
          colors={['#e6f2e9', '#ffffff']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
      
      {/* Logo with heartbeat animation */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: heartbeatAnim }
            ],
          }
        ]}
      >
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </Animated.View>
      
      {/* Loading dots */}
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.dot, { opacity: dotAnim1 }]} />
        <Animated.View style={[styles.dot, { opacity: dotAnim2 }]} />
        <Animated.View style={[styles.dot, { opacity: dotAnim3 }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: '#f5f9f6',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2a6e4d',
    marginHorizontal: 5,
  }
});

export default CustomSplashScreen; 