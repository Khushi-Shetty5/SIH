import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const DebugLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    setResponse(null);
    try {
      console.log('Attempting login with:', { email, password });
      
      // All users now use email and password for login
      const response = await axios.post('http://192.168.1.48:5000/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);
      setResponse(response.data);

      if (response.data.success) {
        // Handle successful login
        // Navigate to the appropriate screen based on user role
        const { user } = response.data.data;
        console.log('User data:', user);
        
        switch (user.role) {
          case 'admin':
            console.log('Navigating to ReceptionAdmin');
            navigation.replace('ReceptionAdmin');
            break;
          case 'receptionist':
            console.log('Navigating to ReceptionAdmin');
            navigation.replace('ReceptionAdmin');
            break;
          case 'doctor':
            console.log('Navigating to Doctor with userData:', user);
            navigation.replace('Doctor', { userData: user });
            break;
          case 'lab':
            console.log('Navigating to Lab with userData:', user);
            navigation.replace('Lab', { userData: user });
            break;
          default:
            Alert.alert('Error', 'Unknown user role');
        }
      } else {
        Alert.alert('Error', response.data.error || 'Login failed');
      }
    } catch (error) {
      console.log('Login error:', error);
      setResponse(error.response?.data || error.message);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.error || 'Login failed');
      } else {
        Alert.alert('Error', 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Debug Login</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Role</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter role (doctor, lab, admin, receptionist)"
            value={role}
            onChangeText={setRole}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {response && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>Response:</Text>
            <Text style={styles.responseText}>{JSON.stringify(response, null, 2)}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#212529',
  },
  loginButton: {
    backgroundColor: '#2E86C1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  responseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default DebugLoginScreen;