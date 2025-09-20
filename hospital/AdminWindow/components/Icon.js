// Icon.js
import React from 'react';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';
import { getResponsiveFontSize } from '../../../utils/responsive';


const Icon = ({ 
  name, 
  type = 'ionicons', 
  size = 24, 
  color = colors.text, 
  style 
}) => {
  const iconSize = getResponsiveFontSize(size);

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

// Predefined icons
export const Icons = {
  // Navigation
  home: (props) => <Icon name="home" {...props} />,
  emergency: (props) => <Icon name="medkit" {...props} />,
  doctors: (props) => <Icon name="people" {...props} />,
  appointments: (props) => <Icon name="calendar" {...props} />,
  settings: (props) => <Icon name="settings" {...props} />,

  // Emergency severity
  high: (props) => <Icon name="alert-circle" color={colors.emergencyHigh} {...props} />,
  medium: (props) => <Icon name="warning" color={colors.emergencyMedium} {...props} />,
  low: (props) => <Icon name="checkmark-circle" color={colors.emergencyLow} {...props} />,

  // Doctor status
  available: (props) => <Icon name="checkmark-circle" color={colors.available} {...props} />,
  busy: (props) => <Icon name="close-circle" color={colors.busy} {...props} />,
  unavailable: (props) => <Icon name="pause-circle" color={colors.unavailable} {...props} />,

  // Medical
  stethoscope: (props) => <Icon name="medkit" {...props} />,
  heart: (props) => <Icon name="heart" {...props} />,
  pill: (props) => <Icon name="medkit" {...props} />,
  hospital: (props) => <Icon name="business" {...props} />,
  person: (props) => <Icon name="person" {...props} />,

  // Actions
  add: (props) => <Icon name="add" {...props} />,
  close: (props) => <Icon name="close" {...props} />,
  checkmark: (props) => <Icon name="checkmark" {...props} />,
  arrowBack: (props) => <Icon name="arrow-back" {...props} />,
  arrowForward: (props) => <Icon name="arrow-forward" {...props} />,

  // Communication
  call: (props) => <Icon name="call" {...props} />,
  videocam: (props) => <Icon name="videocam" {...props} />,
  chatbubble: (props) => <Icon name="chatbubble" {...props} />,
  mail: (props) => <Icon name="mail" {...props} />,
  search: (props) => <Icon name="search" {...props} />,
  searchOutline: (props) => <Icon name="search-outline" {...props} />,

  // Time
  time: (props) => <Icon name="time" {...props} />,
  calendar: (props) => <Icon name="calendar" {...props} />,
  clock: (props) => <Icon name="time-outline" {...props} />,

  // Status
  success: (props) => <Icon name="checkmark-circle" color={colors.success} {...props} />,
  error: (props) => <Icon name="close-circle" color={colors.red} {...props} />,
  warning: (props) => <Icon name="warning" color={colors.warning} {...props} />,
  info: (props) => <Icon name="information-circle" color={colors.primary} {...props} />,
};
