import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../styles/colors';

const DashboardTile = ({ title, iconName, screenName }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => navigation.navigate(screenName)}
      accessibilityLabel={title}
    >
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={40} color="#fff" />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DashboardTile;