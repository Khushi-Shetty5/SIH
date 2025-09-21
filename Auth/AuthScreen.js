import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const roles = [
  { label: "👨‍⚕️ Doctor", value: "doctor" },
  { label: "🔬 Lab Doctor", value: "labdoctor" },
];

export default function AuthScreen({ navigation, onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const base = "http://localhost:5000/api/auth";

  const toggle = () => {
    setIsSignup((s) => !s);
    // Clear form when switching
    setName("");
    setEmailOrPhone("");
    setPassword("");
    setRole("patient");
  };

  const validateForm = () => {
    if (isSignup && !name.trim()) {
      Alert.alert("Validation Error", "Please enter your full name");
      return false;
    }
    if (!emailOrPhone.trim()) {
      Alert.alert("Validation Error", "Please enter email or phone number");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Validation Error", "Please enter password");
      return false;
    }
    if (isSignup && password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters long"
      );
      return false;
    }
    return true;
  };

  // Fake Register
  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Registered 🎉", "OTP sent to your device", [
        {
          text: "Verify OTP",
          onPress: () =>
            navigation.navigate("OTPVerify", {
              contact: emailOrPhone,
              from: "register",
              role, // ✅ pass role here
            }),
        },
      ]);
    }, 1200);
  };

  // Fake Login - Fixed to only call onLogin
  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Login Success ✅",
        `Welcome back ${role === "labdoctor" ? "Lab Doctor" : "Doctor"}!`,
        [
          {
            text: "Continue",
            onPress: () => {
              if (onLogin) {
                onLogin(role); // This will trigger the navigation in App.js
              }
            }
          }
        ]
      );
    }, 1200);
  };

  const handleSendOtp = async () => {
    if (!emailOrPhone.trim()) {
      Alert.alert("Validation Error", "Please enter email or phone number");
      return;
    }

    setLoading(true);
    try {
      const payload = {};
      if (emailOrPhone.includes("@")) payload.email = emailOrPhone;
      else payload.phone = emailOrPhone;

      await axios.post(`${base}/send-otp`, payload);
      navigation.navigate("OTPVerify", {
        contact: emailOrPhone,
        from: "otp-login",
      });
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSelector = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.roleLabel}>Select your role</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={role}
          onValueChange={(v) => setRole(v)}
          style={styles.picker}
        >
          {roles.map((r) => (
            <Picker.Item key={r.value} label={r.label} value={r.value} />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isSignup ? "Create Account" : "Welcome Back"}
            </Text>
            <Text style={styles.subtitle}>
              {isSignup
                ? "Sign up to get started with your healthcare journey"
                : "Sign in to access your healthcare dashboard"}
            </Text>
          </View>

          <View style={styles.form}>
            {isSignup && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  style={[
                    styles.input,
                    focusedField === "name" && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email or Phone</Text>
              <TextInput
                placeholder="Enter email or phone number"
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                style={[
                  styles.input,
                  focusedField === "contact" && styles.inputFocused,
                ]}
                onFocus={() => setFocusedField("contact")}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.passwordInput}
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>
                    {showPassword ? "Hide" : "See"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {isSignup && renderRoleSelector()}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
              onPress={isSignup ? handleSignup : handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isSignup ? "Create Account" : "Sign In"}
                </Text>
              )}
            </TouchableOpacity>

            {!isSignup && (
              <View style={styles.linksContainer}>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.linkText}>Forgot password?</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.otpButton}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  <Text style={styles.otpButtonText}>📱 Sign in with OTP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={toggle} style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>
                {isSignup ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ... (styles remain the same)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    color: "#1a202c",
  },
  inputFocused: {
    borderColor: "#3b82f6",
    backgroundColor: "#ffffff",
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#1a202c",
  },
  eyeButton: {
    padding: 16,
  },
  eyeText: {
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },
  picker: {
    height: 50,
    color: "#1a202c",
  },

  roleContainer: {
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  rolePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  rolePickerText: {
    fontSize: 16,
    color: "#1a202c",
  },
  rolePickerArrow: {
    fontSize: 12,
    color: "#718096",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a202c",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 18,
    color: "#718096",
  },
  roleList: {
    paddingHorizontal: 20,
  },
  roleModalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  roleModalOptionSelected: {
    backgroundColor: "#f0f9ff",
  },
  roleModalOptionText: {
    fontSize: 16,
    color: "#374151",
  },
  roleModalOptionTextSelected: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  checkMark: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#3b82f6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linksContainer: {
    marginTop: 24,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#718096",
    fontSize: 12,
    fontWeight: "500",
  },
  otpButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  otpButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  footerText: {
    color: "#718096",
    fontSize: 14,
  },
  toggleButton: {
    marginLeft: 8,
  },
  toggleButtonText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "bold",
  },
});
