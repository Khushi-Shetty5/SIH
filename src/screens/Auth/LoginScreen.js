import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';
import VoicePrompt from '../../components/Pharmacy/VoicePrompt';
import { globalStyles } from '../../styles/globalStyles';
import HeaderBar from '../../components/HeaderBar';

const LoginScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const { login } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const handleLogin = () => {
    if (pin === '1234') {
      login();
      navigation.navigate('Dashboard');
    } else {
      alert(t.invalidPin);
    }
  };

  return (
    <View style={globalStyles.container}>
      <HeaderBar />
      <VoicePrompt text={t.enterPin} language={language} />
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        placeholder={t.enterPin}
        secureTextEntry
      />
      <Button title={t.login} onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default LoginScreen;