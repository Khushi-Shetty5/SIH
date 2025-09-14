import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LanguageContext } from '../../utils/LanguageContext';
import translations from '../../constants/strings';

const DoctorCard = ({ order, onPress }) => {
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  const statusColor = order.status === 'pending' ? '#FFC107' : '#4CAF50';
  const channelIcon = order.channel === 'SMS' ? 'sms' : order.channel === 'Bluetooth' ? 'bluetooth' : 'app';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} accessibilityLabel={t.orderCard}>
      <View style={styles.icon}>
        <Icon name="person" size={30} color="#333" />
      </View>
      <View style={styles.info}>
        <Text style={styles.patient}>{order.patient || t.anonymous}</Text>
        <View style={styles.channelContainer}>
          <Icon name={channelIcon} size={20} color="#666" />
          <Text style={styles.channel}>{order.channel}</Text>
        </View>
      </View>
      <View style={[styles.status, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{order.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 15,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  patient: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  status: {
    padding: 5,
    borderRadius: 5,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DoctorCard;