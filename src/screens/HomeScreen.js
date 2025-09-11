import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [isChatModalVisible, setChatModalVisible] = useState(false);

  const upcomingAppointments = [
    {
      id: 1,
      type: 'General check-up',
      date: 'Aug 12',
      icon: 'medical-outline',
    },
    {
      id: 2,
      type: 'Cardiologist check-up',
      date: 'Aug 28',
      icon: 'heart-outline',
    },
  ];

  const medications = [
    {
      id: 1,
      name: 'Paracetamol',
      color: '#3b82f6',
    },
    {
      id: 2,
      name: 'Vitamin C',
      color: '#10b981',
    },
    {
      id: 3,
      name: 'Vitamin D',
      color: '#f59e0b',
    },
  ];

  const serviceCards = [
    {
      id: 1,
      title: 'Check Doctor\nAvailability',
      icon: 'calendar-outline',
      color: '#3b82f6',
      onPress: () => navigation.navigate('DoctorAvailability'),
    },
    {
      id: 2,
      title: 'Book\nAppointment',
      icon: 'add-circle-outline',
      color: '#10b981',
      onPress: () => navigation.navigate('AppointmentBooking'),
    },
    {
      id: 3,
      title: 'Search\nMedicine',
      icon: 'search-outline',
      color: '#f59e0b',
      onPress: () => navigation.navigate('MedicineSearch'),
    },
    {
      id: 4,
      title: 'Video\nConference',
      icon: 'videocam-outline',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('VideoConference'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>MedKit</Text>
          <View style={styles.headerRight}>
            <Text style={styles.tollFreeNumber}>📞 1800-123-4567</Text>
            <Image
              source={{ uri: 'https://dummyimage.com/40x40/e2e8f0/64748b?text=U' }}
              style={styles.profileImage}
              referrerpolicy="no-referrer"
            />
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors, appointments,..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Cards Grid */}
        <View style={styles.serviceGrid}>
          {serviceCards.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, { backgroundColor: service.color }]}
              onPress={service.onPress}
            >
              <Ionicons name={service.icon} size={32} color="#ffffff" />
              <Text style={styles.serviceCardText}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming appointments</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {upcomingAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentIcon}>
                <Ionicons name={appointment.icon} size={24} color="#3b82f6" />
              </View>
              <Text style={styles.appointmentType}>{appointment.type}</Text>
              <View style={styles.appointmentDate}>
                <Text style={styles.appointmentDateText}>{appointment.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Current Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current medications</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.medicationsContainer}>
            {medications.map((medication) => (
              <View key={medication.id} style={styles.medicationCard}>
                <View style={[styles.medicationIcon, { backgroundColor: medication.color }]}>
                  <Ionicons name="medical-outline" size={24} color="#ffffff" />
                </View>
                <Text style={styles.medicationName}>{medication.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Find Your Doctor */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Find your doctor</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.doctorCategories}>
            <TouchableOpacity style={styles.doctorCategory}>
              <View style={[styles.doctorCategoryIcon, { backgroundColor: '#3b82f6' }]}>
                <Ionicons name="medical-outline" size={32} color="#ffffff" />
              </View>
              <Text style={styles.doctorCategoryText}>General</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doctorCategory}>
              <View style={[styles.doctorCategoryIcon, { backgroundColor: '#10b981' }]}>
                <Ionicons name="heart-outline" size={32} color="#ffffff" />
              </View>
              <Text style={styles.doctorCategoryText}>Cardiology</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doctorCategory}>
              <View style={[styles.doctorCategoryIcon, { backgroundColor: '#f59e0b' }]}>
                <Ionicons name="eye-outline" size={32} color="#ffffff" />
              </View>
              <Text style={styles.doctorCategoryText}>Ophthalmology</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate('Chat')}
      >
        <Ionicons name="chatbubble-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tollFreeNumber: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 32,
  },
  serviceCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  serviceCardText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  appointmentType: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  appointmentDate: {
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  appointmentDateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
  },
  medicationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medicationCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  medicationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'center',
  },
  doctorCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doctorCategory: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  doctorCategoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  doctorCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'center',
  },
  chatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomeScreen;
