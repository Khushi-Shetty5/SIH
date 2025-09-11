import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = ({ navigation }) => {
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get('window').width);
      setWindowHeight(Dimensions.get('window').height);
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LanguageSelection');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      alignItems: 'center',
      width: windowWidth * 0.9,
    },
    logo: {
      width: windowWidth * 0.4,
      height: windowHeight * 0.2,
      marginBottom: windowHeight * 0.02,
    },
    title: {
      fontSize: windowHeight * 0.05,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: windowHeight * 0.01,
    },
    subtitle: {
      fontSize: windowHeight * 0.025,
      color: '#64748b',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/OIP.jpg')} // Adjust path if needed
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>MedKit</Text>
        <Text style={styles.subtitle}>Your Health, Our Priority</Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;