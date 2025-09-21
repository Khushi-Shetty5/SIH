import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import FloatingChatButton from '../components/FloatingChatButton';
import { strings } from '../constants/strings';

export default function SettingsScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+1 234 567 8900');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [healthConditions, setHealthConditions] = useState('Diabetes, Hypertension');

  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi'];

  const handleSavePhone = () => {
    console.log('Saving phone number:', phoneNumber);
    Alert.alert('Success', 'Phone number updated successfully');
  };

  const handleSaveConditions = () => {
    console.log('Saving health conditions:', healthConditions);
    Alert.alert('Success', 'Health conditions updated successfully');
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    console.log('Language changed to:', language);
    Alert.alert('Language', `Language changed to ${language}`);
  };

  const handleChatPress = () => {
    console.log('Chat button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileIcon}>
            <Icon name="account" size={48} color="#4A90E2" />
          </View>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileEmail}>john.doe@email.com</Text>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.changeLanguage}</Text>
          <View style={styles.languageContainer}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.languageOption,
                  selectedLanguage === language && styles.selectedLanguageOption
                ]}
                onPress={() => handleLanguageSelect(language)}
              >
                <Text style={[
                  styles.languageText,
                  selectedLanguage === language && styles.selectedLanguageText
                ]}>
                  {language}
                </Text>
                {selectedLanguage === language && (
                  <Icon name="check" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.updatePhone}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              placeholderTextColor="#9E9E9E"
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePhone}>
              <Text style={styles.saveButtonText}>{strings.save}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.healthConditions}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={healthConditions}
              onChangeText={setHealthConditions}
              placeholder="Enter your health conditions"
              placeholderTextColor="#9E9E9E"
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveConditions}>
              <Text style={styles.saveButtonText}>{strings.save}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Settings */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="bell-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Notifications</Text>
            <Icon name="chevron-right" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Icon name="shield-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Icon name="chevron-right" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Icon name="help-circle-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Icon name="chevron-right" size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Icon name="information-outline" size={24} color="#4A90E2" />
            <Text style={styles.settingText}>About</Text>
            <Icon name="chevron-right" size={20} color="#9E9E9E" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  languageContainer: {
    gap: 8,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedLanguageOption: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  inputContainer: {
    gap: 12,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
});
