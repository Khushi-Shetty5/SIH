// components/AdminCard.js
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';

const AdminCard = ({ title, value, color, icon, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        {
          width: '48%',
          marginBottom: 16,
          borderLeftWidth: 4,
          borderLeftColor: color,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: typography.caption, color: colors.textSecondary }}>
            {title}
          </Text>
          <Text style={{ fontSize: typography.h4, fontWeight: 'bold', color }}>
            {value}
          </Text>
        </View>
        <View style={{ fontSize: 24 }}>{icon}</View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default AdminCard;