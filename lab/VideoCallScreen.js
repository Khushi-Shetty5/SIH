// // screens/lab/VideoCallScreen.js
// import React, { useEffect } from "react";
// import { View, StyleSheet } from "react-native";
// import JitsiMeet, { JitsiMeetView } from "react-native-jitsi-meet";

// export default function VideoCallScreen({ route }) {
//   const { roomId } = route.params; // comes from navigation

//   useEffect(() => {
//     setTimeout(() => {
//       JitsiMeet.call(`https://meet.jit.si/${roomId}`);
//     }, 1000);

//     return () => {
//       JitsiMeet.endCall();
//     };
//   }, [roomId]);

//   return (
//     <View style={styles.container}>
//       <JitsiMeetView style={styles.video} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   video: { flex: 1 },
// });

// lab/VideoCallScreen.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function VideoCallScreen({ route }) {
  const { roomId } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: `https://meet.jit.si/${roomId}` }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
