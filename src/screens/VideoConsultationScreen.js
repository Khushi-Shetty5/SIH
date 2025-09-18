import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import HeaderBar from '../components/HeaderBar';
import FloatingChatButton from '../components/FloatingChatButton';
import { useLanguage } from '../languageConstants';

export default function VideoConsultationScreen({ navigation, route }) {
  const { translations, language } = useLanguage();
  const { roomUrl, isDoctor, roomId, userId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('VideoConsultationScreen: route.params:', { roomUrl, isDoctor, roomId, userId });
    if (!roomUrl) {
      console.error('VideoConsultationScreen: roomUrl is undefined');
      setError(translations[language].failedToCreateRoom || 'Failed to create video room');
      Alert.alert(
        translations[language].videoConsultationTitle || 'Video Consultation',
        translations[language].failedToCreateRoom || 'Failed to create video room. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
    setLoading(false);
  }, [roomUrl, isDoctor, roomId, userId, translations, language, navigation]);

  const handleChatPress = () => console.log('Chat button pressed');

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar navigation={navigation} />
      <View style={styles.content}>
        <Text style={styles.title}>{translations[language].videoConsultationTitle}</Text>
        {loading && <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && !error && roomUrl && (
          <WebView
            source={{ uri: roomUrl }}
            style={styles.webview}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error:', nativeEvent);
              Alert.alert(
                translations[language].videoConsultationTitle || 'Video Consultation',
                translations[language].failedToJoin || 'Failed to join video call. Please try again.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            }}
            javaScriptEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
          />
        )}
      </View>
      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  loader: { marginVertical: 20 },
  errorText: { color: 'red', textAlign: 'center', fontSize: 16 },
  webview: { flex: 1, borderRadius: 8 },
});