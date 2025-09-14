
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';

const MedicineCard = ({ medicine, onToggle, onQuantityChange, onPriceChange, isInventory }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];
  const [available, setAvailable] = useState(medicine.available || false);
  const [quantity, setQuantity] = useState(medicine.quantity || 1);
  const [price, setPrice] = useState(medicine.price || '');

  const handleToggle = () => {
    setAvailable(!available);
    if (onToggle) onToggle(medicine.id, !available);
  };

  return (
    <View style={styles.card}>
      <Icon name="local-pharmacy" size={30} color="#333" style={styles.icon} />
      <View style={styles.info}>
        <Text style={styles.name}>{medicine.name}</Text>
        {isInventory && (
          <Text style={[styles.stock, medicine.stock < 10 ? styles.lowStock : null]}>
            {t.stock}: {medicine.stock}
          </Text>
        )}
      </View>
      {!isInventory && (
        <>
          <Switch value={available} onValueChange={handleToggle} />
          <TextInput
            style={styles.input}
            value={quantity.toString()}
            onChangeText={(text) => {
              setQuantity(parseInt(text) || 1);
              if (onQuantityChange) onQuantityChange(medicine.id, parseInt(text) || 1);
            }}
            keyboardType="numeric"
            accessibilityLabel={t.quantity}
          />
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              if (onPriceChange) onPriceChange(medicine.id, text);
            }}
            keyboardType="numeric"
            accessibilityLabel={t.price}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 15,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 14,
    color: '#666',
  },
  lowStock: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginLeft: 10,
    width: 50,
    textAlign: 'center',
  },
});

export default MedicineCard;