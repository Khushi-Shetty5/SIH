// Example inside HomeScreen.js
import React from 'react';
import { View, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Button 
        title="Join Room 123"
        onPress={() => navigation.navigate('CallScreen', { roomId: 'room123' })}
      />
    </View>
  );
}
