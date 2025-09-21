import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';

const ScheduleCard = ({ slot, isSelected, onPress, isAvailable = true }) => {
  const formatTime = (time) => {
    if (!time || !time.includes(':')) return time; // return as-is if not valid HH:mm

    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSlotStatus = () => {
    if (!isAvailable) return 'unavailable';
    if (isSelected) return 'selected';
    return 'available';
  };

  const getSlotStyle = () => {
    const status = getSlotStatus();
    switch (status) {
      case 'selected':
        return [styles.card, styles.selectedCard];
      case 'unavailable':
        return [styles.card, styles.unavailableCard];
      default:
        return [styles.card, styles.availableCard];
    }
  };

  const getSlotTextStyle = () => {
    const status = getSlotStatus();
    switch (status) {
      case 'selected':
        return [styles.timeText, styles.selectedText];
      case 'unavailable':
        return [styles.timeText, styles.unavailableText];
      default:
        return [styles.timeText, styles.availableText];
    }
  };

  return (
    <TouchableOpacity
      style={getSlotStyle()}
      onPress={onPress}
      disabled={!isAvailable}
    >
      {/* Time or Day */}
      {slot.time && (
        <Text style={getSlotTextStyle()}>
          {formatTime(slot.time)}
        </Text>
      )}

      {/* Optional Day (if provided separately) */}
      {slot.day && (
        <Text style={[styles.dateText, isSelected ? styles.selectedDateText : styles.availableDateText]}>
          {slot.day}
        </Text>
      )}

      {/* Date */}
      {slot.date && (
        <Text style={[styles.dateText, isSelected ? styles.selectedDateText : styles.availableDateText]}>
          {slot.date}
        </Text>
      )}

      {!isAvailable && (
        <Text style={styles.unavailableLabel}>Unavailable</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    borderWidth: 1,
  },
  availableCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  selectedCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unavailableCard: {
    backgroundColor: colors.divider,
    borderColor: colors.border,
    opacity: 0.5,
  },
  timeText: {
    fontSize: typography.body,
    fontWeight: '600',
  },
  availableText: {
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.textWhite,
  },
  unavailableText: {
    color: colors.textLight,
  },
  dateText: {
    fontSize: typography.caption,
    marginTop: 2,
  },
  availableDateText: {
    color: colors.textSecondary,
  },
  selectedDateText: {
    color: colors.textWhite,
  },
  unavailableLabel: {
    fontSize: typography.caption,
    color: colors.textLight,
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default ScheduleCard;
