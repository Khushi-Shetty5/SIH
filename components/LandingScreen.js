import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

function LandingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MedKit</Text>
        <Text style={styles.subtitle}>Healthcare Management System</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={[styles.optionCard, styles.doctorCard]} 
          onPress={() => navigation.navigate('Doctor')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👨‍⚕️</Text>
          </View>
          <Text style={styles.optionTitle}>Doctor</Text>
          <Text style={styles.optionDescription}>Access patient records, emergency cases, and medical management tools</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.optionCard, styles.labCard]} 
          onPress={() => navigation.navigate('Lab')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🧬</Text>
          </View>
          <Text style={styles.optionTitle}>Lab Doctor</Text>
          <Text style={styles.optionDescription}>Manage lab reports, patient data, and test results</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Select your role to continue</Text>
      </View>
    </View>
  );
}

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  doctorCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#2E86C1',
  },
  labCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#28A745',
  },
  iconContainer: {
    marginBottom: 15,
  },
  icon: {
    fontSize: 48,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#212529',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: '#6c757d',
    fontSize: 14,
  },
});