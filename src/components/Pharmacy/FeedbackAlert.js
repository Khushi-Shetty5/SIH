import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';

const FeedbackAlert = ({ message, onHelp }) => {
  const navigation = useNavigation();
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  Alert.alert(t.feedback, message, [
    { text: t.ok },
    { text: t.help, onPress: () => navigation.navigate('VideoConsultation') },
  ]);
};

export default FeedbackAlert;