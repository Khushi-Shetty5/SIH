import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from '../../utils/LanguageContext';
import { ConnectivityContext } from '../../utils/ConnectivityContext';
import translations, { strings } from '../../constants/strings';
import { colors } from '../../styles/colors';
import HeaderBar from '../../components/Pharmacy/HeaderBar';
import FeedbackAlert from '../../components/Pharmacy/FeedbackAlert';
import VoicePrompt from '../../components/Pharmacy/VoicePrompt';
import { queueAction } from '../../utils/offlineSync';

const PharmacyAppointmentScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);
  const { isOnline } = useContext(ConnectivityContext);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const stored = await AsyncStorage.getItem('pharmacy_appointments');
        if (stored) setAppointments(JSON.parse(stored));
      } catch (e) {
        console.log('Error loading appointments:', e);
      }
    };
    loadAppointments();
  }, []);

  const bookAppointment = async () => {
    const newAppointment = {
      id: Date.now(),
      patientName: 'Sample Patient',
      time: new Date().toLocaleString(),
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);

    try {
      if (isOnline) {
        // Simulate API call
        console.log('Booking appointment:', newAppointment);
        await AsyncStorage.setItem('pharmacy_appointments', JSON.stringify(updatedAppointments));
      } else {
        await queueAction({ type: 'book_appointment', data: newAppointment });
      }
      <FeedbackAlert
        message={strings[language].confirmOrder}
        action={() => console.log('Appointment booked')}
      />;
    } catch (e) {
      console.log('Error saving appointment:', e);
    }
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentText}>{`${item.patientName} - ${item.time}`}</Text>
      <VoicePrompt text={`${item.patientName}, ${item.time}`} language={language} />
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBar titleKey="requests" navigation={navigation} />
      <Text style={styles.title}>{translations[language].requests}</Text>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>{translations[language].noAppointments}</Text>}
      />
      <Button
        mode="contained"
        onPress={bookAppointment}
        style={styles.button}
        accessibilityLabel={translations[language].bookAppointment}
      >
        {translations[language].bookAppointment}
      </Button>
      <VoicePrompt text={translations[language].requests} language={language} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, margin: 10 },
  appointmentItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  appointmentText: { fontSize: 16, color: colors.text },
  button: { margin: 10, backgroundColor: colors.primary },
});

export default PharmacyAppointmentScreen;
