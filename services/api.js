import axios from 'axios';

const PATIENT_BASE_URL = 'http://192.168.117.168:3000';

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
    const response = await axios.post(`${PATIENT_BASE_URL}/auth/book-appointment`, appointmentData);
    console.log('Book appointment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error booking appointment:', error.response?.data || error.message);
    throw error;
  }
};

export const getPatientAppointments = async (patientId) => {
  try {
    if (!patientId) {
      throw new Error('Patient ID is required');
    }
    const response = await axios.get(`${PATIENT_BASE_URL}/auth/appointments`, {
      params: { patientId }
    });
    console.log('Fetched appointments response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient appointments:', error.response?.data || error.message);
    throw error;
  }
};

export const createVideoRoom = async (appointmentId, patientId, doctorId) => {
  try {
    if (!appointmentId || !patientId || !doctorId) {
      throw new Error('Missing required parameters for video room creation');
    }
    const response = await axios.post(`${PATIENT_BASE_URL}/auth/create-video-room`, {
      appointmentId,
      patientId,
      doctorId,
    });
    console.log('createVideoRoom response:', response.data, 'status:', response.status);
    if (!response.data.channelName || !response.data.token || !response.data.appId) {
      throw new Error('Invalid response from server: missing channelName, token, or appId');
    }
    return {
      channelName: response.data.channelName,
      token: response.data.token,
      appId: response.data.appId,
    };
  } catch (error) {
    console.error('Error creating video room:', error.response?.data || error.message, 'status:', error.response?.status);
    throw error;
  }
};