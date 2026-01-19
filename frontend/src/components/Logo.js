import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import colors from '../assets/colors/theme';

// Use the actual logo image
const Logo = ({ size = 100, showText = true }) => {
  // In a real app, you would use a local image with require()
  // For this demo, we'll use the Vista Lanka logo you provided
  // First image: beach scene with mountain and palm tree
  return (
    <View style={[styles.container, { width: size }]}>
      <View style={styles.imageContainer}>
        <View style={[styles.circle, { width: size, height: size }]}>
          <View style={styles.mountain} />
          <View style={styles.sun} />
          <View style={styles.water} />
          <View style={styles.beach} />
          <View style={styles.palm} />
        </View>
      </View>
      {showText && size > 80 && (
        <Text style={styles.text}>Vista LANKA</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  circle: {
    borderRadius: 999,
    backgroundColor: colors.background,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mountain: {
    position: 'absolute',
    width: '70%',
    height: '40%',
    backgroundColor: colors.primary,
    bottom: '30%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sun: {
    position: 'absolute',
    width: '30%',
    height: '30%',
    backgroundColor: colors.accent,
    borderRadius: 999,
    top: '20%',
    right: '20%',
  },
  water: {
    position: 'absolute',
    width: '100%',
    height: '30%',
    backgroundColor: colors.lightBlue,
    bottom: 0,
  },
  beach: {
    position: 'absolute',
    width: '100%',
    height: '10%',
    backgroundColor: colors.sand,
    bottom: '10%',
    transform: [{ skewY: '-5deg' }],
  },
  palm: {
    position: 'absolute',
    width: '5%',
    height: '30%',
    backgroundColor: colors.primary,
    bottom: '28%',
    left: '20%',
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

export default Logo;
 