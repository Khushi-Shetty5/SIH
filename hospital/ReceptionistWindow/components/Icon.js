import React from 'react';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { getResponsiveFontSize } from '../../../utils/responsive';

const Icon = ({ 
  name, 
  type = 'ionicons', 
  size = 24, 
  color = colors.textPrimary, 
  style 
}) => {
  const iconSize = getResponsiveFontSize(size);
  
  const getIconComponent = () => {
    switch (type) {
      case 'material':
        return <MaterialIcons name={name} size={iconSize} color={color} style={style} />;
      case 'material-community':
        return <MaterialCommunityIcons name={name} size={iconSize} color={color} style={style} />;
      case 'ionicons':
      default:
        return <Ionicons name={name} size={iconSize} color={color} style={style} />;
    }
  };

  return getIconComponent();
};

// Predefined icon sets for common use cases
// Predefined icon sets for common use cases
export const Icons = {
  // Navigation
  home: (props) => <Icon name="home" type="ionicons" {...props} />,
  emergency: (props) => <Icon name="medkit" type="ionicons" {...props} />, 
  doctors: (props) => <Icon name="people" type="ionicons" {...props} />,
  appointments: (props) => <Icon name="calendar" type="ionicons" {...props} />,
  settings: (props) => <Icon name="settings" type="ionicons" {...props} />,
  
  // Emergency severity
  high: (props) => <Icon name="alert-circle" type="ionicons" color={colors.emergencyHigh} {...props} />,
  medium: (props) => <Icon name="warning" type="ionicons" color={colors.emergencyMedium} {...props} />,
  low: (props) => <Icon name="checkmark-circle" type="ionicons" color={colors.emergencyLow} {...props} />,
  
  // Doctor status
  available: (props) => <Icon name="checkmark-circle" type="ionicons" color={colors.available} {...props} />,
  busy: (props) => <Icon name="close-circle" type="ionicons" color={colors.busy} {...props} />,
  unavailable: (props) => <Icon name="pause-circle" type="ionicons" color={colors.unavailable} {...props} />,
  
  // Medical
  stethoscope: (props) => <Icon name="medkit" type="ionicons" {...props} />,   
  heart: (props) => <Icon name="heart" type="ionicons" {...props} />,
  pill: (props) => <Icon name="medkit" type="ionicons" {...props} />,        
  hospital: (props) => <Icon name="business" type="ionicons" {...props} />,    
  person: (props) => <Icon name="person" type="ionicons" {...props} />,
  
  // Actions
  add: (props) => <Icon name="add" type="ionicons" {...props} />,
  close: (props) => <Icon name="close" type="ionicons" {...props} />,
  checkmark: (props) => <Icon name="checkmark" type="ionicons" {...props} />,
  arrowBack: (props) => <Icon name="arrow-back" type="ionicons" {...props} />,
  arrowForward: (props) => <Icon name="arrow-forward" type="ionicons" {...props} />,
  
  // Communication
  call: (props) => <Icon name="call" type="ionicons" {...props} />,
  videocam: (props) => <Icon name="videocam" type="ionicons" {...props} />,
  chat: (props) => <Icon name="chatbubble" type="ionicons" {...props} />,
  mail: (props) => <Icon name="mail" type="ionicons" {...props} />,
  
  // Time
  time: (props) => <Icon name="time" type="ionicons" {...props} />,
  calendar: (props) => <Icon name="calendar" type="ionicons" {...props} />,
  clock: (props) => <Icon name="time-outline" type="ionicons" {...props} />,  
  
  // Status
  success: (props) => <Icon name="checkmark-circle" type="ionicons" color={colors.success} {...props} />,
  error: (props) => <Icon name="close-circle" type="ionicons" color={colors.error} {...props} />,
  warning: (props) => <Icon name="warning" type="ionicons" color={colors.warning} {...props} />,
  info: (props) => <Icon name="information-circle" type="ionicons" color={colors.info} {...props} />,
};
