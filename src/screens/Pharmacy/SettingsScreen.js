import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HeaderBar from '../../components/Pharmacy/HeaderBar';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';
import { globalStyles } from '../../styles/globalStyles';

const PharmacySettingsScreen = () => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <View style={globalStyles.container}>
      <HeaderBar />
      <Text style={globalStyles.text}>{t.profile}</Text>
      <Text style={globalStyles.text}>{t.supportContact}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default PharmacySettingsScreen;