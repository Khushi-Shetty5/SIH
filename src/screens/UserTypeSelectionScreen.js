import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useLanguage } from '../languageConstants';

const UserTypeSelectionScreen = ({ navigation }) => {
  const { translations, language } = useLanguage();
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [orientation, setOrientation] = useState(windowWidth > windowHeight ? 'landscape' : 'portrait');

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setWindowWidth(width);
      setWindowHeight(height);
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  const handleUserTypeSelect = (type) => {
    if (type === 'Patient') {
      navigation.navigate('LanguageSelection');
    } else {
      // Placeholder for Hospital flow
      navigation.navigate('Signin'); // Adjust as needed for Hospital flow
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    content: {
      flex: 1,
      paddingHorizontal: orientation === 'landscape' ? windowWidth * 0.1 : windowWidth * 0.06,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: windowHeight * 0.06,
    },
    title: {
      fontSize: windowHeight * 0.04,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: windowHeight * 0.01,
    },
    subtitle: {
      fontSize: windowHeight * 0.022,
      color: '#64748b',
    },
    buttonContainer: {
      width: windowWidth * 0.9,
      marginBottom: windowHeight * 0.04,
      flexDirection: orientation === 'landscape' ? 'row' : 'column',
      justifyContent: orientation === 'landscape' ? 'space-between' : 'center',
    },
    button: {
      backgroundColor: '#3b82f6',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginBottom: windowHeight * 0.02,
      width: orientation === 'landscape' ? windowWidth * 0.42 : windowWidth * 0.9,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: windowHeight * 0.022,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{translations[language].select_user_type}</Text>
          <Text style={styles.subtitle}>{translations[language].choose_user_type}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUserTypeSelect('Patient')}
          >
            <Text style={styles.buttonText}>{translations[language].patient}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleUserTypeSelect('Hospital')}
          >
            <Text style={styles.buttonText}>{translations[language].hospital}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserTypeSelectionScreen;