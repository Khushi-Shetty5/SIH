import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor'); // Default role
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email, password });
      // All users now use email and password for login
      const response = await axios.post('http://192.168.1.48:5000/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Handle successful login
        // Navigate to the appropriate screen based on user role
        const { user } = response.data.data;
        console.log('User data received:', user);
        
        switch (user.role) {
          case 'admin':
            console.log('Navigating to Admin');
            navigation.replace('Admin');
            break;
          case 'receptionist':
            console.log('Navigating to Reception');
            navigation.replace('Reception');
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
            Alert.alert('Error', 'Unknown user role: ' + user.role);
        }
      } else {
        Alert.alert('Login Failed', response.data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.log('Login error:', error);
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <Text style={styles.label}>Role</Text>
        <View style={styles.roleButtonsContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'doctor' && styles.activeRole]}
            onPress={() => setRole('doctor')}
          >
            <Text style={[styles.roleText, role === 'doctor' && styles.activeRoleText]}>Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'lab' && styles.activeRole]}
            onPress={() => setRole('lab')}
          >
            <Text style={[styles.roleText, role === 'lab' && styles.activeRoleText]}>Lab Doctor</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'receptionist' && styles.activeRole]}
            onPress={() => setRole('receptionist')}
          >
            <Text style={[styles.roleText, role === 'receptionist' && styles.activeRoleText]}>Reception</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.activeRole]}
            onPress={() => setRole('admin')}
          >
            <Text style={[styles.roleText, role === 'admin' && styles.activeRoleText]}>Admin</Text>
          </TouchableOpacity>
        </View>
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
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
  roleContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    minWidth: '48%',
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    margin: 2,
  },
  activeRole: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  roleText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  activeRoleText: {
    color: '#fff',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#6c757d',
    fontSize: 16,
  },
  signupLink: {
    color: '#2E86C1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;