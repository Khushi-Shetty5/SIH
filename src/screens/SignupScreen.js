import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const genders = ['Male', 'Female', 'Other'];
const languages = [
  { name: 'English', display: 'English' },
  { name: 'Kannada', display: 'ಕನ್ನಡ' },
  { name: 'Hindi', display: 'हिन्दी' },
  { name: 'Punjabi', display: 'ਪੰਜਾਬੀ' },
  { name: 'Tamil', display: 'தமிழ்' },
  { name: 'Telugu', display: 'తెలుగు' },
];

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [healthRecords, setHealthRecords] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [consent, setConsent] = useState(false);
  const [healthParameters, setHealthParameters] = useState('');
  const [disabilityStatus, setDisabilityStatus] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSignup = () => {
    if (
      !name ||
      !age ||
      !gender ||
      !language ||
      !contact ||
      !address ||
      !emergencyContact ||
      !emergencyRelation ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!consent) {
      Alert.alert('Error', 'Please consent to store health data');
      return;
    }
    navigation.navigate('OTP', { phone: contact });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
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
      color: '#1e293b',
      marginBottom: windowHeight * 0.01,
    },
    subtitle: {
      fontSize: windowHeight * 0.022,
      color: '#64748b',
    },
    form: {
      width: windowWidth * 0.9,
      marginBottom: windowHeight * 0.04,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: windowWidth * 0.03,
      marginBottom: windowHeight * 0.02,
      paddingHorizontal: windowWidth * 0.04,
      paddingVertical: windowHeight * 0.005,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: windowHeight * 0.001 },
      shadowOpacity: 0.05,
      shadowRadius: windowWidth * 0.005,
      elevation: 1,
    },
    inputIcon: {
      marginRight: windowWidth * 0.03,
      fontSize: windowHeight * 0.025,
    },
    input: {
      flex: 1,
      paddingVertical: windowHeight * 0.02,
      fontSize: windowHeight * 0.02,
      color: '#1e293b',
    },
    pickerContainer: {
      marginBottom: windowHeight * 0.02,
    },
    pickerLabel: {
      fontSize: windowHeight * 0.022,
      color: '#1e293b',
      marginBottom: windowHeight * 0.01,
      fontWeight: '500',
    },
    picker: {
      height: windowHeight * 0.08, // Increased height for visibility
      width: '100%',
      color: '#1e293b',
      fontSize: windowHeight * 0.02,
    },
    eyeIcon: {
      padding: windowWidth * 0.01,
    },
    consentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: windowHeight * 0.02,
    },
    checkbox: {
      marginRight: windowWidth * 0.02,
    },
    consentText: {
      fontSize: windowHeight * 0.018,
      color: '#64748b',
    },
    signupButton: {
      backgroundColor: '#10b981',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginTop: windowHeight * 0.01,
    },
    signupButtonText: {
      color: '#ffffff',
      fontSize: windowHeight * 0.02,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      color: '#64748b',
      fontSize: windowHeight * 0.018,
    },
    signupLink: {
      color: '#3b82f6',
      fontSize: windowHeight * 0.018,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join MedKit today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Age *"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Gender *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="male-female-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Gender *" value="" />
                  {genders.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Language *</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="language-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
                <Picker
                  selectedValue={language}
                  onValueChange={(itemValue) => setLanguage(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Language *" value="" />
                  {languages.map((item) => (
                    <Picker.Item key={item.name} label={item.display} value={item.name} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contact Number *"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Address *"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="medical-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Health Records (Optional)"
                value={healthRecords}
                onChangeText={setHealthRecords}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="medkit-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Current Medications (Optional)"
                value={currentMedications}
                onChangeText={setCurrentMedications}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-circle-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Emergency Contact Number *"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="people-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Emergency Contact Relation *"
                value={emergencyRelation}
                onChangeText={setEmergencyRelation}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="accessibility-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Disability Status (Optional)"
                value={disabilityStatus}
                onChangeText={setDisabilityStatus}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="heart-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Health Parameters (Optional)"
                value={healthParameters}
                onChangeText={setHealthParameters}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password *"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={styles.inputIcon.fontSize}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password *"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={styles.inputIcon.fontSize}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.consentContainer}>
              <TouchableOpacity
                onPress={() => setConsent(!consent)}
                style={styles.checkbox}
              >
                <Ionicons
                  name={consent ? 'checkbox-outline' : 'square-outline'}
                  size={styles.inputIcon.fontSize}
                  color="#3b82f6"
                />
              </TouchableOpacity>
              <Text style={styles.consentText}>
                I consent to store my health data
              </Text>
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Get OTP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.signupLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;