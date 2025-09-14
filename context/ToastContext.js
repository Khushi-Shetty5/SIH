import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [visible, setVisible] = useState(false);
  const [opacity] = useState(new Animated.Value(0));

  const show = useCallback((msg, t = "info") => {
    setMessage(msg);
    setType(t);
    setVisible(true);
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
          setVisible(false);
        });
      }, 1400);
    });
  }, [opacity]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible && (
        <Animated.View style={[styles.toast, styles[type], { opacity }]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 40, // move from bottom to top
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  text: { color: "#fff", fontWeight: "600" },
  info: { backgroundColor: "#2E86C1" },
  success: { backgroundColor: "#28A745" },
  danger: { backgroundColor: "#dc3545" },
});


