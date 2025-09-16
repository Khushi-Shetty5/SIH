import React, { createContext, useContext, useState } from 'react';

const translations = {
  English: {
    // LanguageSelectionScreen
    choose_language: 'Choose Language',
    select_preferred_language: 'Select your preferred language',
    continue: 'Continue',
    welcome_message: 'Welcome to MedKit. Please select your preferred language to continue.',
    tts_toggle: 'Text-to-Speech',

    // SignInScreen
    medkit: 'MedKit',
    sign_in_to_continue: 'Sign in to continue',
    name_placeholder: 'Name',
    phone_placeholder: 'Phone Number',
    sign_in: 'Sign In',
    no_account: "Don't have an account? ",
    sign_up_link: 'Sign up',

    // SignupScreen
    create_account: 'Create Account',
    join_medkit: 'Join MedKit today',
    full_name_placeholder: 'Full Name',
    age_placeholder: 'Age',
    select_gender: 'Select Gender',
    select_language: 'Select Language',
    contact_placeholder: 'Contact Number',
    address_placeholder: 'Address',
    health_records_placeholder: 'Health Records (Optional)',
    current_medications_placeholder: 'Current Medications (Optional)',
    emergency_contact_placeholder: 'Emergency Contact Number',
    emergency_relation_placeholder: 'Emergency Contact Relation',
    disability_status_placeholder: 'Disability Status (Optional)',
    health_parameters_placeholder: 'Health Parameters (Optional)',
    password_placeholder: 'Password',
    confirm_password_placeholder: 'Confirm Password',
    consent_text: 'I consent to store my health data',
    get_otp: 'Get OTP',
    already_have_account: 'Already have an account? ',
    sign_in_link: 'Sign in',

    // OTPScreen
    verify_otp: 'Verify OTP',
    enter_otp: 'Enter the 6-digit code sent to your phone',
    phone_label: 'Phone: ',
    enter_otp_placeholder: 'Enter OTP',
    verify_otp_button: 'Verify OTP',
    resend_otp: 'Resend OTP',
    invalid_otp: 'Invalid OTP. Please try again.',
    enter_valid_otp: 'Please enter a valid 6-digit OTP',
  },
  Hindi: {
    // LanguageSelectionScreen
    choose_language: 'भाषा चुनें',
    select_preferred_language: 'अपनी पसंदीदा भाषा चुनें',
    continue: 'जारी रखें',
    welcome_message: 'मेडकिट में आपका स्वागत है। कृपया अपनी पसंदीदा भाषा चुनें।',
    tts_toggle: 'टेक्स्ट-टू-स्पीच',

    // SignInScreen
    medkit: 'मेडकिट',
    sign_in_to_continue: 'जारी रखने के लिए साइन इन करें',
    name_placeholder: 'नाम',
    phone_placeholder: 'फोन नंबर',
    sign_in: 'साइन इन',
    no_account: 'कोई खाता नहीं है? ',
    sign_up_link: 'साइन अप करें',

    // SignupScreen
    create_account: 'खाता बनाएं',
    join_medkit: 'आज ही मेडकिट से जुड़ें',
    full_name_placeholder: 'पूरा नाम',
    age_placeholder: 'आयु',
    select_gender: 'लिंग चुनें',
    select_language: 'भाषा चुनें',
    contact_placeholder: 'संपर्क नंबर',
    address_placeholder: 'पता',
    health_records_placeholder: 'स्वास्थ्य रिकॉर्ड (वैकल्पिक)',
    current_medications_placeholder: 'वर्तमान दवाएं (वैकल्पिक)',
    emergency_contact_placeholder: 'आपातकालीन संपर्क नंबर',
    emergency_relation_placeholder: 'आपातकालीन संपर्क संबंध',
    disability_status_placeholder: 'विकलांगता स्थिति (वैकल्पिक)',
    health_parameters_placeholder: 'स्वास्थ्य पैरामीटर (वैकल्पिक)',
    password_placeholder: 'पासवर्ड',
    confirm_password_placeholder: 'पासवर्ड की पुष्टि करें',
    consent_text: 'मैं अपने स्वास्थ्य डेटा को संग्रहीत करने की सहमति देता हूँ',
    get_otp: 'ओटीपी प्राप्त करें',
    already_have_account: 'पहले से ही खाता है? ',
    sign_in_link: 'साइन इन करें',

    // OTPScreen
    verify_otp: 'ओटीपी सत्यापित करें',
    enter_otp: 'अपने फोन पर भेजा गया 6-अंकीय कोड दर्ज करें',
    phone_label: 'फोन: ',
    enter_otp_placeholder: 'ओटीपी दर्ज करें',
    verify_otp_button: 'ओटीपी सत्यापित करें',
    resend_otp: 'ओटीपी पुनः भेजें',
    invalid_otp: 'अमान्य ओटीपी। कृपया पुनः प्रयास करें।',
    enter_valid_otp: 'कृपया एक वैध 6-अंकीय ओटीपी दर्ज करें',
  },
  Punjabi: {
    // LanguageSelectionScreen
    choose_language: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    select_preferred_language: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ',
    continue: 'ਜਾਰੀ ਰੱਖੋ',
    welcome_message: 'ਮੈਡਕਿੱਟ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਅੱਗੇ ਵਧਣ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ।',
    tts_toggle: 'ਟੈਕਸਟ-ਟੂ-ਸਪੀਚ',

    // SignInScreen
    medkit: 'ਮੈਡਕਿੱਟ',
    sign_in_to_continue: 'ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
    name_placeholder: 'ਨਾਮ',
    phone_placeholder: 'ਫੋਨ ਨੰਬਰ',
    sign_in: 'ਸਾਈਨ ਇਨ',
    no_account: 'ਕੋਈ ਖਾਤਾ ਨਹੀਂ ਹੈ? ',
    sign_up_link: 'ਸਾਈਨ ਅਪ ਕਰੋ',

    // SignupScreen
    create_account: 'ਖਾਤਾ ਬਣਾਓ',
    join_medkit: 'ਅੱਜ ਹੀ ਮੈਡਕਿੱਟ ਨਾਲ ਜੁੜੋ',
    full_name_placeholder: 'ਪੂਰਾ ਨਾਮ',
    age_placeholder: 'ਉਮਰ',
    select_gender: 'ਲਿੰਗ ਚੁਣੋ',
    select_language: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    contact_placeholder: 'ਸੰਪਰਕ ਨੰਬਰ',
    address_placeholder: 'ਪਤਾ',
    health_records_placeholder: 'ਸਿਹਤ ਰਿਕਾਰਡ (ਵਿਕਲਪਿਕ)',
    current_medications_placeholder: 'ਮੌਜੂਦਾ ਦਵਾਈਆਂ (ਵਿਕਲਪਿਕ)',
    emergency_contact_placeholder: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਨੰਬਰ',
    emergency_relation_placeholder: 'ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਸਬੰਧ',
    disability_status_placeholder: 'ਅਪੰਗਤਾ ਸਥਿਤੀ (ਵਿਕਲਪਿਕ)',
    health_parameters_placeholder: 'ਸਿਹਤ ਪੈਰਾਮੀਟਰ (ਵਿਕਲਪਿਕ)',
    password_placeholder: 'ਪਾਸਵਰਡ',
    confirm_password_placeholder: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    consent_text: 'ਮੈਂ ਆਪਣੇ ਸਿਹਤ ਡੇਟਾ ਨੂੰ ਸਟੋਰ ਕਰਨ ਲਈ ਸਹਿਮਤੀ ਦਿੰਦਾ ਹਾਂ',
    get_otp: 'ਓਟੀਪੀ ਪ੍ਰਾਪਤ ਕਰੋ',
    already_have_account: 'ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ',
    sign_in_link: 'ਸਾਈਨ ਇਨ ਕਰੋ',

    // OTPScreen
    verify_otp: 'ਓਟੀਪੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    enter_otp: 'ਆਪਣੇ ਫੋਨ \'ਤੇ ਭੇਜਿਆ ਗਿਆ 6-ਅੰਕੀ ਕੋਡ ਦਰਜ ਕਰੋ',
    phone_label: 'ਫੋਨ: ',
    enter_otp_placeholder: 'ਓਟੀਪੀ ਦਰਜ ਕਰੋ',
    verify_otp_button: 'ਓਟੀਪੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    resend_otp: 'ਓਟੀਪੀ ਮੁੜ ਭੇਜੋ',
    invalid_otp: 'ਅਵੈਧ ਓਟੀਪੀ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
    enter_valid_otp: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 6-ਅੰਕੀ ਓਟੀਪੀ ਦਰਜ ਕਰੋ',
  },
};

// Language Context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');
  const [ttsEnabled, setTtsEnabled] = useState(false); // TTS toggle state

  return (
    <LanguageContext.Provider value={{ language, setLanguage, ttsEnabled, setTtsEnabled, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);