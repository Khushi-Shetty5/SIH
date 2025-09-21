import axios from 'axios';

const PATIENT_BASE_URL = 'http://192.168.181.168:3000';
const DAILY_API_KEY = '6704f46560dc7b8bf06b41a09508dc3ca643a941d375db63a372c6d820579cd5';

export const fetchDoctors = async () => {
  return Promise.resolve([
    { id: 1, name: "Dr. Sarah Johnson" },
    { id: 2, name: "Dr. Michael Chen" }
  ]);
};

export const fetchSlots = async (doctorId, date) => {
  return Promise.resolve(["9:00 AM", "10:00 AM", "2:00 PM"]);
};

export const bookAppointment = async (appointmentData) => {
  try {
    const formattedData = {
      ...appointmentData,
      date: new Date(appointmentData.date).toISOString(), // Convert date to ISO string
      appointmentType: appointmentData.appointmentType || 'general', // Default to 'general'
    };
    
    console.log('📅 Booking appointment with data:', formattedData);
    
    const response = await axios.post(`${PATIENT_BASE_URL}/auth/book-appointment`, formattedData);
    console.log('📅 Book appointment response:', response.data);
    
    const { appointment } = response.data;
    
    // If video consultation, try to create video room immediately
    if (appointment.appointmentType === 'video' && appointment.status === 'pending') {
      try {
        console.log('🎥 Creating video room for new appointment:', appointment._id);
        const roomUrl = await createVideoRoom(appointment._id, appointmentData.patientId, appointmentData.doctorId);
        console.log('🎥 Video room created successfully:', roomUrl);
        
        // Update appointment with video room URL
        const updateResponse = await axios.put(`${PATIENT_BASE_URL}/auth/appointments/${appointment._id}/update-video-room`, {
          videoRoomUrl: roomUrl,
          patientId: appointmentData.patientId,
          doctorId: appointmentData.doctorId,
        });
        
        console.log('🎥 Video room URL updated in appointment:', updateResponse.data);
        appointment.videoRoomUrl = roomUrl;
      } catch (videoError) {
        console.error('❌ Failed to create video room after booking:', videoError.response?.data || videoError.message);
        // Don't fail the booking if video room creation fails
      }
    }
    
    return appointment;
  } catch (error) {
    console.error('❌ Error booking appointment:', error.response?.data || error.message);
    throw error;
  }
};

export const getPatientAppointments = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    
    console.log('📋 Fetching appointments for patientId:', patientId);
    
    const response = await axios.get(`${PATIENT_BASE_URL}/auth/appointments`, {
      params: { patientId }
    });
    
    console.log('📋 Fetched appointments response:', response.data);
    
    // Map appointments to ensure consistent frontend structure
    const appointments = (response.data.appointments || []).map(appt => ({
      _id: appt._id,
      patient: appt.patient?._id || patientId, // Fallback to patientId if not populated
      patientName: appt.patient?.name || 'Unknown', // Use populated patient name
      doctorId: appt.doctorId,
      doctorName: appt.doctorName || appt.doctorId || 'Unknown', // Fallback
      date: new Date(appt.date).toLocaleDateString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      dateISO: new Date(appt.date).toISOString(), // Keep ISO for sorting
      time: appt.time,
      reason: appt.reason,
      appointmentType: appt.appointmentType || 'general',
      status: appt.status || 'pending',
      bookingMode: appt.bookingMode || 'online',
      videoRoomUrl: appt.videoRoomUrl || null,
      createdAt: appt.createdAt,
      isVideoReady: !!(appt.videoRoomUrl && appt.status === 'confirmed'),
      timeFormatted: formatTime(appt.time),
    }));
    
    // Sort by date and time
    appointments.sort((a, b) => {
      const dateA = new Date(a.dateISO);
      const dateB = new Date(b.dateISO);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return compareTime(a.time, b.time);
    });
    
    console.log('📋 Processed appointments:', appointments.length);
    return appointments;
  } catch (error) {
    console.error('❌ Error fetching patient appointments:', error.response?.data || error.message);
    throw error;
  }
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