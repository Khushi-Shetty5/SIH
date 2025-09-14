
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDoctor } from './DoctorContext';

export function Calendar() {
  const { patients, appointments, scheduleAppointment, completeAppointment, updateAppointment, cancelAppointment } = useDoctor();
  const [currentView, setCurrentView] = React.useState('day');
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [doctorStatus, setDoctorStatus] = React.useState('available');
  const [showAppointmentModal, setShowAppointmentModal] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [time, setTime] = React.useState("");
  const [patientId, setPatientId] = React.useState(patients[0]?.id || "");
  const [appointmentType, setAppointmentType] = React.useState('consultation');
  const [duration, setDuration] = React.useState(30);
  const [customAppointmentTitle, setCustomAppointmentTitle] = React.useState('');
  const [showCustomAppointment, setShowCustomAppointment] = React.useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = React.useState('');
  const [showPatientSearch, setShowPatientSearch] = React.useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null);
  const [unavailableSlots, setUnavailableSlots] = React.useState([]);
  
  const renderViewSelector = () => (
    <View style={styles.viewSelector}>
      {['day', 'agenda'].map(view => (
        <TouchableOpacity
          key={view}
          style={[styles.viewButton, currentView === view && styles.viewButtonActive]}
          onPress={() => setCurrentView(view)}
        >
          <MaterialIcons 
            name={view === 'day' ? 'today' : 'list'} 
            size={16} 
            color={currentView === view ? '#fff' : '#6c757d'} 
          />
          <Text style={[styles.viewButtonText, currentView === view && styles.viewButtonTextActive]}>
            {view === 'day' ? 'Day View' : 'Agenda'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  const getStatusBadge = (status) => {
    const badges = {
      'scheduled': { label: 'Scheduled', color: '#2E86C1', bgColor: '#E3F2FD' },
      'confirmed': { label: 'Confirmed', color: '#28A745', bgColor: '#E8F5E8' },
      'checked_in': { label: 'Checked In', color: '#FF9800', bgColor: '#FFF3E0' },
      'in_progress': { label: 'In Progress', color: '#9C27B0', bgColor: '#F3E5F5' },
      'completed': { label: 'Completed', color: '#4CAF50', bgColor: '#E8F5E8' },
      'cancelled': { label: 'Cancelled', color: '#F44336', bgColor: '#FFEBEE' },
      'no_show': { label: 'No Show', color: '#607D8B', bgColor: '#ECEFF1' }
    };
    return badges[status] || badges['scheduled'];
  };
  
  const enhancedAppointments = React.useMemo(() => {
    return appointments.map(apt => {
      const patient = patients.find(p => p.id === apt.patientId);
      return {
        ...apt,
        patient,
        type: apt.type || 'consultation',
        duration: apt.duration || 30,
        statusBadge: getStatusBadge(apt.status),
        isToday: new Date(apt.when).toDateString() === new Date().toDateString()
      };
    });
  }, [appointments, patients]);
  
  const filteredAppointments = React.useMemo(() => {
    const viewDate = selectedDate;
    const startOfDay = new Date(viewDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    let endDate = new Date(viewDate);
    endDate.setHours(23, 59, 59, 999);
    
    return enhancedAppointments.filter(apt => {
      const aptDate = new Date(apt.when);
      return aptDate >= startOfDay && aptDate <= endDate;
    });
  }, [enhancedAppointments, currentView, selectedDate]);
  
  const todayAppointments = React.useMemo(() => {
    const today = new Date();
    return enhancedAppointments.filter(apt => 
      new Date(apt.when).toDateString() === today.toDateString()
    ).sort((a, b) => new Date(a.when) - new Date(b.when));
  }, [enhancedAppointments]);
  
  const handleCreateAppointment = () => {
    if (showCustomAppointment) {
      if (time && customAppointmentTitle) {
        const [hh, mm] = time.split(":");
        if (hh != null && mm != null) {
          const d = new Date(selectedDate);
          d.setHours(Number(hh), Number(mm), 0, 0);
          
          scheduleAppointment({ 
            patientId: 'custom-task', 
            when: d.getTime(),
            type: 'personal',
            duration,
            status: 'scheduled',
            customTitle: customAppointmentTitle,
            isCustomTask: true
          });
          
          setTime("");
          setCustomAppointmentTitle("");
          setShowAppointmentModal(false);
          setShowCustomAppointment(false);
          Alert.alert('Success', 'Personal task scheduled successfully!');
        }
      } else {
        Alert.alert('Error', 'Please fill in time and task description');
      }
    } else if (time && patientId) {
      const [hh, mm] = time.split(":");
      if (hh != null && mm != null) {
        const d = new Date(selectedDate);
        d.setHours(Number(hh), Number(mm), 0, 0);
        
        scheduleAppointment({ 
          patientId, 
          when: d.getTime(),
          type: appointmentType,
          duration,
          status: 'scheduled'
        });
        
        setTime("");
        setShowAppointmentModal(false);
        Alert.alert('Success', 'Appointment scheduled successfully!');
      }
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };
  
  const handleAppointmentAction = (appointment, action) => {
    switch (action) {
      case 'check_in':
        updateAppointment(appointment.id, { status: 'checked_in' });
        Alert.alert('Success', `${appointment.patient?.name || 'Patient'} has been checked in`);
        break;
      case 'start_consult':
        updateAppointment(appointment.id, { status: 'in_progress' });
        Alert.alert('Starting Consultation', `Starting consultation with ${appointment.patient?.name || 'Patient'}`);
        break;
      case 'complete':
        completeAppointment(appointment.id);
        Alert.alert('Success', 'Appointment completed');
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Appointment',
          `Are you sure you want to cancel the appointment with ${appointment.patient?.name || 'this patient'}?`,
          [
            { text: 'No', style: 'cancel' },
            { 
              text: 'Yes, Cancel', 
              style: 'destructive',
              onPress: () => {
                cancelAppointment(appointment.id);
                Alert.alert('Cancelled', 'Appointment has been cancelled');
              }
            }
          ]
        );
        break;
      default:
        Alert.alert('Action', `${action} for ${appointment.patient?.name || 'appointment'}`);
    }
  };

  const renderDoctorStatus = () => {
    const statusOptions = [
      { key: 'available', label: 'Available', color: '#4CAF50', bgColor: '#E8F5E8', icon: 'check-circle' },
      { key: 'busy', label: 'Busy', color: '#FF9800', bgColor: '#FFF3E0', icon: 'schedule' },
      { key: 'on-duty', label: 'On Duty', color: '#2E86C1', bgColor: '#E3F2FD', icon: 'work' },
      { key: 'off-duty', label: 'Off Duty', color: '#F44336', bgColor: '#FFEBEE', icon: 'work-off' }
    ];
    
    return (
      <View style={styles.doctorStatusContainer}>
        <View style={styles.statusGrid}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.statusOption,
                doctorStatus === option.key && styles.statusOptionActive,
                { 
                  backgroundColor: doctorStatus === option.key ? option.color : option.bgColor,
                  borderColor: option.color,
                }
              ]}
              onPress={() => setDoctorStatus(option.key)}
              activeOpacity={0.8}
            >
              <MaterialIcons 
                name={option.icon} 
                size={16} 
                color={doctorStatus === option.key ? '#fff' : option.color} 
              />
              <Text style={[
                styles.statusOptionText,
                {
                  color: doctorStatus === option.key ? '#fff' : option.color,
                  fontWeight: doctorStatus === option.key ? '700' : '600'
                }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderAppointmentCard = (appointment, isCompact = false) => {
    const patient = appointment.patient || { name: appointment.customTitle, age: '', gender: '' };
    const statusBadge = appointment.statusBadge;
    
    return (
      <TouchableOpacity 
        key={appointment.id}
        style={[styles.appointmentCard, isCompact && styles.compactCard]}
        onPress={() => {
          setSelectedAppointment(appointment);
          setShowAppointmentModal(true);
        }}
        activeOpacity={0.8}
      >
        <View style={styles.appointmentHeader}>
          <View style={styles.patientInfo}>
            <View style={[styles.avatarContainer, appointment.isCustomTask && styles.customTaskAvatar]}>
              <Text style={styles.avatarText}>
                {appointment.isCustomTask ? 'T' : patient?.name?.charAt(0)?.toUpperCase() || 'P'}
              </Text>
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>
                {appointment.isCustomTask ? appointment.customTitle : patient?.name || 'Unknown Patient'}
              </Text>
              <Text style={styles.patientMeta}>
                {appointment.isCustomTask ? 'Personal Task' : 
                 patient?.age ? `${patient.age}y` : ''} {patient?.gender && !appointment.isCustomTask ? `• ${patient.gender}` : ''}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.bgColor }]}>
            <Text style={[styles.statusText, { color: statusBadge.color }]}>
              {statusBadge.label}
            </Text>
          </View>
        </View>
        
        <View style={styles.appointmentMeta}>
          <View style={styles.timeInfo}>
            <MaterialIcons name="schedule" size={16} color="#6c757d" />
            <Text style={styles.timeText}>
              {new Date(appointment.when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {appointment.duration && ` (${appointment.duration}m)`}
            </Text>
          </View>
          <View style={styles.typeInfo}>
            <MaterialIcons 
              name={appointment.type === 'telemedicine' ? 'videocam' : 
                   appointment.type === 'personal' ? 'work' :
                   appointment.type === 'home' ? 'home' : 'local-hospital'} 
              size={16} 
              color="#6c757d" 
            />
            <Text style={styles.typeText}>
              {appointment.type?.charAt(0)?.toUpperCase() + appointment.type?.slice(1) || 'Consultation'}
            </Text>
          </View>
        </View>
        
        {!isCompact && (
          <View style={styles.appointmentActions}>
            {appointment.status === 'scheduled' && !appointment.isCustomTask && (
              <TouchableOpacity 
                style={[styles.actionBtn, styles.checkInBtn]}
                onPress={() => handleAppointmentAction(appointment, 'check_in')}
              >
                <MaterialIcons name="login" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Check In</Text>
              </TouchableOpacity>
            )}
            {appointment.status === 'checked_in' && (
              <TouchableOpacity 
                style={[styles.actionBtn, styles.startBtn]}
                onPress={() => handleAppointmentAction(appointment, 'start_consult')}
              >
                <MaterialIcons name="play-arrow" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Start</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionBtn, styles.moreBtn]}
              onPress={() => {
                Alert.alert(
                  'Quick Actions',
                  'Choose an action',
                  [
                    { text: 'Complete', onPress: () => handleAppointmentAction(appointment, 'complete') },
                    { text: 'Cancel', onPress: () => handleAppointmentAction(appointment, 'cancel') },
                    { text: 'Close', style: 'cancel' }
                  ]
                );
              }}
            >
              <MaterialIcons name="more-horiz" size={16} color="#6c757d" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const workingHours = hours.slice(8, 19); // 8 AM to 7 PM
    
    return (
      <ScrollView style={styles.dayViewContainer}>
        <View style={styles.timelineHeader}>
          <Text style={styles.dateHeaderText}>
            {selectedDate.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        
        {workingHours.map(hour => {
          const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
          const hourAppointments = filteredAppointments.filter(apt => 
            new Date(apt.when).getHours() === hour
          );
          const isUnavailable = unavailableSlots.includes(timeSlot);
          
          return (
            <View key={hour} style={styles.timeSlot}>
              <View style={styles.timeLabel}>
                <Text style={styles.timeLabelText}>
                  {hour.toString().padStart(2, '0')}:00
                </Text>
                <TouchableOpacity 
                  style={styles.unavailableToggle}
                  onPress={() => {
                    if (isUnavailable) {
                      setUnavailableSlots(unavailableSlots.filter(slot => slot !== timeSlot));
                      Alert.alert('Updated', 'Time slot marked as available');
                    } else {
                      setUnavailableSlots([...unavailableSlots, timeSlot]);
                      Alert.alert('Updated', 'Time slot marked as unavailable');
                    }
                  }}
                >
                  <MaterialIcons 
                    name={isUnavailable ? 'block' : 'schedule'} 
                    size={16} 
                    color={isUnavailable ? '#F44336' : '#4CAF50'} 
                  />
                  <Text style={{
                    fontSize: 10,
                    color: isUnavailable ? '#F44336' : '#4CAF50',
                    marginTop: 2,
                    fontWeight: '600'
                  }}>
                    {isUnavailable ? 'Block' : 'Open'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.slotContent}>
                {isUnavailable ? (
                  <View style={styles.unavailableSlot}>
                    <MaterialIcons name="block" size={20} color="#F44336" />
                    <Text style={styles.unavailableSlotText}>Unavailable</Text>
                  </View>
                ) : hourAppointments.length > 0 ? (
                  hourAppointments.map(apt => renderAppointmentCard(apt, true))
                ) : (
                  <TouchableOpacity 
                    style={styles.emptySlot}
                    onPress={() => {
                      setSelectedTimeSlot(timeSlot);
                      setTime(timeSlot);
                      setShowPatientSearch(true);
                      setShowAppointmentModal(true);
                    }}
                  >
                    <MaterialIcons name="add" size={20} color="#2E86C1" />
                    <Text style={styles.emptySlotText}>Available - Tap to Schedule</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };
  
  const renderAgendaView = () => {
    const upcomingAppointments = todayAppointments.filter(apt => new Date(apt.when) > new Date());
    const currentAppointment = todayAppointments.find(apt => {
      const now = new Date();
      const aptStart = new Date(apt.when);
      const aptEnd = new Date(apt.endTime || apt.when + 30 * 60000);
      return now >= aptStart && now <= aptEnd;
    });
    const completedAppointments = todayAppointments.filter(apt => 
      apt.status === 'completed' || new Date(apt.when) < new Date()
    );
    const workingHours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
    
    return (
      <ScrollView style={styles.agendaContainer}>
        {/* Agenda Header with Stats */}
        <View style={styles.agendaStatsContainer}>
          <View style={styles.agendaStatCard}>
            <MaterialIcons name="today" size={24} color="#2E86C1" />
            <Text style={styles.agendaStatNumber}>{todayAppointments.length}</Text>
            <Text style={styles.agendaStatLabel}>Total Today</Text>
          </View>
          <View style={styles.agendaStatCard}>
            <MaterialIcons name="schedule" size={24} color="#FF9800" />
            <Text style={styles.agendaStatNumber}>{upcomingAppointments.length}</Text>
            <Text style={styles.agendaStatLabel}>Upcoming</Text>
          </View>
          <View style={styles.agendaStatCard}>
            <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.agendaStatNumber}>{completedAppointments.length}</Text>
            <Text style={styles.agendaStatLabel}>Completed</Text>
          </View>
        </View>
        
        
        
        {/* Today's Schedule Timeline */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineSectionHeader}>
            <MaterialIcons name="timeline" size={20} color="#2E86C1" />
            <Text style={styles.timelineSectionTitle}>Today's Schedule</Text>
          </View>
          
          {todayAppointments.length > 0 ? (
            <View style={styles.timelineContainer}>
              {todayAppointments.map((apt, index) => {
                const isLast = index === todayAppointments.length - 1;
                const isPast = new Date(apt.when) < new Date();
                const isCurrent = currentAppointment?.id === apt.id;
                
                return (
                  <View key={apt.id} style={styles.timelineItem}>
                    <View style={styles.timelineItemLeft}>
                      <View style={[
                        styles.timelineMarker,
                        isCurrent ? styles.timelineMarkerCurrent :
                        isPast ? styles.timelineMarkerPast : styles.timelineMarkerFuture
                      ]}>
                        <MaterialIcons 
                          name={isCurrent ? 'play-arrow' : isPast ? 'check' : 'schedule'} 
                          size={12} 
                          color="#fff" 
                        />
                      </View>
                      {!isLast && <View style={[
                        styles.timelineLine,
                        isPast ? styles.timelineLinePast : styles.timelineLineFuture
                      ]} />}
                    </View>
                    <View style={styles.timelineItemRight}>
                      <Text style={styles.timelineTime}>
                        {new Date(apt.when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      {renderAppointmentCard(apt, true)}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyTimelineContainer}>
              <MaterialIcons name="event-available" size={48} color="#E3F2FD" />
              <Text style={styles.emptyTimelineText}>No appointments scheduled</Text>
              <Text style={styles.emptyTimelineSubText}>Enjoy your free day!</Text>
            </View>
          )}
        </View>
      
      </ScrollView>
    );
  };
  
  const renderCurrentView = () => {
    switch (currentView) {
      case 'day':
        return renderDayView();
      case 'agenda':
        return renderAgendaView();
      default:
        return renderDayView();
    }
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Calendar Header */}
      <View style={styles.calendarHeader}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.calendarTitle}>Calendar</Text>
            {renderDoctorStatus()}
          </View>
        </View>
        
        {/* Date Navigator */}
        <View style={styles.dateNavigator}>
          <TouchableOpacity 
            style={styles.navBtn}
            onPress={() => {
              const prevDate = new Date(selectedDate);
              prevDate.setDate(prevDate.getDate() - 1);
              setSelectedDate(prevDate);
            }}
          >
            <MaterialIcons name="chevron-left" size={24} color="#2E86C1" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.datePickerBtn}
            onPress={() => {
              // Date picker would go here
              Alert.alert('Date Picker', 'Date picker would open here');
            }}
          >
            <Text style={styles.selectedDateText}>
              {selectedDate.toLocaleDateString('en-IN', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navBtn}
            onPress={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(nextDate.getDate() + 1);
              setSelectedDate(nextDate);
            }}
          >
            <MaterialIcons name="chevron-right" size={24} color="#2E86C1" />
          </TouchableOpacity>
        </View>
        
        {/* View Selector */}
        {renderViewSelector()}
      </View>
      
      {/* Calendar Content */}
      <View style={styles.calendarContent}>
        {renderCurrentView()}
      </View>
      
      {/* Floating Action Button for New Appointment */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          // Reset all form states for new appointment
          setShowCustomAppointment(false);
          setShowPatientSearch(false);
          setSelectedAppointment(null);
          setTime('');
          setCustomAppointmentTitle('');
          setPatientSearchQuery('');
          setPatientId(patients[0]?.id || '');
          setAppointmentType('consultation');
          setDuration(30);
          setSelectedTimeSlot(null);
          setShowAppointmentModal(true);
        }}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
      
      {/* New Appointment Modal */}
      <Modal
        visible={showAppointmentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAppointmentModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseBtn}
              onPress={() => {
                // Reset all states when closing modal via X button
                setShowAppointmentModal(false);
                setShowCustomAppointment(false);
                setShowPatientSearch(false);
                setCustomAppointmentTitle('');
                setPatientSearchQuery('');
                setSelectedAppointment(null);
                setTime('');
                setPatientId(patients[0]?.id || '');
                setAppointmentType('consultation');
                setDuration(30);
                setSelectedTimeSlot(null);
              }}
            >
              <MaterialIcons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedAppointment ? 'Appointment Details' : 'New Appointment'}
            </Text>
            <View style={styles.modalCloseBtn} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedAppointment ? (
                /* Appointment Detail View */
                <View style={styles.appointmentDetail}>
                  {/* Header with Patient Avatar and Info */}
                  <View style={styles.detailHeader}>
                    <View style={styles.detailPatientInfo}>
                      <View style={[styles.detailAvatarContainer, selectedAppointment.isCustomTask && styles.customTaskDetailAvatar]}>
                        <Text style={styles.detailAvatarText}>
                          {selectedAppointment.isCustomTask ? 'T' : selectedAppointment.patient?.name?.charAt(0)?.toUpperCase() || 'P'}
                        </Text>
                      </View>
                      <View style={styles.detailPatientDetails}>
                        <Text style={styles.detailPatientName}>
                          {selectedAppointment.isCustomTask ? selectedAppointment.customTitle : selectedAppointment.patient?.name || 'Unknown Patient'}
                        </Text>
                        <Text style={styles.detailPatientMeta}>
                          {selectedAppointment.isCustomTask ? 'Personal Task' : 
                           selectedAppointment.patient?.age ? `${selectedAppointment.patient.age} years old` : ''}
                          {selectedAppointment.patient?.gender && !selectedAppointment.isCustomTask ? ` • ${selectedAppointment.patient.gender === 'M' ? 'Male' : 'Female'}` : ''}
                        </Text>
                        {selectedAppointment.patient?.contact && (
                          <TouchableOpacity
                            style={styles.contactChip}
                            onPress={() => {
                              const phoneNumber = selectedAppointment.patient?.contact;
                              if (phoneNumber) {
                                const cleanedNumber = phoneNumber.replace(/[^0-9+]/g, '');
                                const phoneUrl = `tel:${cleanedNumber}`;
                                Linking.openURL(phoneUrl).catch(() => {
                                  Alert.alert('Error', 'Unable to make phone call.');
                                });
                              }
                            }}
                          >
                            <MaterialIcons name="phone" size={14} color="#FFFFFF" />
                            <Text style={styles.contactText}>{selectedAppointment.patient.contact}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View style={[styles.detailStatusBadge, { backgroundColor: selectedAppointment.statusBadge?.bgColor }]}>
                      <Text style={[styles.detailStatusText, { color: selectedAppointment.statusBadge?.color }]}>
                        {selectedAppointment.statusBadge?.label}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Appointment Info Cards */}
                  <View style={styles.detailInfoSection}>
                    <View style={styles.detailInfoCard}>
                      <View style={styles.detailInfoIcon}>
                        <MaterialIcons name="schedule" size={24} color="#1976D2" />
                      </View>
                      <View style={styles.detailInfoContent}>
                        <Text style={styles.detailInfoLabel}>Date & Time</Text>
                        <Text style={styles.detailInfoValue}>
                          {new Date(selectedAppointment.when).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                        <Text style={styles.detailInfoSubValue}>
                          {new Date(selectedAppointment.when).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailInfoCard}>
                      <View style={styles.detailInfoIcon}>
                        <MaterialIcons name="timer" size={24} color="#FF9800" />
                      </View>
                      <View style={styles.detailInfoContent}>
                        <Text style={styles.detailInfoLabel}>Duration</Text>
                        <Text style={styles.detailInfoValue}>{selectedAppointment.duration || 30} minutes</Text>
                      </View>
                    </View>
                    
                    <View style={styles.detailInfoCard}>
                      <View style={styles.detailInfoIcon}>
                        <MaterialIcons 
                          name={selectedAppointment.type === 'telemedicine' ? 'videocam' : 
                               selectedAppointment.type === 'followup' ? 'refresh' :
                               selectedAppointment.type === 'procedure' ? 'medical-services' : 'local-hospital'} 
                          size={24} 
                          color="#4CAF50" 
                        />
                      </View>
                      <View style={styles.detailInfoContent}>
                        <Text style={styles.detailInfoLabel}>Type</Text>
                        <Text style={styles.detailInfoValue}>
                          {selectedAppointment.type?.charAt(0)?.toUpperCase() + selectedAppointment.type?.slice(1) || 'Consultation'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  {/* Quick Action Buttons */}
                  <View style={styles.detailQuickActions}>
                    {selectedAppointment.status === 'scheduled' && !selectedAppointment.isCustomTask && (
                      <TouchableOpacity 
                        style={[styles.detailActionBtn, styles.primaryDetailAction]}
                        onPress={() => {
                          handleAppointmentAction(selectedAppointment, 'check_in');
                          setShowAppointmentModal(false);
                        }}
                      >
                        <MaterialIcons name="login" size={20} color="#FFFFFF" />
                        <Text style={styles.detailActionText}>Check In Patient</Text>
                      </TouchableOpacity>
                    )}
                    
                    {selectedAppointment.status === 'checked_in' && (
                      <TouchableOpacity 
                        style={[styles.detailActionBtn, styles.successDetailAction]}
                        onPress={() => {
                          handleAppointmentAction(selectedAppointment, 'start_consult');
                          setShowAppointmentModal(false);
                        }}
                      >
                        <MaterialIcons name="play-arrow" size={20} color="#FFFFFF" />
                        <Text style={styles.detailActionText}>Start Consultation</Text>
                      </TouchableOpacity>
                    )}
                    
                    {selectedAppointment.status === 'in_progress' && (
                      <TouchableOpacity 
                        style={[styles.detailActionBtn, styles.warningDetailAction]}
                        onPress={() => {
                          handleAppointmentAction(selectedAppointment, 'complete');
                          setShowAppointmentModal(false);
                        }}
                      >
                        <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                        <Text style={styles.detailActionText}>Mark Complete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {/* Secondary Actions */}
                  <View style={styles.detailSecondaryActions}>
                    {!selectedAppointment.isCustomTask && (
                      <TouchableOpacity 
                        style={[styles.detailSecondaryBtn, styles.callSecondaryBtn]}
                        onPress={() => {
                          const phoneNumber = selectedAppointment.patient?.contact;
                          if (phoneNumber) {
                            const cleanedNumber = phoneNumber.replace(/[^0-9+]/g, '');
                            const phoneUrl = `tel:${cleanedNumber}`;
                            Linking.openURL(phoneUrl).catch(() => {
                              Alert.alert('Error', 'Unable to make phone call.');
                            });
                          } else {
                            Alert.alert('No Contact', 'No phone number available.');
                          }
                        }}
                      >
                        <MaterialIcons name="phone" size={18} color="#1976D2" />
                        <Text style={[styles.detailSecondaryText, { color: '#1976D2' }]}>Call Patient</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={[styles.detailSecondaryBtn, styles.rescheduleSecondaryBtn]}
                      onPress={() => {
                        handleAppointmentAction(selectedAppointment, 'reschedule');
                        setShowAppointmentModal(false);
                      }}
                    >
                      <MaterialIcons name="schedule" size={18} color="#FF9800" />
                      <Text style={[styles.detailSecondaryText, { color: '#FF9800' }]}>Reschedule</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.detailSecondaryBtn, styles.cancelSecondaryBtn]}
                      onPress={() => {
                        Alert.alert(
                          'Cancel Appointment',
                          `Are you sure you want to cancel this ${selectedAppointment.isCustomTask ? 'task' : 'appointment'}?`,
                          [
                            { text: 'No', style: 'cancel' },
                            { 
                              text: 'Yes, Cancel', 
                              style: 'destructive',
                              onPress: () => {
                                handleAppointmentAction(selectedAppointment, 'cancel');
                                setShowAppointmentModal(false);
                              }
                            }
                          ]
                        );
                      }}
                    >
                      <MaterialIcons name="cancel" size={18} color="#F44336" />
                      <Text style={[styles.detailSecondaryText, { color: '#F44336' }]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            ) : (
              /* New Appointment Form */
              <View style={styles.appointmentForm}>
                {/* Enhanced Header */}
                <View style={styles.formHeader}>
                  <View style={styles.formHeaderIconContainer}>
                    <MaterialIcons name="event" size={28} color="#1976D2" />
                  </View>
                  <Text style={styles.formHeaderTitle}>Create New</Text>
                  <Text style={styles.formHeaderSubtitle}>
                    {showCustomAppointment ? 'Personal Task' : 'Patient Appointment'}
                  </Text>
                  <View style={styles.formHeaderDecoration} />
                </View>
                
                {/* Appointment Type Toggle */}
                <View style={styles.appointmentTypeToggle}>
                  <TouchableOpacity
                    style={[
                      styles.appointmentToggleBtn,
                      !showCustomAppointment && styles.appointmentToggleBtnActive
                    ]}
                    onPress={() => setShowCustomAppointment(false)}
                  >
                    <View style={styles.toggleIconContainer}>
                      <MaterialIcons name="people" size={24} color={!showCustomAppointment ? '#FFFFFF' : '#1976D2'} />
                    </View>
                    <View style={styles.toggleTextContainer}>
                      <Text style={[
                        styles.appointmentToggleTitle,
                        !showCustomAppointment && styles.appointmentToggleTitleActive
                      ]}>Patient</Text>
                      <Text style={[
                        styles.appointmentToggleSubtitle,
                        !showCustomAppointment && styles.appointmentToggleSubtitleActive
                      ]}>Schedule appointment</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.appointmentToggleBtn,
                      showCustomAppointment && styles.appointmentToggleBtnActive
                    ]}
                    onPress={() => setShowCustomAppointment(true)}
                  >
                    <View style={styles.toggleIconContainer}>
                      <MaterialIcons name="work" size={24} color={showCustomAppointment ? '#FFFFFF' : '#1976D2'} />
                    </View>
                    <View style={styles.toggleTextContainer}>
                      <Text style={[
                        styles.appointmentToggleTitle,
                        showCustomAppointment && styles.appointmentToggleTitleActive
                      ]}>Personal</Text>
                      <Text style={[
                        styles.appointmentToggleSubtitle,
                        showCustomAppointment && styles.appointmentToggleSubtitleActive
                      ]}>Add task/reminder</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Enhanced Form Sections */}
                <View style={styles.formSections}>
                  {/* Time & Duration Section */}
                  <View style={styles.formSection}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="schedule" size={20} color="#1976D2" />
                      <Text style={styles.sectionTitle}>Time & Duration</Text>
                    </View>
                    
                    <View style={styles.timeInputContainer}>
                      <View style={styles.timeInputWrapper}>
                        <MaterialIcons name="access-time" size={20} color="#6B7280" />
                        <TextInput 
                          style={styles.timeInput} 
                          placeholder="15:30" 
                          value={time} 
                          onChangeText={setTime}
                          placeholderTextColor="#9CA3AF"
                        />
                        <Text style={styles.timeInputSuffix}>24h format</Text>
                      </View>
                    </View>
                    
                    <View style={styles.durationContainer}>
                      <Text style={styles.durationLabel}>Duration</Text>
                      <View style={styles.durationSelector}>
                        {[15, 30, 45, 60].map(dur => (
                          <TouchableOpacity
                            key={dur}
                            style={[
                              styles.durationChip,
                              duration === dur && styles.durationChipActive
                            ]}
                            onPress={() => setDuration(dur)}
                          >
                            <Text style={[
                              styles.durationChipText,
                              duration === dur && styles.durationChipTextActive
                            ]}>
                              {dur}m
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                
                {showCustomAppointment ? (
                  /* Custom Task Section */
                  <View style={styles.formSection}>
                    <View style={styles.sectionHeader}>
                      <MaterialIcons name="work" size={20} color="#FF9800" />
                      <Text style={styles.sectionTitle}>Task Details</Text>
                    </View>
                    
                    {/* <View style={styles.taskInputContainer}> */}
                      <TextInput 
                        style={[styles.formInput, styles.taskInput]}
                        placeholder="e.g., Hospital Rounds, Meeting, Break..."
                        value={customAppointmentTitle}
                        onChangeText={setCustomAppointmentTitle}
                        placeholderTextColor="#9CA3AF"
                        multiline={true}
                        numberOfLines={3}
                        maxLength={200}
                        textAlignVertical="top"
                        scrollEnabled={false}
                      />
                  </View>
                ) : (
                  <>
                    {/* Appointment Type Section */}
                    <View style={styles.formSection}>
                      <View style={styles.sectionHeader}>
                        <MaterialIcons name="local-hospital" size={20} color="#4CAF50" />
                        <Text style={styles.sectionTitle}>Appointment Type</Text>
                      </View>
                      
                      <View style={styles.typeGrid}>
                        {[
                          { key: 'consultation', label: 'Consultation', icon: 'local-hospital', color: '#4CAF50' },
                          { key: 'followup', label: 'Follow-up', icon: 'refresh', color: '#FF9800' },
                          { key: 'telemedicine', label: 'Telemedicine', icon: 'videocam', color: '#9C27B0' },
                          { key: 'procedure', label: 'Procedure', icon: 'medical-services', color: '#F44336' }
                        ].map(type => (
                          <TouchableOpacity
                            key={type.key}
                            style={[
                              styles.typeCard,
                              appointmentType === type.key && styles.typeCardActive,
                              { borderColor: type.color }
                            ]}
                            onPress={() => setAppointmentType(type.key)}
                          >
                            <View style={[styles.typeIconContainer, { backgroundColor: type.color + '20' }]}>
                              <MaterialIcons 
                                name={type.icon} 
                                size={24} 
                                color={appointmentType === type.key ? '#FFFFFF' : type.color} 
                              />
                            </View>
                            <Text style={[
                              styles.typeCardText,
                              appointmentType === type.key && styles.typeCardTextActive
                            ]}>
                              {type.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    
                    {/* Patient Selection Section */}
                    <View style={styles.formSection}>
                      <View style={styles.sectionHeader}>
                        <MaterialIcons name="people" size={20} color="#1976D2" />
                        <Text style={styles.sectionTitle}>Select Patient</Text>
                        {showPatientSearch && (
                          <TouchableOpacity 
                            style={styles.closeSearchBtn}
                            onPress={() => {
                              setShowPatientSearch(false);
                              setPatientSearchQuery('');
                            }}
                          >
                            <MaterialIcons name="close" size={20} color="#6B7280" />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      {showPatientSearch ? (
                        <View style={styles.patientSearchContainer}>
                          <View style={styles.patientSearchInput}>
                            <MaterialIcons name="search" size={20} color="#6B7280" />
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search patients by name..."
                              value={patientSearchQuery}
                              onChangeText={setPatientSearchQuery}
                              placeholderTextColor="#9CA3AF"
                            />
                          </View>
                          <ScrollView 
                            style={styles.patientSearchResults}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={true}
                          >
                            {patients
                              .filter(p => p.name.toLowerCase().includes(patientSearchQuery.toLowerCase()))
                              .map(p => (
                                <TouchableOpacity
                                  key={p.id}
                                  style={[
                                    styles.patientSearchItem,
                                    patientId === p.id && styles.patientSearchItemSelected
                                  ]}
                                  onPress={() => {
                                    setPatientId(p.id);
                                    setShowPatientSearch(false);
                                    setPatientSearchQuery('');
                                  }}
                                >
                                  <View style={styles.patientSearchAvatar}>
                                    <Text style={styles.patientSearchAvatarText}>
                                      {p.name.charAt(0).toUpperCase()}
                                    </Text>
                                  </View>
                                  <View style={styles.patientSearchInfo}>
                                    <Text style={styles.patientSearchName}>{p.name}</Text>
                                    <Text style={styles.patientSearchMeta}>
                                      {p.age}y • {p.gender === 'M' ? 'Male' : 'Female'}
                                    </Text>
                                  </View>
                                  {patientId === p.id && (
                                    <MaterialIcons name="check" size={20} color="#4CAF50" />
                                  )}
                                </TouchableOpacity>
                              ))
                            }
                          </ScrollView>
                        </View>
                      ) : (
                        <View style={styles.patientQuickSelect}>
                          <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={styles.patientCarousel}
                          >
                            {patients.slice(0, 5).map((p) => (
                              <TouchableOpacity 
                                key={p.id} 
                                onPress={() => setPatientId(p.id)} 
                                style={[
                                  styles.patientCard, 
                                  patientId === p.id && styles.patientCardActive
                                ]}
                              >
                                <View style={[
                                  styles.patientCardAvatar,
                                  patientId === p.id && styles.patientCardAvatarActive
                                ]}>
                                  <Text style={[
                                    styles.patientCardAvatarText,
                                    patientId === p.id && styles.patientCardAvatarTextActive
                                  ]}>
                                    {p.name.charAt(0).toUpperCase()}
                                  </Text>
                                </View>
                                <Text style={[
                                  styles.patientCardName, 
                                  patientId === p.id && styles.patientCardNameActive
                                ]}>
                                  {p.name.split(' ')[0]}
                                </Text>
                                <Text style={[
                                  styles.patientCardMeta,
                                  patientId === p.id && styles.patientCardMetaActive
                                ]}>
                                  {p.age}y
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                          
                          <TouchableOpacity 
                            style={styles.searchMorePatientsBtn}
                            onPress={() => setShowPatientSearch(true)}
                          >
                            <MaterialIcons name="search" size={20} color="#1976D2" />
                            <Text style={styles.searchMorePatientsText}>Search All Patients</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>
                
                {/* Enhanced Action Buttons */}
                <View style={styles.formActions}>
                  <TouchableOpacity 
                    style={styles.formCancelBtn}
                    onPress={() => {
                      // Reset all states when closing modal
                      setShowAppointmentModal(false);
                      setShowCustomAppointment(false);
                      setShowPatientSearch(false);
                      setCustomAppointmentTitle('');
                      setPatientSearchQuery('');
                      setSelectedAppointment(null);
                      setTime('');
                      setPatientId(patients[0]?.id || '');
                      setAppointmentType('consultation');
                      setDuration(30);
                      setSelectedTimeSlot(null);
                    }}
                  >
                    <MaterialIcons name="close" size={18} color="#6B7280" />
                    <Text style={styles.formCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.formSaveBtn}
                    onPress={handleCreateAppointment}
                  >
                    <MaterialIcons name="check" size={20} color="#FFFFFF" />
                    <Text style={styles.formSaveText}>
                      {showCustomAppointment ? 'Add Task' : 'Schedule Appointment'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  calendarHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  calendarTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E4053',
    marginBottom: 8,
  },
  doctorStatusContainer: {
    marginTop: 4,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
    width: '48%',
  },
  statusOptionActive: {
    // Active state handled by inline styling
  },
  statusOptionText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  navBtn: {
    padding: 8,
  },
  datePickerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    marginHorizontal: 16,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86C1',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 4,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewButtonActive: {
    backgroundColor: '#2E86C1',
  },
  viewButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  viewButtonTextActive: {
    color: '#fff',
  },
  calendarContent: {
    flex: 1,
  },
  dayViewContainer: {
    flex: 1,
  },
  timelineHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E4053',
  },
  timeSlot: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  timeLabel: {
    width: 80,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#E9ECEF',
  },
  timeLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  unavailableToggle: {
    alignItems: 'center',
    marginTop: 4,
  },
  slotContent: {
    flex: 1,
    minHeight: 60,
    justifyContent: 'center',
    padding: 12,
  },
  unavailableSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
  },
  unavailableSlotText: {
    marginLeft: 8,
    color: '#F44336',
    fontWeight: '600',
  },
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  emptySlotText: {
    marginLeft: 8,
    color: '#2E86C1',
    fontWeight: '600',
  },
  agendaContainer: {
    flex: 1,
  },
  agendaStatsContainer: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'space-between',
    gap: 8,
  },
  agendaStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#2E86C1',
  },
  agendaStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
    marginTop: 6,
  },
  agendaStatLabel: {
    fontSize: 10,
    color: '#6c757d',
    marginTop: 3,
    textAlign: 'center',
  },
  timelineSection: {
    margin: 12,
    marginTop: 6,
  },
  timelineSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineSectionTitle: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#2E4053',
  },
  emptyTimelineContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  emptyTimelineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 12,
  },
  emptyTimelineSubText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 3,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compactCard: {
    marginBottom: 6,
    padding: 10,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E86C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  customTaskAvatar: {
    backgroundColor: '#FF9800',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E4053',
  },
  patientMeta: {
    fontSize: 11,
    color: '#6c757d',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  appointmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#2E4053',
  },
  typeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    marginLeft: 4,
    fontSize: 10,
    color: '#6c757d',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  checkInBtn: {
    backgroundColor: '#28A745',
  },
  startBtn: {
    backgroundColor: '#2E86C1',
  },
  moreBtn: {
    backgroundColor: '#f8f9fa',
    marginRight: 0,
  },
  actionBtnText: {
    marginLeft: 3,
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFE',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalCloseBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A237E',
  },
  modalContent: {
    flex: 1,
    padding: 12,
  },
  appointmentDetail: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  detailHeader: {
    marginBottom: 16,
  },
  detailPatientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  customTaskDetailAvatar: {
    backgroundColor: '#FF9800',
  },
  detailAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  detailPatientDetails: {
    flex: 1,
  },
  detailPatientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 4,
  },
  detailPatientMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  contactText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 2,
  },
  detailStatusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailInfoSection: {
    marginBottom: 16,
  },
  detailInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1976D2',
  },
  detailInfoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 2,
  },
  detailInfoContent: {
    flex: 1,
  },
  detailInfoLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  detailInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A237E',
  },
  detailInfoSubValue: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  detailQuickActions: {
    marginBottom: 14,
  },
  detailActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  primaryDetailAction: {
    backgroundColor: '#4CAF50',
  },
  successDetailAction: {
    backgroundColor: '#1976D2',
  },
  warningDetailAction: {
    backgroundColor: '#FF9800',
  },
  detailActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  detailSecondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  detailSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  callSecondaryBtn: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  rescheduleSecondaryBtn: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  cancelSecondaryBtn: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  detailSecondaryText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  appointmentForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    position: 'relative',
  },
  formHeaderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    elevation: 3,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A237E',
    marginTop: 6,
  },
  formHeaderSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  formHeaderDecoration: {
    position: 'absolute',
    bottom: 0,
    left: '40%',
    right: '40%',
    height: 2,
    backgroundColor: '#1976D2',
    borderRadius: 1,
  },
  appointmentTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFE',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
    elevation: 2,
  },
  appointmentToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 7,
    backgroundColor: 'transparent',
  },
  appointmentToggleBtnActive: {
    backgroundColor: '#1976D2',
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  toggleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(227, 242, 253, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.2)',
  },
  toggleTextContainer: {
    flex: 1,
  },
  appointmentToggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1976D2',
  },
  appointmentToggleTitleActive: {
    color: '#FFFFFF',
  },
  appointmentToggleSubtitle: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 1,
  },
  appointmentToggleSubtitleActive: {
    color: '#E3F2FD',
  },
  formSections: {
    gap: 10,
  },
  formSection: {
    backgroundColor: 'rgba(248, 250, 254, 0.8)',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#1976D2',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(227, 242, 253, 0.5)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A237E',
    marginLeft: 6,
    flex: 1,
  },
  timeInputContainer: {
    marginBottom: 8,
  },
  timeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timeInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A237E',
    marginLeft: 6,
  },
  timeInputSuffix: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
  },
  durationContainer: {
    marginTop: 5,
  },
  durationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A237E',
    marginBottom: 6,
  },
  durationSelector: {
    flexDirection: 'row',
    gap: 5,
  },
  durationChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  durationChipActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
    elevation: 3,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    transform: [{ scale: 1.02 }],
  },
  durationChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  durationChipTextActive: {
    color: '#FFFFFF',
  },
  taskInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 70,
    maxHeight: 70,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeCard: {
    width: '47%',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  typeCardActive: {
    backgroundColor: '#1976D2',
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    transform: [{ scale: 1.02 }],
  },
  typeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  typeCardText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1A237E',
    textAlign: 'center',
  },
  typeCardTextActive: {
    color: '#FFFFFF',
  },
  closeSearchBtn: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  patientSearchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  patientSearchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFE',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1A237E',
    marginLeft: 6,
  },
  patientSearchResults: {
    maxHeight: 180,
  },
  patientSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: '#F8FAFE',
  },
  patientSearchItemSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  patientSearchAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  patientSearchAvatarText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  patientSearchInfo: {
    flex: 1,
  },
  patientSearchName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A237E',
  },
  patientSearchMeta: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  patientQuickSelect: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  patientCarousel: {
    marginBottom: 8,
  },
  patientCard: {
    alignItems: 'center',
    padding: 8,
    marginRight: 6,
    backgroundColor: '#F8FAFE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 55,
  },
  patientCardActive: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  patientCardAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  patientCardAvatarActive: {
    backgroundColor: '#FFFFFF',
  },
  patientCardAvatarText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
  },
  patientCardAvatarTextActive: {
    color: '#1976D2',
  },
  patientCardName: {
    fontSize: 9,
    fontWeight: '600',
    color: '#1A237E',
    textAlign: 'center',
  },
  patientCardNameActive: {
    color: '#FFFFFF',
  },
  patientCardMeta: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 1,
  },
  patientCardMetaActive: {
    color: '#E3F2FD',
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E4053',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E4053',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1A237E',
    flex: 1,
    marginLeft: 6,
  },
  taskInput: {
    minHeight: 70,
    maxHeight: 70,
    textAlignVertical: 'top',
    paddingTop: 8,
    paddingBottom: 8,
  },
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
  },
  durationOptionActive: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  durationOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  durationOptionTextActive: {
    color: '#fff',
  },
  patientSelector: {
    marginBottom: 16,
  },
  patientOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    marginBottom: 8,
  },
  patientOptionActive: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  patientOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E4053',
  },
  patientOptionTextActive: {
    color: '#fff',
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 2,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
  },
  typeOptionActive: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
  },
  typeOptionTextActive: {
    color: '#fff',
  },
  formSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E86C1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  formSaveText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  formCancelText: {
    fontSize: 14,
    color: '#6c757d',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginVertical: 8,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonActive: {
    backgroundColor: '#1976D2',
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  viewButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  viewButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  formCancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
  },
  formCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  formSaveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#1976D2',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(25, 118, 210, 0.3)',
  },
  formSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  searchMorePatientsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 6,
  },
  searchMorePatientsText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#1976D2',
  },
  quickActionsSection: {
    margin: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionsSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A237E',
    marginBottom: 10,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickActionCard: {
    width: '47%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    elevation: 2,
    shadowColor: '#2E86C1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1A237E',
    marginTop: 6,
    textAlign: 'center',
  },
});