import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getResponsiveValue } from '../../../utils/responsive';
import { getPatientById } from '../services/patientService';
import { Icons } from '../components/Icon';
import { Ionicons } from '@expo/vector-icons';
import logger from '../../../utils/logger';

const VideoConsultationScreen = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  const { patientId, patientName } = route.params || {};
  const [patient, setPatient] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  useEffect(() => {
    logger.info('SCREEN', 'VideoConsultationScreen mounted', { 
      screenWidth: width, 
      isTablet, 
      isSmallScreen,
      patientId,
      patientName
    });
    loadPatientData();
    
    return () => {
      logger.debug('SCREEN', 'VideoConsultationScreen unmounted');
    };
  }, []);

  useEffect(() => {
    if (isCallActive) {
      logger.info('SCREEN', 'Video call started', { 
        patientId, 
        patientName: patient?.name 
      });
      startCallTimer();
    } else {
      logger.info('SCREEN', 'Video call ended', { 
        patientId, 
        patientName: patient?.name,
        callDuration
      });
    }
  }, [isCallActive]);

  const loadPatientData = () => {
    logger.debug('SCREEN', 'Loading patient data for video consultation', { patientId });
    
    try {
      if (patientId) {
        const patientData = getPatientById(patientId);
        if (patientData) {
          setPatient(patientData);
          logger.info('SCREEN', 'Patient data loaded successfully', { 
            patientId, 
            patientName: patientData.name 
          });
        } else {
          logger.warn('SCREEN', 'Patient not found, using demo data', { patientId });
          setPatient({
            id: '1',
            name: patientName || 'John Smith',
            age: 45,
            gender: 'Male',
            phone: '+1-555-0123'
          });
        }
      } else {
        // Demo patient data
        logger.info('SCREEN', 'Using demo patient data for video consultation');
        setPatient({
          id: '1',
          name: patientName || 'John Smith',
          age: 45,
          gender: 'Male',
          phone: '+1-555-0123'
        });
      }
    } catch (error) {
      logger.error('SCREEN', 'Failed to load patient data', { error: error.message });
    }
  };

  const startCallTimer = () => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    logger.userAction('Start video call pressed', 'VideoConsultation', { 
      patientId, 
      patientName: patient?.name 
    });
    
    Alert.alert(
      'Start Video Call',
      'This would start a video consultation with the patient. The doctor was notified regarding the call. He will be joining soon',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => {
            logger.userAction('Video call cancelled', 'VideoConsultation', { patientId });
          }
        },
        { 
          text: 'Start Call', 
          onPress: () => {
            logger.info('SCREEN', 'Starting video call', { 
              patientId, 
              patientName: patient?.name 
            });
            setIsCallActive(true);
            Alert.alert('Call Started', 'Video consultation is now active');
          }
        }
      ]
    );
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the video consultation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          onPress: () => {
            setIsCallActive(false);
            setCallDuration(0);
            Alert.alert('Call Ended', 'Video consultation has been terminated');
          }
        }
      ]
    );
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    Alert.alert('Microphone', isMuted ? 'Unmuted' : 'Muted');
  };

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn);
    Alert.alert('Camera', isVideoOn ? 'Camera Off' : 'Camera On');
  };

  const handleScheduleFollowUp = () => {
    navigation.navigate('ScheduleConsultation', { 
      patientId: patient?.id,
      patientName: patient?.name 
    });
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video Consultation</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{patient?.name || 'Patient'}</Text>
          <Text style={styles.patientDetails}>
            {patient?.gender} • {patient?.age} years old
          </Text>
          <Text style={styles.patientPhone}>{patient?.phone}</Text>
        </View>

        {/* Video Area */}
        <View style={styles.videoContainer}>
          {isCallActive ? (
            <View style={styles.videoActive}>
        <View style={styles.videoPlaceholder}>
          <Ionicons name="videocam" size={getResponsiveValue(60, 80, 100)} color={colors.textWhite} />
          <Text style={[styles.videoPlaceholderLabel, { fontSize: getResponsiveValue(16, 18, 20) }]}>
            {isVideoOn ? 'Video Call Active' : 'Video Disabled'}
          </Text>
          <Text style={[styles.callDuration, { fontSize: getResponsiveValue(20, 24, 28) }]}>
            {formatDuration(callDuration)}
          </Text>
        </View>
              
              {/* Patient Video (Small) */}
              <View style={styles.patientVideo}>
                <Ionicons name="person" size={getResponsiveValue(32, 40, 48)} color={colors.textPrimary} />
              </View>
            </View>
          ) : (
            <View style={styles.videoInactive}>
              <Ionicons name="videocam" size={getResponsiveValue(60, 80, 100)} color={colors.textWhite} />
              <Text style={[styles.videoInactiveTitle, { fontSize: getResponsiveValue(20, 24, 28) }]}>
                Video Consultation
              </Text>
              <Text style={[styles.videoInactiveText, { fontSize: getResponsiveValue(14, 16, 18) }]}>
                Start a video call with the patient for remote consultation
              </Text>
            </View>
          )}
        </View>

        {/* Call Controls */}
        <View style={styles.controlsContainer}>
          {isCallActive ? (
            <View style={styles.activeControls}>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: isMuted ? colors.error : colors.textLight }]}
                onPress={handleMuteToggle}
              >
                <Ionicons name={isMuted ? "mic-off" : "mic"} size={getResponsiveValue(20, 24, 28)} color={colors.textWhite} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: colors.error }]}
                onPress={handleEndCall}
              >
                <Ionicons name="call" size={getResponsiveValue(20, 24, 28)} color={colors.textWhite} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: isVideoOn ? colors.textLight : colors.error }]}
                onPress={handleVideoToggle}
              >
                <Ionicons name={isVideoOn ? "videocam" : "videocam-off"} size={getResponsiveValue(20, 24, 28)} color={colors.textWhite} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.inactiveControls}>
              <TouchableOpacity
                style={[commonStyles.primaryButton, styles.startCallButton]}
                onPress={handleStartCall}
              >
                <Ionicons name="videocam" size={getResponsiveValue(16, 20, 24)} color={colors.textWhite} />
                <Text style={[commonStyles.primaryButtonText, { marginLeft: getResponsiveValue(6, 8, 10) }]}>
                  Start Video Call
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Additional Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[commonStyles.secondaryButton, styles.actionButton]}
            onPress={handleScheduleFollowUp}
          >
            <Ionicons name="calendar" size={getResponsiveValue(16, 20, 24)} color={colors.primary} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: getResponsiveValue(6, 8, 10) }]}>
              Schedule Follow-up
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[commonStyles.secondaryButton, styles.actionButton]}
            onPress={() => Alert.alert('Chat', 'Chat functionality would open here')}
          >
            <Ionicons name="chatbubble" size={getResponsiveValue(16, 20, 24)} color={colors.primary} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: getResponsiveValue(6, 8, 10) }]}>
              Send Message
            </Text>
          </TouchableOpacity>
        </View>

        {/* Call Status */}
        {isCallActive && (
          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle" size={getResponsiveValue(16, 20, 24)} color={colors.textWhite} />
            <Text style={[styles.statusText, { marginLeft: getResponsiveValue(6, 8, 10) }]}>
              Call Active • {formatDuration(callDuration)}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 60,
  },
  patientInfo: {
    backgroundColor: colors.surface,
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patientName: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  patientPhone: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoActive: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.textPrimary,
  },
  videoPlaceholderText: {
    fontSize: 80,
    marginBottom: 16,
  },
  videoPlaceholderLabel: {
    fontSize: typography.h5,
    color: colors.textWhite,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  callDuration: {
    fontSize: typography.h5,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  patientVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 90,
    backgroundColor: colors.surface,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  patientVideoText: {
    fontSize: 40,
  },
  videoInactive: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  videoInactiveIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  videoInactiveTitle: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 12,
  },
  videoInactiveText: {
    fontSize: typography.body,
    color: colors.textWhite,
    textAlign: 'center',
    lineHeight: typography.lineHeight.body,
    opacity: 0.8,
  },
  controlsContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: getResponsiveValue(50, 60, 70),
    height: getResponsiveValue(50, 60, 70),
    borderRadius: getResponsiveValue(25, 30, 35),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: getResponsiveValue(10, 15, 20),
  },
  inactiveControls: {
    alignItems: 'center',
  },
  startCallButton: {
    paddingHorizontal: getResponsiveValue(32, 40, 48),
    paddingVertical: getResponsiveValue(12, 16, 20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    marginVertical: getResponsiveValue(4, 6, 8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    backgroundColor: colors.success,
    paddingVertical: getResponsiveValue(6, 8, 10),
    paddingHorizontal: getResponsiveValue(12, 16, 20),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: typography.body,
    color: colors.textWhite,
    fontWeight: '600',
  },
});

export default VideoConsultationScreen;
