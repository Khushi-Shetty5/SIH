import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const languages = ['English', 'Kannada', 'Hindi', 'Punjabi', 'Tamil', 'Telugu'];

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    navigation.navigate('Signup');
  };

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
              key={language}
              style={[
                styles.languageButton,
                selectedLanguage === language && styles.selectedLanguageButton,
              ]}
              onPress={() => handleLanguageSelect(language)}
            >
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === language && styles.selectedLanguageText,
                ]}
              >
                {language}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('6%'),
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: hp('6%'),
  },
  title: {
    fontSize: hp('4%'),
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: hp('2.2%'),
    color: '#64748b',
  },
  languageContainer: {
    marginBottom: hp('4%'),
  },
  languageButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: hp('2%'),
    marginBottom: hp('2%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedLanguageButton: {
    backgroundColor: '#3b82f6',
  },
  languageText: {
    fontSize: hp('2.2%'),
    color: '#1e293b',
  },
  selectedLanguageText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: hp('2%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: hp('2.2%'),
    fontWeight: '600',
  },
});

export default LanguageSelectionScreen;