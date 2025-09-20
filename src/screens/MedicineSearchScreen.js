import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import MedicineCard from '../components/MedicineCard';
import FloatingChatButton from '../components/FloatingChatButton';
import { strings } from '../constants/strings';

export default function MedicineSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const medicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      use: 'Pain relief, Fever',
      price: 25
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      use: 'Antibiotic',
      price: 120
    },
    {
      id: 3,
      name: 'Cetirizine 10mg',
      use: 'Allergy relief',
      price: 45
    },
    {
      id: 4,
      name: 'Omeprazole 20mg',
      use: 'Acid reflux',
      price: 85
    },
    {
      id: 5,
      name: 'Ibuprofen 400mg',
      use: 'Pain relief, Anti-inflammatory',
      price: 35
    }
  ];

  const nearbyPharmacies = [
    { name: 'Apollo Pharmacy', distance: '0.5 km', time: '10 min' },
    { name: 'MedPlus', distance: '1.2 km', time: '15 min' },
    { name: 'Wellness Pharmacy', distance: '2.1 km', time: '20 min' }
  ];

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.use.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (medicine) => {
    console.log('Added to cart:', medicine.name);
    setCartCount(cartCount + 1);
  };

  const handleChatPress = () => {
    console.log('Chat button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={strings.searchMedicines}
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Medicine List */}
        <View style={styles.medicineList}>
          {filteredMedicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onAdd={() => handleAddToCart(medicine)}
            />
          ))}
        </View>

        {/* Nearby Pharmacies */}
        <View style={styles.pharmaciesSection}>
          <Text style={styles.sectionTitle}>{strings.nearbyPharmacies}</Text>
          {nearbyPharmacies.map((pharmacy, index) => (
            <View key={index} style={styles.pharmacyCard}>
              <Icon name="store" size={24} color="#4A90E2" style={styles.pharmacyIcon} />
              <View style={styles.pharmacyDetails}>
                <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
                <Text style={styles.pharmacyDistance}>
                  {pharmacy.distance} • {pharmacy.time}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color="#9E9E9E" />
            </View>
          ))}
        </View>

        {/* Cart Summary */}
        {cartCount > 0 && (
          <View style={styles.cartSummary}>
            <Text style={styles.cartText}>Items in cart: {cartCount}</Text>
          </View>
        )}
      </ScrollView>
      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  medicineList: {
    marginBottom: 24,
  },
  pharmaciesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  pharmacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pharmacyIcon: {
    marginRight: 12,
  },
  pharmacyDetails: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  pharmacyDistance: {
    fontSize: 14,
    color: '#666',
  },
  cartSummary: {
    backgroundColor: '#4A90E2',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
