import React, { useState, useContext } from 'react';
import { View, Button, FlatList, StyleSheet } from 'react-native';
import MedicineCard from '../../components/Pharmacy/MedicineCard';
import HeaderBar from '../../components/Pharmacy/HeaderBar';
import FeedbackAlert from '../../components/Pharmacy/FeedbackAlert';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';
import { sendSMS } from '../../utils/smsHandler';
import { sendBluetooth } from '../../utils/bluetoothHandler';
import { ConnectivityContext } from '../../utils/ConnectivityContext';
import { globalStyles } from '../../styles/globalStyles';

const PharmacyRecordsScreen = ({ route }) => {
  const { order } = route.params;
  const [medicines, setMedicines] = useState(order.medicines || []);
  const { language } = useContext(LanguageContext);
  const { isOnline, connectionType } = useContext(ConnectivityContext);
  const t = translations[language];

  const handleConfirm = () => {
    if (isOnline) {
      // Send via API
    } else if (connectionType === 'SMS') {
      sendSMS(order);
    } else if (connectionType === 'Bluetooth') {
      sendBluetooth(order);
    } else {
      FeedbackAlert({ message: t.noConnection, onHelp: () => navigation.navigate('VideoConsultation') });
    }
  };

  return (
    <View style={globalStyles.container}>
      <HeaderBar />
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MedicineCard
            medicine={item}
            onToggle={(id, available) => {
              const updated = medicines.map(m => m.id === id ? { ...m, available } : m);
              setMedicines(updated);
            }}
            onQuantityChange={(id, quantity) => {
              const updated = medicines.map(m => m.id === id ? { ...m, quantity } : m);
              setMedicines(updated);
            }}
            onPriceChange={(id, price) => {
              const updated = medicines.map(m => m.id === id ? { ...m, price } : m);
              setMedicines(updated);
            }}
          />
        )}
      />
      <Button title={t.confirmSend} onPress={handleConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PharmacyRecordsScreen;