import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';

function SpeakButton({ text }) {
  const onSpeak = () => {
    if (text) Speech.speak(text);
  };

  return (
    <TouchableOpacity onPress={onSpeak} style={{ marginLeft: 8 }}>
      <MaterialIcons name="volume-up" size={20} color="#007AFF" />
    </TouchableOpacity>
  );
}

export default SpeakButton;
