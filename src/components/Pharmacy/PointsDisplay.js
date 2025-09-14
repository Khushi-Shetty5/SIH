import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles/colors';
import translations from '../../constants/strings';
import { LanguageContext } from '../../utils/LanguageContext';

const PointsDisplay = ({ points, badges }) => {
  const {language}=useContext(LanguageContext);
    const t = translations[language];

  return (
    <View style={styles.container}>
      <Icon name="star" size={30} color={colors.secondary} />
      <Text style={styles.points}>{points} {t.points}</Text>
      <Text style={styles.badges}>{t.badges}: {badges.join(', ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  points: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  badges: {
    fontSize: 16,
    color: '#666',
  },
});

export default PointsDisplay;