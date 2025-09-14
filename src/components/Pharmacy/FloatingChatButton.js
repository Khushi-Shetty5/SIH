import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';

const FloatingChatButton = () => {
  const navigation = useNavigation();
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  return (
    <View style={styles.panel}>
      <TouchableOpacity
        onPress={() => navigation.navigate('VideoConsultationScreen')}
        accessibilityLabel={t.support}
      >
        <Icon name="help" size={30} color="#333" />
        <Text style={styles.text}>{t.support}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: '#333',
  },
});

export default FloatingChatButton;