import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [role, setRole] = useState('receptionist'); // Default role
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Name, email, and password are required');
      return;
    }

    // Validate mobile for doctor and lab roles
    if ((role === 'doctor' || role === 'lab') && !mobile) {
      Alert.alert('Error', 'Mobile number is required for doctors and lab doctors');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Prepare data for all user types
      const signupData = { 
        name, 
        email,
        password,
        role 
      };
      
      // Add mobile and specialization for doctor and lab roles
      if (role === 'doctor' || role === 'lab') {
        signupData.mobile = mobile;
        signupData.specialization = specialization || (role === 'doctor' ? 'General Physician' : 'Lab Doctor');
      }

      // Using the updated backend URL structure
      const response = await axios.post('http://192.168.1.48:5000/api/auth/signup', signupData);

      if (response.data.success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.error || 'Signup failed');
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
        </View>

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
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        {(role === 'doctor' || role === 'lab') && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specialization</Text>
              <TextInput
                style={styles.input}
                placeholder={role === 'doctor' ? 'e.g., Cardiologist' : 'e.g., Pathologist'}
                value={specialization}
                onChangeText={setSpecialization}
              />
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Role</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'doctor' && styles.selectedRole]}
              onPress={() => setRole('doctor')}
            >
              <Text style={[styles.roleText, role === 'doctor' && styles.selectedRoleText]}>
                Doctor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'lab' && styles.selectedRole]}
              onPress={() => setRole('lab')}
            >
              <Text style={[styles.roleText, role === 'lab' && styles.selectedRoleText]}>
                Lab Doctor
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'receptionist' && styles.selectedRole]}
              onPress={() => setRole('receptionist')}
            >
              <Text style={[styles.roleText, role === 'receptionist' && styles.selectedRoleText]}>
                Receptionist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'admin' && styles.selectedRole]}
              onPress={() => setRole('admin')}
            >
              <Text style={[styles.roleText, role === 'admin' && styles.selectedRoleText]}>
                Admin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
          <Text style={styles.signupButtonText}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}> Log in</Text>
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedRole: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  roleText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedRoleText: {
    color: '#fff',
  },
  signupButton: {
    backgroundColor: '#2E86C1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#6c757d',
    fontSize: 16,
  },
  loginLink: {
    color: '#2E86C1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupScreen;