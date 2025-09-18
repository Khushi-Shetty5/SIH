import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RtcEngine, ChannelProfile, ClientRole } from 'react-native-agora';
import { useLanguage } from '../languageConstants';

export default function VideoConsultationScreen({ route, navigation }) {
  const { translations, language } = useLanguage();
  const { channelName, token, appId, isDoctor, roomId, userId } = route.params || {};

  const [joined, setJoined] = useState(false);

  useEffect(() => {
    console.log('VideoConsultationScreen: route.params:', route.params);

    if (!channelName || !token || !appId) {
      Alert.alert(
        translations[language].videoConsultationTitle || 'Video Consultation',
        translations[language].failedToCreateRoom || 'Failed to join video call: Missing parameters',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }

    const initAgora = async () => {
      try {
        const engine = await RtcEngine.create(appId);
        await engine.setChannelProfile(ChannelProfile.Communication);
        await engine.setClientRole(isDoctor ? ClientRole.Broadcaster : ClientRole.Broadcaster);

        engine.addListener('UserJoined', (uid, elapsed) => {
          console.log('UserJoined', uid, elapsed);
        });

        engine.addListener('UserOffline', (uid, reason) => {
          console.log('UserOffline', uid, reason);
          Alert.alert(
            translations[language].videoConsultationTitle,
            translations[language].userLeft || 'The other user has left the call.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        });

        engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
          console.log('JoinChannelSuccess', channel, uid, elapsed);
          setJoined(true);
        });

        engine.addListener('Error', (err) => {
          console.error('Agora Error:', err);
          Alert.alert(
            translations[language].videoConsultationTitle,
            translations[language].failedToJoin || 'Failed to join video call: ' + err,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        });

        await engine.enableVideo();
        await engine.joinChannel(token, channelName, null, 0);
      } catch (error) {
        console.error('Agora Init Error:', error);
        Alert.alert(
          translations[language].videoConsultationTitle,
          translations[language].failedToJoin || 'Failed to initialize video call: ' + error.message,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    };

    initAgora();

    return () => {
      RtcEngine.destroy();
    };
  }, [channelName, token, appId, isDoctor, navigation, translations, language]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        {joined ? (
          <View style={styles.fullScreen}>
            <Text style={styles.statusText}>
              {translations[language].connected || 'Connected to video call'}
            </Text>
          </View>
        ) : (
          <Text style={styles.statusText}>
            {translations[language].connecting || 'Connecting...'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fullScreen: { flex: 1, width: '100%', height: '100%' },
  statusText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});