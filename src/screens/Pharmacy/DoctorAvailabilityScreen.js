import React from 'react';
import { View, StyleSheet } from 'react-native';
import PointsDisplay from '../../components/Pharmacy/PointsDisplay';
import HeaderBar from '../../components/Pharmacy/HeaderBar';
import { globalStyles } from '../../styles/globalStyles';

const PharmacyDoctorAvailabilityScreen = () => {
  return (
    <View style={globalStyles.container}>
      <HeaderBar />
      <PointsDisplay points={100} badges={['Gold', 'Silver']} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PharmacyDoctorAvailabilityScreen;