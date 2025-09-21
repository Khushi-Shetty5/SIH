import axios from 'axios';

const PATIENT_BASE_URL = 'http://192.168.181.168:3000';
const DAILY_API_KEY = '6704f46560dc7b8bf06b41a09508dc3ca643a941d375db63a372c6d820579cd5';

import { getUser } from './storage';

// --- Actual backend logic (commented out for now) ---
export const fetchDoctors = async () => {
  // Uncomment below for actual backend call
  // const response = await axios.get(`${PATIENT_BASE_URL}/api/doctors`);
  // return response.data;

  // Mock response for development/testing
  return Promise.resolve([
    { id: 1, name: "Dr. Sarah Johnson" },
    { id: 2, name: "Dr. Michael Chen" }
  ]);
};

export const fetchSlots = async (doctorId, date) => {
  // Uncomment below for actual backend call
  // const response = await axios.get(`${PATIENT_BASE_URL}/api/appointments/slots`, {
  //   params: { doctorId, date }
  // });
  // return response.data;

  // Mock response for development/testing
  return Promise.resolve(["9:00 AM", "10:00 AM", "2:00 PM"]);
};


export const bookAppointment = async (appointmentData, idempotencyKey) => {
  let user = await getUser();
  const patientId = user?.id || 'dummy_patient_id'; // fallback dummy id for testing

  const dataWithPatient = { ...appointmentData, patientId };

  // Uncomment below for real backend call
  /*
  const headers = { 'Content-Type': 'application/json' };
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }
  const response = await axios.post(
    `${PATIENT_BASE_URL}/api/appointments/booking`,
    dataWithPatient,
    { headers }
  );
  return response.data;
  */

  // Mock response for testing
  return Promise.resolve({ success: true, appointment: { id: "mock_123", status: "pending", ...dataWithPatient } });
};

// export const sendOfflineAppointment = async (appointmentData) => {
//   const response = await axios.post(
//     `${PATIENT_BASE_URL}/api/appointments/offline`,
//     appointmentData
//   );
//   return response.data;
// };

export const sendOfflineAppointment = async (appointmentData) => {
  return Promise.resolve({ success: true, appointment: { id: "offline_123", status: "pending_offline", ...appointmentData } });
};

// export const getPatientAppointments = async () => {
//   const response = await axios.get(`${PATIENT_BASE_URL}/api/appointments/patient`);
//   return response.data;
// };

export const getPatientAppointments = async () => {
  return Promise.resolve([
    {
      id: 'a1',
      doctorName: 'Dr. Sarah Johnson',
      date: '2025-09-20',
      time: '10:00 AM',
      reason: 'General Checkup',
      status: 'pending',
    },
    {
      id: 'a2',
      doctorName: 'Dr. Michael Chen',
      date: '2025-09-22',
      time: '02:30 PM',
      reason: 'Cardiology Follow-up',
      status: 'approved',
    }
  ]);
};


// Create or get existing video room for appointment
export const createVideoRoom = async (appointmentId, patientId, doctorId) => {
  try {
    if (!appointmentId || !patientId || !doctorId) {
      throw new Error('Missing required parameters for video room creation');
    }
    
    console.log('🎥 Creating/Getting video room for appointment:', appointmentId);
    
    const response = await axios.post(`${PATIENT_BASE_URL}/auth/create-video-room`, {
      appointmentId,
      patientId,
      doctorId,
    });
    
    console.log('🎥 Video room response:', response.data);
    
    if (!response.data.roomUrl) {
      throw new Error('No room URL returned from server');
    }
    
    return response.data.roomUrl;
  } catch (error) {
    console.error('❌ Error creating video room:', error.response?.data || error.message);
    throw error;
  }
};

// Helper function to format time
const formatTime = (timeString) => {
  if (!timeString) return '';
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':');
  const hourNum = parseInt(hours);
  const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${formattedHour}:${minutes} ${period}`;
};

// Helper function to compare times
const compareTime = (timeA, timeB) => {
  const [timeStrA, periodA] = timeA.split(' ');
  const [timeStrB, periodB] = timeB.split(' ');
  
  const [hoursA, minutesA] = timeStrA.split(':').map(Number);
  const [hoursB, minutesB] = timeStrB.split(':').map(Number);
  
  const timeInMinutesA = (hoursA % 12 + (periodA === 'PM' ? 12 : 0)) * 60 + minutesA;
  const timeInMinutesB = (hoursB % 12 + (periodB === 'PM' ? 12 : 0)) * 60 + minutesB;
  
  return timeInMinutesA - timeInMinutesB;
};

// Get video room URL for specific appointment (if hospital hasn't created it yet)
export const getOrCreateVideoRoom = async (appointmentId, patientId, doctorId) => {
  try {
    console.log('🎥 Getting or creating video room for appointment:', appointmentId);
    
    // First try to get existing appointment to see if video room exists
    const appointmentResponse = await axios.get(`${PATIENT_BASE_URL}/auth/appointments/${appointmentId}`);
    const appointment = appointmentResponse.data;
    
    if (appointment.videoRoomUrl) {
      console.log('🎥 Existing video room found:', appointment.videoRoomUrl);
      return appointment.videoRoomUrl;
    }
    
    // If no video room exists, create one
    console.log('🎥 No existing video room, creating new one');
    const roomUrl = await createVideoRoom(appointmentId, patientId, doctorId);
    return roomUrl;
  } catch (error) {
    console.error('❌ Error getting/creating video room:', error.response?.data || error.message);
    throw error;
  }
};

// Cancel appointment
export const cancelAppointment = async (appointmentId, patientId) => {
  try {
    console.log('❌ Cancelling appointment:', appointmentId);
    const response = await axios.put(`${PATIENT_BASE_URL}/auth/appointments/${appointmentId}/cancel`, {
      patientId,
      cancelReason: 'Patient cancelled',
    });
    console.log('❌ Appointment cancelled:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error cancelling appointment:', error.response?.data || error.message);
    throw error;
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (appointmentId, patientId, newDate, newTime) => {
  try {
    console.log('🔄 Rescheduling appointment:', appointmentId, 'to', newDate, newTime);
    const response = await axios.put(`${PATIENT_BASE_URL}/auth/appointments/${appointmentId}/reschedule`, {
      patientId,
      newDate: new Date(newDate).toISOString(),
      newTime,
    });
    console.log('🔄 Appointment rescheduled:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error rescheduling appointment:', error.response?.data || error.message);
    throw error;
  }
};