import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MedicineSearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  const medicines = [
    { id: 1, name: 'Paracetamol', type: 'Tablet', price: '$5.99', description: 'Pain relief and fever reducer' },
    { id: 2, name: 'Ibuprofen', type: 'Capsule', price: '$8.50', description: 'Anti-inflammatory medication' },
    { id: 3, name: 'Amoxicillin', type: 'Capsule', price: '$12.99', description: 'Antibiotic for bacterial infections' },
    { id: 4, name: 'Vitamin C', type: 'Tablet', price: '$6.75', description: 'Immune system support' },
    { id: 5, name: 'Vitamin D3', type: 'Softgel', price: '$9.25', description: 'Bone health supplement' },
    { id: 6, name: 'Aspirin', type: 'Tablet', price: '$4.50', description: 'Pain relief and blood thinner' },
  ];

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredMedicines([]);
    } else {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(text.toLowerCase()) ||
        medicine.description.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  };

  const renderMedicineItem = ({ item }) => (
    <View style={styles.medicineCard}>
      <View style={styles.medicineIcon}>
        <Ionicons name="medical-outline" size={24} color="#3b82f6" />
      </View>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineType}>{item.type}</Text>
        <Text style={styles.medicineDescription}>{item.description}</Text>
      </View>
      <View style={styles.medicinePrice}>
        <Text style={styles.priceText}>{item.price}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <View style={styles.content}>
        {searchText.trim() === '' ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateTitle}>Search for medicines</Text>
            <Text style={styles.emptyStateText}>
              Enter the name of a medicine to find information and pricing
            </Text>
          </View>
        ) : filteredMedicines.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyStateTitle}>No medicines found</Text>
            <Text style={styles.emptyStateText}>
              Try searching with a different term
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMedicines}
            renderItem={renderMedicineItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  medicineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medicineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  medicineType: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  medicineDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 18,
  },
  medicinePrice: {
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MedicineSearchScreen;
