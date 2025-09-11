import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SigninScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
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

  const handleSignin = () => {
    if (!phone || !name) {
      Alert.alert('Error', 'Please enter both phone number and name');
      return;
    }
    navigation.replace('Home');
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
    signinButton: {
      backgroundColor: '#3b82f6',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginTop: windowHeight * 0.01,
    },
    signinButtonText: {
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
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>MedKit</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Name *"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.signinButton} onPress={handleSignin}>
            <Text style={styles.signinButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SigninScreen;