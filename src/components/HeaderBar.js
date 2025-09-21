import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { strings } from '../constants/strings';

export default function HeaderBar({ navigation, showProfile = true }) {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{strings.medkit}</Text>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.phoneButton}>
          <Icon name="call" size={20} color="#4A90E2" />
          <Text style={styles.phoneText}>{strings.tollFree}</Text>
        </TouchableOpacity>
        
        {showProfile && (
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="person-circle" size={28} color="#4A90E2" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  phoneText: {
    fontSize: 12,
    color: '#4A90E2',
    marginLeft: 4,
  },
  profileButton: {
    marginLeft: 8,
  },
});
