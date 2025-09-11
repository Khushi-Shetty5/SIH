import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OTPScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState('');
  const { phone } = route.params || {};
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

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    // Mock OTP verification for offline app
    if (otp === '123456') {
      navigation.replace('Home');
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
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
      textAlign: 'center',
    },
    form: {
      width: windowWidth * 0.9,
      marginBottom: windowHeight * 0.04,
    },
    phoneContainer: {
      backgroundColor: '#e2e8f0',
      borderRadius: windowWidth * 0.03,
      marginBottom: windowHeight * 0.02,
      paddingHorizontal: windowWidth * 0.04,
      paddingVertical: windowHeight * 0.015,
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneText: {
      fontSize: windowHeight * 0.02,
      color: '#1e293b',
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
    verifyButton: {
      backgroundColor: '#3b82f6',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginTop: windowHeight * 0.01,
    },
    verifyButtonText: {
      color: '#ffffff',
      fontSize: windowHeight * 0.02,
      fontWeight: '600',
    },
    resendOTP: {
      alignItems: 'center',
      marginTop: windowHeight * 0.02,
    },
    resendOTPText: {
      color: '#3b82f6',
      fontSize: windowHeight * 0.018,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your phone{'\n'}
            {phone ? `(${phone})` : ''}
          </Text>
        </View>

        <View style={styles.form}>
          {phone && (
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneText}>Phone: {phone}</Text>
            </View>
          )}
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendOTP}>
            <Text style={styles.resendOTPText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;