import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings'; 
import { colors } from '../../styles/colors';
import HeaderBar from '../../components/Pharmacy/HeaderBar';
import VoicePrompt from '../../components/Pharmacy/VoicePrompt';

const PharmacyVideoConsultationScreen = ({ navigation }) => {
  const { language } = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      <HeaderBar titleKey="support" navigation={navigation} />
      <Text style={styles.text}>{translations[language].support}</Text>
      <Button
        mode="contained"
        onPress={() => console.log('Start video consultation')}
        style={styles.button}
        accessibilityLabel={translations[language].startConsultation}
      >
        {translations[language].startConsultation}
      </Button>
      <VoicePrompt text={translations[language].support} language={language} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text, marginVertical: 20, textAlign: 'center' },
  button: { marginTop: 10, backgroundColor: colors.primary },
});

export default PharmacyVideoConsultationScreen;
