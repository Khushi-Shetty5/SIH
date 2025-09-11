import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
  { name: 'English', display: 'English' },
  { name: 'Kannada', display: 'ಕನ್ನಡ' },
  { name: 'Hindi', display: 'हिन्दी' },
  { name: 'Punjabi', display: 'ਪੰਜਾਬੀ' },
  { name: 'Tamil', display: 'தமிழ்' },
  { name: 'Telugu', display: 'తెలుగు' },
];

const SettingsScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true); // Default to true for offline app
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [orientation, setOrientation] = useState(windowWidth > windowHeight ? 'landscape' : 'portrait');

  useEffect(() => {
    // Load settings from AsyncStorage
    const loadSettings = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        const savedNotifications = await AsyncStorage.getItem('notifications');
        const savedBandwidth = await AsyncStorage.getItem('lowBandwidth');
        const savedOffline = await AsyncStorage.getItem('offlineMode');
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedLanguage) setSelectedLanguage(savedLanguage);
        if (savedNotifications) setNotificationsEnabled(savedNotifications === 'true');
        if (savedBandwidth) setLowBandwidthMode(savedBandwidth === 'true');
        if (savedOffline) setOfflineMode(savedOffline === 'true');
        if (savedTheme) setIsDarkTheme(savedTheme === 'dark');
      } catch (error) {
        console.error('Error loading settings:', error);
        Alert.alert('Error', 'Failed to load settings. Please try again.');
      }
    };
    loadSettings();

    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setWindowWidth(width);
      setWindowHeight(height);
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('language', selectedLanguage);
      await AsyncStorage.setItem('notifications', notificationsEnabled.toString());
      await AsyncStorage.setItem('lowBandwidth', lowBandwidthMode.toString());
      await AsyncStorage.setItem('offlineMode', offlineMode.toString());
      await AsyncStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
      console.log('Settings saved. Syncing when online...'); // Mock sync
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkTheme ? '#1e293b' : '#f8fafc',
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: windowHeight * 0.02,
      paddingHorizontal: orientation === 'landscape' ? windowWidth * 0.1 : windowWidth * 0.06,
    },
    content: {
      flex: 1,
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
      color: isDarkTheme ? '#ffffff' : '#1e293b',
      marginBottom: windowHeight * 0.01,
    },
    subtitle: {
      fontSize: windowHeight * 0.022,
      color: isDarkTheme ? '#d1d5db' : '#64748b',
    },
    form: {
      width: windowWidth * 0.9,
      marginBottom: windowHeight * 0.04,
    },
    settingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDarkTheme ? '#374151' : '#ffffff',
      borderRadius: windowWidth * 0.03,
      marginBottom: windowHeight * 0.02,
      paddingHorizontal: windowWidth * 0.04,
      paddingVertical: windowHeight * 0.015,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: windowHeight * 0.001 },
      shadowOpacity: 0.05,
      shadowRadius: windowWidth * 0.005,
      elevation: 1,
    },
    settingText: {
      fontSize: windowHeight * 0.022,
      color: isDarkTheme ? '#d1d5db' : '#1e293b',
      flex: 1,
    },
    settingIcon: {
      marginRight: windowWidth * 0.03,
      fontSize: windowHeight * 0.025,
      color: isDarkTheme ? '#d1d5db' : '#64748b',
    },
    languageContainer: {
      marginBottom: windowHeight * 0.02,
      flexDirection: orientation === 'landscape' ? 'row' : 'column',
      flexWrap: orientation === 'landscape' ? 'wrap' : 'nowrap',
      justifyContent: orientation === 'landscape' ? 'space-between' : 'center',
    },
    languageButton: {
      backgroundColor: isDarkTheme ? '#374151' : '#ffffff',
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
      color: isDarkTheme ? '#d1d5db' : '#1e293b',
    },
    selectedLanguageText: {
      color: '#ffffff',
      fontWeight: '600',
    },
    helpButton: {
      backgroundColor: isDarkTheme ? '#374151' : '#ffffff',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginBottom: windowHeight * 0.02,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: windowHeight * 0.001 },
      shadowOpacity: 0.05,
      shadowRadius: windowWidth * 0.005,
      elevation: 1,
    },
    helpButtonText: {
      fontSize: windowHeight * 0.022,
      color: isDarkTheme ? '#d1d5db' : '#3b82f6',
      fontWeight: '600',
    },
    saveButton: {
      backgroundColor: '#10b981',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginTop: windowHeight * 0.01,
    },
    saveButtonText: {
      color: '#ffffff',
      fontSize: windowHeight * 0.02,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Customize your app experience</Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.languageText, { marginBottom: windowHeight * 0.01, fontWeight: '500' }]}>
              Select Language
            </Text>
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

            <View style={styles.settingContainer}>
              <Ionicons
                name="notifications-outline"
                size={styles.settingIcon.fontSize}
                color={styles.settingIcon.color}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Enable Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f4f4f5'}
              />
            </View>

            <View style={styles.settingContainer}>
              <Ionicons
                name="cloud-download-outline"
                size={styles.settingIcon.fontSize}
                color={styles.settingIcon.color}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Low Bandwidth Mode</Text>
              <Switch
                value={lowBandwidthMode}
                onValueChange={setLowBandwidthMode}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={lowBandwidthMode ? '#ffffff' : '#f4f4f5'}
              />
            </View>

            <View style={styles.settingContainer}>
              <Ionicons
                name="cloud-offline-outline"
                size={styles.settingIcon.fontSize}
                color={styles.settingIcon.color}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Offline Mode</Text>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={offlineMode ? '#ffffff' : '#f4f4f5'}
              />
            </View>

            <View style={styles.settingContainer}>
              <Ionicons
                name="contrast-outline"
                size={styles.settingIcon.fontSize}
                color={styles.settingIcon.color}
                style={styles.settingIcon}
              />
              <Text style={styles.settingText}>Dark Theme</Text>
              <Switch
                value={isDarkTheme}
                onValueChange={setIsDarkTheme}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={isDarkTheme ? '#ffffff' : '#f4f4f5'}
              />
            </View>

            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => navigation.navigate('HelpFAQ')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="help-circle-outline"
                  size={styles.settingIcon.fontSize}
                  color={isDarkTheme ? '#d1d5db' : '#3b82f6'}
                  style={{ marginRight: windowWidth * 0.03 }}
                />
                <Text style={styles.helpButtonText}>Help & FAQ</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;