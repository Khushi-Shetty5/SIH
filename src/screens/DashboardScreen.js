import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import FloatingChatButton from '../components/FloatingChatButton';
import { strings } from '../constants/strings';

export default function DashboardScreen({ navigation }) {
  const dashboardCards = [
    {
      id: 1,
      title: strings.checkDoctorAvailability,
      icon: 'calendar-check',
      color: '#4A90E2',
      screen: 'DoctorAvailability'
    },
    {
      id: 2,
      title: strings.bookAppointment,
      icon: 'plus-circle',
      color: '#4CAF50',
      screen: 'Appointment'
    },
    {
      id: 3,
      title: strings.searchMedicine,
      icon: 'magnify',
      color: '#FF9800',
      screen: 'MedicineSearch'
    },
    {
      id: 4,
      title: strings.videoConference,
      icon: 'video',
      color: '#9C27B0',
      screen: 'VideoConsultation'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      title: strings.generalCheckup,
      date: 'Aug 12',
      icon: 'medical-bag',
      color: '#4A90E2'
    },
    {
      id: 2,
      title: strings.cardiologistCheckup,
      date: 'Aug 15',
      icon: 'heart',
      color: '#F44336'
    }
  ];

  const handleChatPress = () => {
    console.log('Chat button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar navigation={navigation} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={strings.searchPlaceholder}
            placeholderTextColor="#9E9E9E"
          />
        </View>

        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          {dashboardCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, { backgroundColor: card.color }]}
              onPress={() => navigation.navigate(card.screen)}
              accessibilityLabel={card.title}
            >
              <Icon name={card.icon} size={32} color="#fff" />
              <Text style={styles.cardTitle}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.appointmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{strings.upcomingAppointments}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Records')}>
              <Text style={styles.viewAllText}>{strings.viewAll}</Text>
            </TouchableOpacity>
          </View>

          {upcomingAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={[styles.appointmentIcon, { backgroundColor: appointment.color }]}>
                <Icon name={appointment.icon} size={20} color="#fff" />
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentTitle}>{appointment.title}</Text>
              </View>
              <Text style={styles.appointmentDate}>{appointment.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  card: {
    width: '45%',
    aspectRatio: 1,
    margin: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  appointmentsSection: {
    paddingHorizontal: 16,
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  appointmentDate: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
});
