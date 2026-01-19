import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../assets/colors/theme';

const VistaLankaLogo = ({ size = 150, showText = true }) => {
  // This recreates the Vista Lanka logo with React Native elements
  // to match the image you provided
  const circleSize = size * 0.8;
  const mountainSize = circleSize * 0.7;
  const sunSize = circleSize * 0.3;
  const palmWidth = circleSize * 0.05;
  const palmHeight = circleSize * 0.4;
  const waterHeight = circleSize * 0.3;
  const beachHeight = circleSize * 0.1;
  
  return (
    <View style={styles.container}>
      <View style={[styles.logoCircle, { width: circleSize, height: circleSize, borderColor: colors.primary, borderWidth: 3 }]}>
        {/* Mountains */}
        <View style={[styles.mountains, { width: mountainSize, height: mountainSize * 0.5, bottom: circleSize * 0.3 }]} />
        
        {/* Sun */}
        <View style={[styles.sun, { width: sunSize, height: sunSize, right: circleSize * 0.2, top: circleSize * 0.15 }]} />
        
        {/* Bird */}
        <View style={[styles.bird, { right: circleSize * 0.3, top: circleSize * 0.22 }]} />
        
        {/* Water */}
        <View style={[styles.water, { height: waterHeight, bottom: 0 }]} />
        
        {/* Beach */}
        <View style={[styles.beach, { height: beachHeight, bottom: waterHeight * 0.3 }]} />
        
        {/* Palm Tree */}
        <View style={[styles.palmTrunk, { width: palmWidth, height: palmHeight, left: circleSize * 0.15, bottom: circleSize * 0.25 }]} />
        <View style={[styles.palmLeaves, { width: palmWidth * 6, height: palmHeight * 0.5, left: circleSize * 0.05, bottom: circleSize * 0.55 }]} />
      </View>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.vistaText, { fontSize: size * 0.25 }]}>Vista</Text>
          <Text style={[styles.lankaText, { fontSize: size * 0.25 }]}>LANKA</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoCircle: {
    borderRadius: 999,
    backgroundColor: colors.background,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mountains: {
    position: 'absolute',
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  sun: {
    position: 'absolute',
    backgroundColor: colors.accent,
    borderRadius: 999,
    zIndex: 2,
  },
  bird: {
    position: 'absolute',
    width: 10,
    height: 3,
    backgroundColor: 'transparent',
    borderTopWidth: 3,
    borderTopColor: '#333',
    borderLeftWidth: 3,
    borderLeftColor: '#333',
    transform: [{ rotate: '30deg' }],
    zIndex: 3,
  },
  water: {
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.lightBlue,
    zIndex: 1,
  },
  beach: {
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.sand,
    transform: [{ skewY: '-5deg' }],
    zIndex: 2,
  },
  palmTrunk: {
    position: 'absolute',
    backgroundColor: colors.primary,
    zIndex: 3,
  },
  palmLeaves: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 15,
    borderTopColor: colors.primary,
    borderRightWidth: 15,
    borderRightColor: 'transparent',
    zIndex: 3,
  },
  textContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  vistaText: {
    fontStyle: 'italic',
    fontWeight: '500',
    color: colors.primary,
    marginBottom: -5,
  },
  lankaText: {
    fontWeight: 'bold',
    color: colors.primary,
  }
});

export default VistaLankaLogo; 