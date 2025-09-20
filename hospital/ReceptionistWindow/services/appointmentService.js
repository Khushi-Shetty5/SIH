import logger from '../../../utils/logger';

// Mock appointment data service
logger.info('SERVICE', 'AppointmentService initialized with mock data');

export const appointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    doctorId: '1',
    doctorName: 'Dr. Sarah Johnson',
    department: 'General Medicine',
    type: 'video',
    date: '2023-08-16',
    time: '10:00',
    status: 'scheduled',
    notes: 'Follow-up for hypertension management',
    duration: 30
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Maria Garcia',
    doctorId: '3',
    doctorName: 'Dr. Emily Davis',
    department: 'Obstetrics & Gynecology',
    type: 'chat',
    date: '2023-08-17',
    time: '14:00',
    status: 'scheduled',
    notes: 'Prenatal check-up',
    duration: 45
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Robert Wilson',
    doctorId: '2',
    doctorName: 'Dr. Michael Brown',
    department: 'Cardiology',
    type: 'video',
    date: '2023-08-18',
    time: '09:30',
    status: 'scheduled',
    notes: 'Post-heart attack follow-up',
    duration: 30
  }
];

export const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const consultationTypes = [
  { id: 'video', name: 'Video Call', icon: 'videocam' },
  { id: 'chat', name: 'Chat', icon: 'chat' },
  { id: 'phone', name: 'Phone Call', icon: 'call' }
];

export const getAppointments = () => {
  return appointments.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
};

export const getAppointmentById = (id) => {
  return appointments.find(appointment => appointment.id === id);
};

export const getAppointmentsByDoctor = (doctorId) => {
  return appointments.filter(appointment => appointment.doctorId === doctorId);
};

export const getAppointmentsByPatient = (patientId) => {
  return appointments.filter(appointment => appointment.patientId === patientId);
};

export const scheduleAppointment = (appointmentData) => {
  logger.info('SERVICE', 'Scheduling new appointment', { appointmentData });
  
  try {
    // Validate required fields
    const requiredFields = ['patientId', 'patientName', 'doctorId', 'doctorName', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !appointmentData[field]);
    
    if (missingFields.length > 0) {
      logger.error('SERVICE', 'Missing required fields for appointment', { 
        missingFields, 
        appointmentData 
      });
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const newAppointment = {
      id: (appointments.length + 1).toString(),
      ...appointmentData,
      status: 'scheduled'
    };
    
    appointments.push(newAppointment);
    
    logger.info('SERVICE', 'Appointment scheduled successfully', { 
      appointmentId: newAppointment.id,
      patientName: newAppointment.patientName,
      doctorName: newAppointment.doctorName,
      date: newAppointment.date,
      time: newAppointment.time
    });
    
    return newAppointment;
  } catch (error) {
    logger.error('SERVICE', 'Failed to schedule appointment', { 
      appointmentData, 
      error: error.message 
    });
    throw error;
  }
};

export const updateAppointmentStatus = (appointmentId, status) => {
  const appointment = appointments.find(a => a.id === appointmentId);
  if (appointment) {
    appointment.status = status;
    return true;
  }
  return false;
};

export const getAvailableTimeSlots = (doctorId, date) => {
  const doctorAppointments = appointments.filter(
    apt => apt.doctorId === doctorId && apt.date === date && apt.status === 'scheduled'
  );
  
  const bookedTimes = doctorAppointments.map(apt => apt.time);
  
  return timeSlots.filter(slot => !bookedTimes.includes(slot));
};

export const getUpcomingAppointments = () => {
  const today = new Date().toISOString().split('T')[0];
  return appointments.filter(apt => apt.date >= today && apt.status === 'scheduled');
};
