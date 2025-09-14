import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ConnectivityContext } from '../../utils/ConnectivityContext';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';
import { colors } from '../../styles/colors';

const HeaderBar = () => {
  const { isOnline, connectionType } = useContext(ConnectivityContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const t = translations[language];
  const languages = ['en', 'hi', 'pa'];

  const status = isOnline ? t.online : `${t.offline} (${connectionType || 'None'})`;
  const bgColor = isOnline ? colors.primary : colors.secondary;

  return (
    <View style={styles.container}>
      <View style={[styles.banner, { backgroundColor: bgColor }]}>
        <Text style={styles.text}>{status}</Text>
      </View>
      {/*<View style={styles.languageSwitcher}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang}
            onPress={() => setLanguage(lang)}
            style={[styles.button, language === lang ? styles.active : null]}
            accessibilityLabel={lang}
          >
            <Text style={styles.text}>{lang.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  banner: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  active: {
    backgroundColor: '#4CAF50',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HeaderBar;