import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  English: {
    // Core App
    app_name: 'MedKit',
    medkit: 'MedKit',
    
    // Language Selection
    choose_language: 'Choose Language',
    select_preferred_language: 'Select your preferred language for the app',
    welcome_message: 'Welcome to MedKit! Select your preferred language to get started.',
    language_selected: 'Language changed to',
    continue: 'Continue',
    play_welcome: 'Play Welcome Message',
    
    // TTS
    tts_toggle: 'Voice Assistance',
    tts_enabled: 'Voice Assistance Enabled',
    tts_disabled: 'Voice Assistance Disabled',
    
    // Signup Screen
    create_account: 'Create Account',
    join_medkit: 'Join MedKit to manage your health appointments seamlessly',
    full_name_placeholder: 'Full Name',
    contact_placeholder: 'Phone Number',
    age_placeholder: 'Age',
    select_gender: 'Select Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    select_language: 'Select Language',
    address_placeholder: 'Address',
    emergency_contact_placeholder: 'Emergency Contact',
    emergency_relation_placeholder: 'Emergency Relation',
    disability_status_placeholder: 'Disability Status (Optional)',
    health_parameters_placeholder: 'Health Parameters (Optional)',
    password_placeholder: 'Password',
    confirm_password_placeholder: 'Confirm Password',
    get_otp: 'Get OTP',
    already_have_account: 'Already have an account? ',
    sign_in_link: 'Sign In',
    name_placeholder: 'Full Name',
    phone_placeholder: 'Phone Number',
    enter_field: 'Please enter',
    
    // Sign In Screen
    sign_in_to_continue: 'Sign in to continue',
    sign_in: 'Sign In',
    no_account: "Don't have an account? ",
    sign_up_link: 'Sign Up',
    signin_error: 'Please enter both name and phone number',
    signin_success: 'Signed in successfully',
    network_error: 'Network error. Please check your connection',
    
    // OTP Screen
    verify_otp: 'Verify OTP',
    enter_otp: 'Enter the OTP sent to your phone',
    enter_otp_placeholder: 'Enter 6-digit OTP',
    verify_otp_button: 'Verify OTP',
    resend_otp: 'Resend OTP',
    phone_label: 'Phone: ',
    enter_valid_otp: 'Please enter a valid 6-digit OTP',
    invalid_otp: 'Invalid or expired OTP',
    otp_resent: 'OTP resent successfully',
    otp_sent: 'OTP sent to your phone',
    signup_success: 'Account created successfully',
    signup_failed: 'Signup failed',
    otp_store_failed: 'Failed to store OTP',
    otp_send_failed: 'Failed to send OTP',
    sms_unavailable: 'SMS is not available on this device',
    success: 'Success',
    error: 'Error',
    
    // Profile Screen
    profile_title: 'Profile',
    profile_subtitle: 'View your personal and health information',
    name_label: 'Name: ',
    age_label: 'Age: ',
    gender_label: 'Gender: ',
    language_label: 'Language: ',
    address_label: 'Address: ',
    emergency_contact_label: 'Emergency Contact: ',
    emergency_relation_label: 'Emergency Relation: ',
    disability_status_label: 'Disability Status: ',
    health_parameters_label: 'Health Parameters: ',
    health_records_label: 'Health Records',
    blood_pressure_label: 'Blood Pressure: ',
    heart_rate_label: 'Heart Rate: ',
    blood_sugar_label: 'Blood Sugar: ',
    medical_history_label: 'Medical History: ',
    last_checkup_label: 'Last Checkup: ',
    edit_profile: 'Edit Profile',
    fetch_profile_error: 'Failed to fetch profile data',
    loading_profile: 'Loading profile...',
    none: 'None',
    
    // Validation
    password_mismatch: 'Passwords do not match',
    invalid_phone: 'Invalid phone number format',
    invalid_emergency_phone: 'Invalid emergency contact number format',
    invalid_age: 'Please enter a valid age (1-150)',
    sending: 'Sending...',
  },
  Hindi: {
    // Core App
    app_name: 'मेडकिट',
    medkit: 'मेडकिट',
    
    // Language Selection
    choose_language: 'भाषा चुनें',
    select_preferred_language: 'अपनी पसंदीदा भाषा चुनें',
    welcome_message: 'मेडकिट में आपका स्वागत है! शुरू करने के लिए अपनी पसंदीदा भाषा चुनें।',
    language_selected: 'भाषा को बदल दिया गया',
    continue: 'जारी रखें',
    play_welcome: 'स्वागत संदेश चलाएं',
    
    // TTS
    tts_toggle: 'आवाज सहायता',
    tts_enabled: 'आवाज सहायता सक्षम',
    tts_disabled: 'आवाज सहायता अक्षम',
    
    // Signup Screen
    create_account: 'खाता बनाएं',
    join_medkit: 'मेडकिट में शामिल हों ताकि अपने स्वास्थ्य नियुक्तियों को आसानी से प्रबंधित करें',
    full_name_placeholder: 'पूरा नाम',
    contact_placeholder: 'फोन नंबर',
    age_placeholder: 'आयु',
    select_gender: 'लिंग चुनें',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    select_language: 'भाषा चुनें',
    address_placeholder: 'पता',
    emergency_contact_placeholder: 'आपातकालीन संपर्क',
    emergency_relation_placeholder: 'आपातकालीन संबंध',
    disability_status_placeholder: 'विकलांगता स्थिति (वैकल्पिक)',
    health_parameters_placeholder: 'स्वास्थ्य पैरामीटर (वैकल्पिक)',
    password_placeholder: 'पासवर्ड',
    confirm_password_placeholder: 'पासवर्ड की पुष्टि करें',
    get_otp: 'ओटीपी प्राप्त करें',
    already_have_account: 'पहले से ही खाता है? ',
    sign_in_link: 'साइन इन करें',
    name_placeholder: 'पूरा नाम',
    phone_placeholder: 'फोन नंबर',
    enter_field: 'कृपया दर्ज करें',
    
    // Sign In Screen
    sign_in_to_continue: 'जारी रखने के लिए साइन इन करें',
    sign_in: 'साइन इन',
    no_account: 'कोई खाता नहीं? ',
    sign_up_link: 'साइन अप करें',
    signin_error: 'कृपया नाम और फोन नंबर दोनों दर्ज करें',
    signin_success: 'साइन इन सफल',
    network_error: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें',
    
    // OTP Screen
    verify_otp: 'ओटीपी सत्यापित करें',
    enter_otp: 'अपने फोन पर भेजा गया ओटीपी दर्ज करें',
    enter_otp_placeholder: '6-अंकीय ओटीपी दर्ज करें',
    verify_otp_button: 'ओटीपी सत्यापित करें',
    resend_otp: 'ओटीपी पुनः भेजें',
    phone_label: 'फोन: ',
    enter_valid_otp: 'कृपया वैध 6-अंकीय ओटीपी दर्ज करें',
    invalid_otp: 'अमान्य या समाप्त ओटीपी',
    otp_resent: 'ओटीपी सफलतापूर्वक पुनः भेजा गया',
    otp_sent: 'आपके फोन पर ओटीपी भेज दिया गया',
    signup_success: 'खाता सफलतापूर्वक बनाया गया',
    signup_failed: 'साइनअप विफल',
    otp_store_failed: 'ओटीपी स्टोर करने में विफल',
    otp_send_failed: 'ओटीपी भेजने में विफल',
    sms_unavailable: 'इस डिवाइस पर SMS उपलब्ध नहीं है',
    success: 'सफल',
    error: 'त्रुटि',
    
    // Profile Screen
    profile_title: 'प्रोफाइल',
    profile_subtitle: 'अपनी व्यक्तिगत और स्वास्थ्य जानकारी देखें',
    name_label: 'नाम: ',
    age_label: 'आयु: ',
    gender_label: 'लिंग: ',
    language_label: 'भाषा: ',
    address_label: 'पता: ',
    emergency_contact_label: 'आपातकालीन संपर्क: ',
    emergency_relation_label: 'आपातकालीन संबंध: ',
    disability_status_label: 'विकलांगता स्थिति: ',
    health_parameters_label: 'स्वास्थ्य पैरामीटर: ',
    health_records_label: 'स्वास्थ्य रिकॉर्ड',
    blood_pressure_label: 'रक्तचाप: ',
    heart_rate_label: 'हृदय गति: ',
    blood_sugar_label: 'रक्त शर्करा: ',
    medical_history_label: 'चिकित्सा इतिहास: ',
    last_checkup_label: 'अंतिम जांच: ',
    edit_profile: 'प्रोफाइल संपादित करें',
    fetch_profile_error: 'प्रोफाइल डेटा प्राप्त करने में विफल',
    loading_profile: 'प्रोफाइल लोड हो रहा है...',
    none: 'कोई नहीं',
    
    // Validation
    password_mismatch: 'पासवर्ड मेल नहीं खाते',
    invalid_phone: 'अमान्य फोन नंबर प्रारूप',
    invalid_emergency_phone: 'अमान्य आपातकालीन संपर्क नंबर प्रारूप',
    invalid_age: 'कृपया वैध आयु दर्ज करें (1-150)',
    sending: 'भेजा जा रहा है...',
  },
  Punjabi: {
    // Core App
    app_name: 'ਮੈਡਕਿੱਟ',
    medkit: 'ਮੈਡਕਿੱਟ',
    
    // Language Selection
    choose_language: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    select_preferred_language: 'ਆਪਣੀ ਚਾਹੀਦੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    welcome_message: 'ਮੈਡਕਿੱਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ! ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਆਪਣੀ ਚਾਹੀਦੀ ਭਾਸ਼ਾ ਚੁਣੋ।',
    language_selected: 'ਭਾਸ਼ਾ ਬਦਲ ਦਿੱਤੀ ਗਈ',
    continue: 'ਜਾਰੀ ਰੱਖੋ',
    play_welcome: 'ਸਵਾਗਤ ਸੰਦੇਸ਼ ਚਲਾਓ',
    
    // TTS
    tts_toggle: 'ਆਵਾਜ਼ ਸਹਾਇਤਾ',
    tts_enabled: 'ਆਵਾਜ਼ ਸਹਾਇਤਾ ਸਮਰਥਿਤ',
    tts_disabled: 'ਆਵਾਜ਼ ਸਹਾਇਤਾ ਅਸਮਰਥਿਤ',
    
    // Signup Screen
    create_account: 'ਖਾਤਾ ਬਣਾਓ',
    join_medkit: 'ਮੈਡਕਿੱਟ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ ਤਾਂ ਜੋ ਤੁਸੀਂ ਆਪਣੀਆਂ ਸਿਹਤ ਮੁਲਾਕਾਤਾਂ ਨੂੰ ਆਸਾਨੀ ਨਾਲ ਪ੍ਰਬੰਧਿਤ ਕਰ ਸਕੋ',
    full_name_placeholder: 'ਪੂਰਾ ਨਾਮ',
    contact_placeholder: 'ਫੋਨ ਨੰਬਰ',
    age_placeholder: 'ਉਮਰ',
    select_gender: 'ਲਿੰਗ ਚੁਣੋ',
    male: 'ਮਰਦ',
    female: 'ਔਰਤ',
    other: 'ਹੋਰ',
    select_language: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    address_placeholder: 'ਪਤਾ',
    emergency_contact_placeholder: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ',
    emergency_relation_placeholder: 'ਐਮਰਜੈਂਸੀ ਸਬੰਧ',
    disability_status_placeholder: 'ਅਪੰਗਤਾ ਸਥਿਤੀ (ਵਿਕਲਪਿਕ)',
    health_parameters_placeholder: 'ਸਿਹਤ ਪੈਰਾਮੀਟਰ (ਵਿਕਲਪਿਕ)',
    password_placeholder: 'ਪਾਸਵਰਡ',
    confirm_password_placeholder: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    get_otp: 'ਓਟੀਪੀ ਪ੍ਰਾਪਤ ਕਰੋ',
    already_have_account: 'ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ',
    sign_in_link: 'ਸਾਈਨ ਇਨ ਕਰੋ',
    name_placeholder: 'ਪੂਰਾ ਨਾਮ',
    phone_placeholder: 'ਫੋਨ ਨੰਬਰ',
    enter_field: 'ਕਿਰਪਾ ਕਰਕੇ ਦਰਜ ਕਰੋ',
    
    // Sign In Screen
    sign_in_to_continue: 'ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
    sign_in: 'ਸਾਈਨ ਇਨ',
    no_account: 'ਕੋਈ ਖਾਤਾ ਨਹੀਂ? ',
    sign_up_link: 'ਸਾਈਨ ਅੱਪ ਕਰੋ',
    signin_error: 'ਕਿਰਪਾ ਕਰਕੇ ਨਾਮ ਅਤੇ ਫੋਨ ਨੰਬਰ ਦੋਵੇਂ ਦਰਜ ਕਰੋ',
    signin_success: 'ਸਾਈਨ ਇਨ ਸਫਲ',
    network_error: 'ਨੈਟਵਰਕ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ',
    
    // OTP Screen
    verify_otp: 'ਓਟੀਪੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    enter_otp: 'ਆਪਣੇ ਫੋਨ ਤੇ ਭੇਜਿਆ ਗਿਆ ਓਟੀਪੀ ਦਰਜ ਕਰੋ',
    enter_otp_placeholder: '6-ਅੰਕੀ ਓਟੀਪੀ ਦਰਜ ਕਰੋ',
    verify_otp_button: 'ਓਟੀਪੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    resend_otp: 'ਓਟੀਪੀ ਮੁੜ ਭੇਜੋ',
    phone_label: 'ਫੋਨ: ',
    enter_valid_otp: 'ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ 6-ਅੰਕੀ ਓਟੀਪੀ ਦਰਜ ਕਰੋ',
    invalid_otp: 'ਅਵੈਧ ਜਾਂ ਸਮਾਪਤ ਓਟੀਪੀ',
    otp_resent: 'ਓਟੀਪੀ ਸਫਲਤਾਪੂਰਵਕ ਮੁੜ ਭੇਜਿਆ ਗਿਆ',
    otp_sent: 'ਤੁਹਾਡੇ ਫੋਨ ਤੇ ਓਟੀਪੀ ਭੇਜ ਦਿੱਤਾ ਗਿਆ',
    signup_success: 'ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾ ਦਿੱਤਾ ਗਿਆ',
    signup_failed: 'ਸਾਈਨਅੱਪ ਅਸਫਲ',
    otp_store_failed: 'ਓਟੀਪੀ ਸਟੋਰ ਕਰਨ ਵਿੱਚ ਅਸਫਲ',
    otp_send_failed: 'ਓਟੀਪੀ ਭੇਜਣ ਵਿੱਚ ਅਸਫਲ',
    sms_unavailable: 'ਇਸ ਡਿਵਾਈਸ ਤੇ SMS ਉਪਲਬਧ ਨਹੀਂ ਹੈ',
    success: 'ਸਫਲ',
    error: 'ਗਲਤੀ',
    
    // Profile Screen
    profile_title: 'ਪ੍ਰੋਫਾਈਲ',
    profile_subtitle: 'ਆਪਣੀ ਨਿੱਜੀ ਅਤੇ ਸਿਹਤ ਜਾਣਕਾਰੀ ਵੇਖੋ',
    name_label: 'ਨਾਮ: ',
    age_label: 'ਉਮਰ: ',
    gender_label: 'ਲਿੰਗ: ',
    language_label: 'ਭਾਸ਼ਾ: ',
    address_label: 'ਪਤਾ: ',
    emergency_contact_label: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ: ',
    emergency_relation_label: 'ਐਮਰਜੈਂਸੀ ਸਬੰਧ: ',
    disability_status_label: 'ਅਪੰਗਤਾ ਸਥਿਤੀ: ',
    health_parameters_label: 'ਸਿਹਤ ਪੈਰਾਮੀਟਰ: ',
    health_records_label: 'ਸਿਹਤ ਰਿਕਾਰਡ',
    blood_pressure_label: 'ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ: ',
    heart_rate_label: 'ਦਿਲ ਦੀ ਗਤੀ: ',
    blood_sugar_label: 'ਬਲੱਡ ਸ਼ੂਗਰ: ',
    medical_history_label: 'ਮੈਡੀਕਲ ਇਤਿਹਾਸ: ',
    last_checkup_label: 'ਆਖਰੀ ਜਾਂਚ: ',
    edit_profile: 'ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ',
    fetch_profile_error: 'ਪ੍ਰੋਫਾਈਲ ਡੇਟਾ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ',
    loading_profile: 'ਪ੍ਰੋਫਾਈਲ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    none: 'ਕੋਈ ਨਹੀਂ',
    
    // Validation
    password_mismatch: 'ਪਾਸਵਰਡ ਮੇਲ ਨਹੀਂ ਖਾਂਦੇ',
    invalid_phone: 'ਅਵੈਧ ਫੋਨ ਨੰਬਰ ਫਾਰਮੈਟ',
    invalid_emergency_phone: 'ਅਵੈਧ ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਨੰਬਰ ਫਾਰਮੈਟ',
    invalid_age: 'ਕਿਰਪਾ ਕਰਕੇ ਵੈਧ ਉਮਰ ਦਰਜ ਕਰੋ (1-150)',
    sending: 'ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage && translations[savedLanguage]) {
          setLanguage(savedLanguage);
        }
        const savedTtsEnabled = await AsyncStorage.getItem('ttsEnabled');
        if (savedTtsEnabled !== null) {
          setTtsEnabled(savedTtsEnabled === 'true');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const changeLanguage = async (newLanguage) => {
    try {
      if (translations[newLanguage]) {
        setLanguage(newLanguage);
        await AsyncStorage.setItem('language', newLanguage);
        console.log('Language changed to:', newLanguage);
      } else {
        console.warn('Language not supported:', newLanguage);
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const toggleTtsEnabled = async () => {
    try {
      const newTtsEnabled = !ttsEnabled;
      setTtsEnabled(newTtsEnabled);
      await AsyncStorage.setItem('ttsEnabled', newTtsEnabled.toString());
      console.log('TTS toggled to:', newTtsEnabled);
    } catch (error) {
      console.error('Error saving TTS setting:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ 
      translations, 
      language, 
      changeLanguage, 
      ttsEnabled, 
      setTtsEnabled: toggleTtsEnabled 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);