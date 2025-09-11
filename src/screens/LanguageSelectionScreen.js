import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';

const languages = [
  { name: 'English', display: 'English' },
  { name: 'Kannada', display: 'ಕನ್ನಡ' },
  { name: 'Hindi', display: 'हिन्दी' },
  { name: 'Punjabi', display: 'ਪੰਜਾਬੀ' },
  { name: 'Tamil', display: 'தமிழ்' },
  { name: 'Telugu', display: 'తెలుగు' },
];

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
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

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    navigation.navigate('Signin');
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
    languageContainer: {
      width: windowWidth * 0.9,
      marginBottom: windowHeight * 0.04,
      flexDirection: orientation === 'landscape' ? 'row' : 'column',
      flexWrap: orientation === 'landscape' ? 'wrap' : 'nowrap',
      justifyContent: orientation === 'landscape' ? 'space-between' : 'center',
    },
    languageButton: {
      backgroundColor: '#ffffff',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      marginBottom: windowHeight * 0.02,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: windowHeight * 0.001 },
      shadowOpacity: 0.05,
      shadowRadius: windowWidth * 0.005,
      elevation: 1,
      width: orientation === 'landscape' ? windowWidth * 0.42 : windowWidth * 0.9,
    },
    selectedLanguageButton: {
      backgroundColor: '#3b82f6',
    },
    languageText: {
      fontSize: windowHeight * 0.022,
      color: '#1e293b',
    },
    selectedLanguageText: {
      color: '#ffffff',
      fontWeight: '600',
    },
    continueButton: {
      backgroundColor: '#3b82f6',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      width: windowWidth * 0.9,
      marginTop: windowHeight * 0.02,
    },
    continueButtonText: {
      color: '#ffffff',
      fontSize: windowHeight * 0.022,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Language</Text>
          <Text style={styles.subtitle}>Select your preferred language</Text>
        </View>

        <View style={styles.languageContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.name}
              style={[
                styles.languageButton,
                selectedLanguage === language.name && styles.selectedLanguageButton,
              ]}
              onPress={() => handleLanguageSelect(language.name)}
            >
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === language.name && styles.selectedLanguageText,
                ]}
              >
                {language.display}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;