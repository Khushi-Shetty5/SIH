import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import FileItem from '../../components/Pharmacy/FileItem';
import HeaderBar from '../../components/Pharmacy/HeaderBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../../styles/globalStyles';

const PharmacyMedicineSearchScreen = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const loadInventory = async () => {
      const stored = await AsyncStorage.getItem('inventory');
      if (stored) setMedicines(JSON.parse(stored));
    };
    loadInventory();
  }, []);

  const handleRestock = () => {
    // Implement restock logic
  };

  return (
    <View style={globalStyles.container}>
      <HeaderBar />
      <FileItem medicines={medicines} onRestock={handleRestock} />
      <Button title="Add/Restock" onPress={handleRestock} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PharmacyMedicineSearchScreen;