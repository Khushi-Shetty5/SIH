import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import DashboardTile from '../../components/Pharmacy/DashboardTile';
import HeaderBar from '../../components/Pharmacy/HeaderBar';
import FloatingChatButton from '../../components/Pharmacy/FloatingChatButton';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';
import { globalStyles } from '../../styles/globalStyles';

const PharmacyDashboardScreen = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <View style={globalStyles.container}>
      <HeaderBar />
      <View style={styles.tiles}>
        <DashboardTile title={t.newRequests} iconName="notifications" screenName="AppointmentScreen" />
        <DashboardTile title={t.inventory} iconName="storage" screenName="MedicineSearchScreen" />
        <DashboardTile title={t.points} iconName="star" screenName="DoctorAvailabilityScreen" />
        <DashboardTile title={t.support} iconName="help" screenName="VideoConsultationScreen" />
      </View>
      <FloatingChatButton />
    </View>
  );
};

const styles = StyleSheet.create({
  tiles: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
});

export default PharmacyDashboardScreen;