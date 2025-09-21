import axios from 'axios';
import { getUser } from './storage';

const PATIENT_BASE_URL = 'http://172.20.10.7:5000';

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
