import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import colors from '../assets/colors/theme';

// Static import for the logo
import logoImage from '../assets/images/logo.png';

const ActualLogo = ({ size = 150, showText = true }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={logoImage} 
        style={[styles.logo, { width: size, height: size }]} 
        resizeMode="contain"
      />
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.vistaText, { fontSize: size * 0.18 }]}>Vista</Text>
          <Text style={[styles.lankaText, { fontSize: size * 0.18 }]}>LANKA</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logo: {
    // No border radius to match the design
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

export default ActualLogo; 