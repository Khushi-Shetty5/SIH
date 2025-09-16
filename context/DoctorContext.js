import React from "react";
import axios from "axios";

const DoctorContext = React.createContext(null);

export function DoctorProvider({ children }) {
  const [doctorData, setDoctorData] = React.useState(null);
  const [emergencies, setEmergencies] = React.useState([]);
  const [patients, setPatients] = React.useState([]);
  const [reports, setReports] = React.useState([]);
  const [appointments, setAppointments] = React.useState([]);
  const [medicines, setMedicines] = React.useState([]);
  const [treatedLog, setTreatedLog] = React.useState([]);

  React.useEffect(() => {
    console.log("Starting to fetch doctor data...");
    
    // API base URL - change this based on your environment
    const API_BASE_URL = "http://192.168.1.18:5000";
    
    // Fetch doctor data from API
    axios.get(`${API_BASE_URL}/api/doctors/68c81b568ecd90085701e053/`)
      .then(response => {
        console.log("Successfully received doctor data:", response.data);
        
        // Extract the doctor object from the response
        const doctor = response.data.doctor;
        setDoctorData(doctor);
        
        // Extract related data from the doctor response
        if (doctor) {
          // Handle patients with populated reports
          const patientsList = doctor.patients || [];
          console.log("Extracted patients from API:", patientsList);
          setPatients(patientsList);
          
          // Extract all reports from patients and also doctor's reports
          const allReports = [];
          
          // Add reports from each patient
          patientsList.forEach(patient => {
            if (patient.reports && Array.isArray(patient.reports)) {
              patient.reports.forEach(report => {
                allReports.push({
                  ...report,
                  patientId: patient._id || patient.id, // Ensure patientId is set
                  patientName: patient.name // Add patient name for easier reference
                });
              });
            }
          });
          
          // Add doctor-level reports if any
          if (doctor.reports && Array.isArray(doctor.reports)) {
            allReports.push(...doctor.reports);
          }
          
          console.log("Extracted reports from API:", allReports);
          setReports(allReports);
          
          setAppointments(doctor.appointments || []);
          setMedicines(doctor.medicines || []);
          setTreatedLog(doctor.treatedLog || []);
        }
      })
      .catch(error => {
        console.error("Error fetching doctor data:", error);
        
        // Log additional error details
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log("Error response data:", error.response.data);
          console.log("Error response status:", error.response.status);
          console.log("Error response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("Error request:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error message:", error.message);
        }
      });

    // Fetch emergency data separately
    axios.get(`${API_BASE_URL}/api/doctors/68c81b568ecd90085701e053/emergencies`)
      .then(response => {
        console.log("Successfully received emergency data:", response.data);
        
        // Extract emergencies from the response
        const emergencyData = response.data.emergencies || response.data || [];
        setEmergencies(emergencyData);
        console.log("Extracted emergencies from API:", emergencyData);
      })
      .catch(error => {
        console.error("Error fetching emergency data:", error);
        
        if (error.response) {
          console.log("Emergency API Error response data:", error.response.data);
          console.log("Emergency API Error response status:", error.response.status);
        } else if (error.request) {
          console.log("Emergency API Error request:", error.request);
        } else {
          console.log("Emergency API Error message:", error.message);
        }
        
        // Set empty array on error
        setEmergencies([]);
      });
  }, []); // Empty dependency array means this runs once on mount

  const attendEmergency = (id, doctorId = "doctor-1") => {
    setEmergencies((prev) => prev.map((e) => (e.id === id || e._id === id ? { ...e, attendingBy: doctorId, acknowledged: true } : e)));
  };

  const acknowledgeEmergency = (id) => {
    setEmergencies((prev) => prev.map((e) => (e.id === id || e._id === id ? { ...e, acknowledged: true } : e)));
  };

  const addEmergencyNote = (id, note) => {
    setEmergencies((prev) => prev.map((e) => 
      (e.id === id || e._id === id) 
        ? { ...e, notes: [...(e.notes || []), note] }
        : e
    ));
  };

  const approveReport = (id) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
  };

  const addReport = async ({ patientId, title, content = "", type = "note", attachments = [] }) => {
    try {
      const API_BASE_URL = "http://192.168.1.18:5000";
      
      // Prepare the report data for API
      const reportPayload = {
        title: title.trim(),
        content: content.trim(),
        type: type,
        attachments: attachments || [],
        status: "new",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Sending report data to API:', reportPayload);
      console.log('Patient ID:', patientId);
      
      // Send POST request to add report for specific patient
      const response = await axios.post(
        `${API_BASE_URL}/api/doctors/68c81b568ecd90085701e053/patients/${patientId}/reports`,
        reportPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Report added successfully:', response.data);
      
      // Update local state with the new report from server response
      const newReport = response.data.report || response.data;
      const reportWithPatientId = {
        ...newReport,
        patientId: patientId, // Ensure patientId is set
        patientName: patients.find(p => (p._id || p.id) === patientId)?.name || 'Unknown Patient'
      };
      
      setReports((prev) => [reportWithPatientId, ...prev]);
      
      return { success: true, report: reportWithPatientId };
      
    } catch (error) {
      console.error('Error adding report:', error);
      
      if (error.response) {
        console.log('API Error response data:', error.response.data);
        console.log('API Error response status:', error.response.status);
        return { 
          success: false, 
          error: error.response.data?.message || 'Failed to add report to server' 
        };
      } else if (error.request) {
        console.log('API Error request:', error.request);
        return { 
          success: false, 
          error: 'Network error - unable to reach server' 
        };
      } else {
        console.log('API Error message:', error.message);
        return { 
          success: false, 
          error: 'Failed to add report' 
        };
      }
    }
  };

  const prescribeMedicine = ({ patientId, medicineId }) => {
    setMedicines((prev) => prev.map((m) => (m.id === medicineId ? { ...m, stock: Math.max(0, m.stock - 1) } : m)));
  };

  const requestMedicineStock = ({ medicineId, quantity = 100 }) => {
    setMedicines((prev) => prev.map((m) => (m.id === medicineId ? { ...m, stock: m.stock + quantity } : m)));
  };

  const scheduleAppointment = ({ patientId, when, type = 'consultation', duration = 30, status = 'scheduled', customTitle = '', isCustomTask = false, endTime }) => {
    const id = `a${Date.now()}`;
    const appointmentEndTime = endTime || (when + (duration * 60 * 1000));
    setAppointments((prev) => [{
      id, 
      patientId, 
      when, 
      endTime: appointmentEndTime,
      type,
      duration,
      status,
      customTitle,
      isCustomTask,
      createdAt: Date.now()
    }, ...prev]);
  };
  const updateAppointment = (id, updates) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));
  };

  const rescheduleAppointment = (id, newWhen, newDuration = 30) => {
    const newEndTime = newWhen + (newDuration * 60 * 1000);
    setAppointments((prev) => prev.map((a) => 
      (a.id === id ? { 
        ...a, 
        when: newWhen, 
        endTime: newEndTime,
        duration: newDuration,
        status: 'scheduled' 
      } : a)
    ));
  };

  const completeAppointment = (id) => {
    const appt = appointments.find((a) => a.id === id);
    if (appt) setTreatedLog((prev) => [{ id: `t${Date.now()}`, patientId: appt.patientId, date: new Date(appt.when).toISOString().slice(0, 10) }, ...prev]);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a)));
  };

  const addPatient = async (patientData) => {
    try {
      const API_BASE_URL = "http://192.168.1.18:5000";
      
      // Prepare the patient data for API
      const patientPayload = {
        name: patientData.name.trim(),
        age: parseInt(patientData.age),
        gender: patientData.gender,
        contact: patientData.contact?.trim() || '',
        history: patientData.history?.trim() || '',
        lastVisit: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        reports: [] // Initialize empty reports array
      };
      
      console.log('Sending patient data to API:', patientPayload);
      
      // Send POST request to add patient
      const response = await axios.post(
        `${API_BASE_URL}/api/doctors/68c81b568ecd90085701e053/patients`,
        patientPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Patient added successfully:', response.data);
      
      // Update local state with the new patient from server response
      const newPatient = response.data.patient || response.data;
      setPatients((prev) => [newPatient, ...prev]);
      
      return { success: true, patient: newPatient };
      
    } catch (error) {
      console.error('Error adding patient:', error);
      
      if (error.response) {
        console.log('API Error response data:', error.response.data);
        console.log('API Error response status:', error.response.status);
        return { 
          success: false, 
          error: error.response.data?.message || 'Failed to add patient to server' 
        };
      } else if (error.request) {
        console.log('API Error request:', error.request);
        return { 
          success: false, 
          error: 'Network error - unable to reach server' 
        };
      } else {
        console.log('API Error message:', error.message);
        return { 
          success: false, 
          error: 'Failed to add patient' 
        };
      }
    }
  };

  const updatePatientTreatment = (patientId) => {
    console.log('Updating patient treatment for ID:', patientId);
    setPatients((prev) => prev.map(p => {
      const currentPatientId = p._id || p.id;
      if (currentPatientId === patientId) {
        console.log('Found patient to update:', p.name);
        return { 
          ...p, 
          lastVisit: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const addEmergency = async ({ doctorId, patientId, title, details, priority }) => {
    try {
      const API_BASE_URL = "http://192.168.1.18:5000";
      
      // Prepare the emergency data for API
      const emergencyPayload = {
        patientId,
        title: title.trim(),
        details: details.trim(),
        priority: priority.toLowerCase()
      };
      
      console.log('Sending emergency data to API:', emergencyPayload);
      
      // Send POST request to add emergency
      const response = await axios.post(
        `${API_BASE_URL}/api/doctors/${doctorId}/emergencies`,
        emergencyPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Emergency added successfully:', response.data);
      
      // Update local state with the new emergency from server response
      const newEmergency = response.data.emergency || response.data;
      setEmergencies((prev) => [newEmergency, ...prev]);
      
      return { success: true, emergency: newEmergency };
      
    } catch (error) {
      console.error('Error adding emergency:', error);
      
      if (error.response) {
        console.log('API Error response data:', error.response.data);
        console.log('API Error response status:', error.response.status);
        return { 
          success: false, 
          error: error.response.data?.message || 'Failed to add emergency to server' 
        };
      } else if (error.request) {
        console.log('API Error request:', error.request);
        return { 
          success: false, 
          error: 'Network error - unable to reach server' 
        };
      } else {
        console.log('API Error message:', error.message);
        return { 
          success: false, 
          error: 'Failed to add emergency' 
        };
      }
    }
  };

  const value = {
    doctorData,
    emergencies,
    patients,
    reports,
    appointments,
    medicines,
    treatedLog,
    // actions
    attendEmergency,
    acknowledgeEmergency,
    addEmergencyNote,
    approveReport,
    addReport,
    prescribeMedicine,
    requestMedicineStock,
    scheduleAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    completeAppointment,
    addPatient,
    updatePatientTreatment,
    addEmergency, // Add the new function to the context value
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
}

export function useDoctor() {
  return React.useContext(DoctorContext);
}


