import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { Icons } from './Icon';

const AdminFormField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  icon,
  ...props
}) => {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={{ position: 'relative' }}>
        <TextInput
          style={[
            styles.input,
            error && { borderColor: colors.error },
            icon && { paddingLeft: 40 },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          {...props}
        />

        {icon && Icons[icon] && (
          <View style={{ position: 'absolute', left: 12, top: 12 }}>
            {Icons[icon]({
              size: 20,
              color: colors.textLight,
            })}
          </View>
        )}
      </View>

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  error: {
    color: colors.error,
    fontSize: typography.caption,
    marginTop: 4,
  },
});

export default AdminFormField;
