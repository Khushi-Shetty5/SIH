import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { strings } from '../constants/strings';

export default function MedicineCard({ medicine, onAdd }) {
  return (
    <View style={styles.card}>
      <View style={styles.medicineInfo}>
        <Icon name="pill" size={24} color="#4A90E2" style={styles.icon} />
        <View style={styles.details}>
          <Text style={styles.name}>{medicine.name}</Text>
          <Text style={styles.use}>{medicine.use}</Text>
          <Text style={styles.price}>₹{medicine.price}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Icon name="plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>{strings.addToCart}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  use: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
