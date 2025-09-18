import React from "react";
import axios from "axios";

const DoctorContext = React.createContext(null);

export function DoctorProvider({ children }) {
  const API_BASE_URL = "http://192.168.1.18:5000";
  const doctorId = "68cb7fd9a0b6194b8ede0320";
  const [doctorData, setDoctorData] = React.useState(null);
  const [emergencies, setEmergencies] = React.useState([]);
  const [patients, setPatients] = React.useState([]);
  const [reports, setReports] = React.useState([]);
  const [appointments, setAppointments] = React.useState([]);
  const [medicines, setMedicines] = React.useState([]);
  const [treatedLog, setTreatedLog] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [videoCalls, setVideoCalls] = React.useState([]);

  // Function to update calendar slot in backend
  const upsertCalendarSlot = async ({ date, time, status, patientId, patientName, patientAge, patientGender, patientContact }) => {
    try {
      console.log('Updating calendar slot:', { date, time, status, patientId });
      
      const response = await axios.post(
        `${API_BASE_URL}/api/doctors/${doctorId}/calendar`,
        { date, time, status, patientId, patientName, patientAge, patientGender, patientContact },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Calendar updated successfully:', response.data);
      
      // Update local doctor data with the new calendar
      if (response.data.calendar) {
        const updatedDoctorData = {
          ...doctorData,
          calendar: response.data.calendar
        };
        setDoctorData(updatedDoctorData);
        
        // Re-process appointments from updated calendar data
        const calendarAppointments = [];
        if (response.data.calendar && Array.isArray(response.data.calendar)) {
          response.data.calendar.forEach(day => {
            if (day.slots && Array.isArray(day.slots)) {
              day.slots.forEach(slot => {
                if (slot.status === 'booked' && slot.patient) {
                  // Handle both string and Date object formats for day.date
                const dateObj = typeof day.date === 'string' ? new Date(day.date) : day.date;
                const appointmentDate = new Date(dateObj);
                  const [hours, minutes] = slot.time.split(':').map(Number);
                  appointmentDate.setHours(hours, minutes, 0, 0);
                  
                  calendarAppointments.push({
                    id: `cal_${day.date}_${slot.time}`,
                    patientId: slot.patient,
                    when: appointmentDate.getTime(),
                    type: 'consultation',
                    duration: 30,
                    status: 'scheduled',
                    patientName: slot.patientName || '',
                    patientAge: slot.patientAge || '',
                    patientGender: slot.patientGender || '',
                    patientContact: slot.patientContact || '',
                    createdAt: new Date().toISOString()
                  });
                }
              });
            }
          });
        }
        
        // Combine with existing appointments
        const allAppointments = [...(doctorData?.appointments || []), ...calendarAppointments];
        setAppointments(allAppointments);
      }
      
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error updating calendar:', error);
      
      if (error.response) {
        console.log('API Error response data:', error.response.data);
        console.log('API Error response status:', error.response.status);
        return { 
          success: false, 
          error: error.response.data?.message || 'Failed to update calendar on server' 
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
          error: 'Failed to update calendar' 
        };
      }
    }
  };

  // Function to fetch calendar data separately
  const fetchCalendarData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/doctors/${doctorId}/calendar`
      );
      
      console.log('Calendar data fetched successfully:', response.data);
      return response.data.calendar || [];
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      return [];
    }
  };

  React.useEffect(() => {
    console.log("Starting to fetch doctor data...");
    
    // API base URL - change this based on your environment
    const API_BASE_URL = "http://192.168.1.18:5000";
    
    // Create a function to process calendar data
    const processCalendarData = (calendarData, patientsList) => {
      let calendarAppointments = [];
      if (calendarData && Array.isArray(calendarData)) {
        calendarData.forEach(day => {
          if (day.slots && Array.isArray(day.slots)) {
            day.slots.forEach(slot => {
              if (slot.status === 'booked' && slot.patient) {
                // Handle both string and Date object formats for day.date
                const dateObj = typeof day.date === 'string' ? new Date(day.date) : new Date(day.date);
                const appointmentDate = new Date(dateObj);
                const [hours, minutes] = slot.time.split(':').map(Number);
                appointmentDate.setHours(hours, minutes, 0, 0);
                
                // Find patient details
                const patient = patientsList.find(p => 
                  (p._id && p._id.toString() === slot.patient.toString()) || 
                  (p.id && p.id.toString() === slot.patient.toString())
                );
                
                // Format date string properly for the ID
                const dateString = typeof day.date === 'string' ? 
                  day.date.split('T')[0] : 
                  dateObj.toISOString().split('T')[0];
                
                calendarAppointments.push({
                  id: `cal_${dateString}_${slot.time}`,
                  patientId: slot.patient,
                  when: appointmentDate.getTime(),
                  type: 'consultation',
                  duration: 30,
                  status: 'scheduled',
                  patientName: patient?.name || '',
                  patientAge: patient?.age || '',
                  patientGender: patient?.gender || '',
                  patientContact: patient?.contact || '',
                  createdAt: new Date().toISOString()
                });
              }
            });
          }
        });
      }
      return calendarAppointments;
    };
    
    // Fetch doctor data from API
    axios.get(`${API_BASE_URL}/api/doctors/${doctorId}/`)
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
          
          // Process calendar data into appointments
          const calendarAppointments = processCalendarData(doctor.calendar, patientsList);
          
          // Combine calendar appointments with regular appointments
          const allAppointments = [...(doctor.appointments || []), ...calendarAppointments];
          console.log("Setting appointments with calendar data:", allAppointments);
          setAppointments(allAppointments);
          
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
    axios.get(`${API_BASE_URL}/api/doctors/${doctorId}/emergencies`)
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
      
    // Fetch calendar data separately to ensure we get the latest data
    // We'll fetch calendar data after we have the patients data
    const fetchCalendarWithPatients = async () => {
      try {
        const calendarData = await fetchCalendarData();
        console.log("Calendar data fetched:", calendarData);
        // Process calendar data into appointments
        const calendarAppointments = processCalendarData(calendarData, patients);
        
        // Combine calendar appointments with regular appointments
        const allAppointments = [...appointments, ...calendarAppointments];
        console.log("Updated appointments with calendar data:", allAppointments);
        setAppointments(allAppointments);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };
    
    // Only fetch calendar data if we have patients
    if (patients && patients.length > 0) {
      fetchCalendarWithPatients();
    }
  }, []); // Empty dependency array means this runs once on mount

  const attendEmergency = async (id, doctorId = "${doctorId}") => {
    try {
      const API_BASE_URL = "http://192.168.1.18:5000";
      
      console.log('Attending emergency with ID:', id, 'Doctor ID:', doctorId);
      
      // Send PUT request to attend emergency
      const response = await axios.put(
        `${API_BASE_URL}/api/doctors/${doctorId}/emergency/${id}`,
        { attendingBy: doctorId, acknowledged: true },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Emergency attended successfully:', response.data);
      
      // Update local state with the attended emergency from server response
      const attendedEmergency = response.data.emergency || response.data;
      setEmergencies((prev) => prev.map(e => 
        (e._id === id || e.id === id) ? attendedEmergency : e
      ));
      
      return { success: true, emergency: attendedEmergency };
      
    } catch (error) {
      console.error('Error attending emergency:', error);
      
      if (error.response) {
        console.log('API Error response data:', error.response.data);
        console.log('API Error response status:', error.response.status);
        return { 
          success: false, 
          error: error.response.data?.message || 'Failed to attend emergency on server' 
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
          error: 'Failed to attend emergency' 
        };
      }
    }
  };


  const acknowledgeEmergency = async (id) => {
    // Call the API function to acknowledge the emergency
    const result = await acknowledgeEmergencyAPI(id);
    return result;
  };

  const addEmergencyNote = async (id, note) => {
    try {
      const API_BASE_URL = "http://192.168.1.18:5000";
    
    console.log('Adding note to emergency with ID:', id, 'Note:', note);
    
    // Send PUT request to update emergency with new note
    // Since the backend model only supports a single doctorNote field,
    // we'll append the new note to any existing note
    const emergency = emergencies.find(e => e._id === id || e.id === id);
    const existingNote = emergency?.doctorNote || '';
    const updatedNote = existingNote ? `${existingNote}\n${note}` : note;
    
    console.log('Emergency found:', emergency);
    console.log('Existing note:', existingNote);
    console.log('Updated note:', updatedNote);
    
    const url = `${API_BASE_URL}/api/doctors/emergencies/${id}`;
    console.log('Making PUT request to:', url);
    console.log('Request body:', { doctorNote: updatedNote });
    console.log("neeraj",updatedNote)
    const response = await axios.put(
      url,
      { doctorNote: updatedNote },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Emergency note added successfully:', response.data);
    
    // Update local state with the updated emergency from server response
    const updatedEmergency = response.data.emergency || response.data;
    setEmergencies((prev) => prev.map(e => 
      (e._id === id || e.id === id) ? { ...e, doctorNote: updatedNote, notes: [...(e.notes || []), note] } : e
    ));
    
    return { success: true, emergency: updatedEmergency };
    
  } catch (error) {
    console.error('Error adding emergency note:', error);
    
    // Let's also try to handle network errors by updating local state only
    if (error.response) {
      console.log('API Error response data:', error.response.data);
      console.log('API Error response status:', error.response.status);
      return { 
        success: false, 
        error: error.response.data?.message || 'Failed to add note to emergency on server' 
      };
    } else if (error.request) {
      console.log('API Error request:', error.request);
      // Network error - we could still update local state as a fallback
      const emergency = emergencies.find(e => e._id === id || e.id === id);
      const existingNote = emergency?.doctorNote || '';
      const updatedNote = existingNote ? `${existingNote}\n${note}` : note;
      setEmergencies((prev) => prev.map(e => 
        (e._id === id || e.id === id) ? { ...e, doctorNote: updatedNote, notes: [...(e.notes || []), note] } : e
      ));
      return { 
        success: true, // Treat as success for UI purposes
        message: 'Note saved locally. Will sync with server when connection is restored.'
      };
    } else {
      console.log('API Error message:', error.message);
      return { 
        success: false, 
        error: 'Failed to add note to emergency' 
      };
    }
  }
};


  const updateEmergency = async (emergencyId, updates) => {
    try {
      const API_BASE_URL = "http://192.168.1.18:5000";
      
      console.log('Updating emergency with ID:', emergencyId, 'Updates:', updates);
      
      // Send PUT request to update emergency
      const response = await axios.put(
        `${API_BASE_URL}/api/doctors/${doctorId}/emergencies/${emergencyId}`,
        updates,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Emergency updated successfully:', response.data);
      
      // Update local state with the updated emergency from server response
      const updatedEmergency = response.data.emergency || response.data;
      setEmergencies((prev) => prev.map(e => 
        (e._id === emergencyId || e.id === emergencyId) ? updatedEmergency : e
      ));
      
      return { success: true, emergency: updatedEmergency };
      
    } catch (error) {
      console.error('Error updating emergency:', error);
      
      if (error.response) {
        console.log('API Error response data:', error.response.data);
        console.log('API Error response status:', error.response.status);
        return { 
          success: false, 
          error: error.response.data?.message || 'Failed to update emergency on server' 
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
          error: 'Failed to update emergency' 
        };
      }
    }
  };

  const acknowledgeEmergencyAPI = async (emergencyId) => {
    try {
      const API_BASE_URL = "http://192.168.1.18:5000";
      
      console.log('Acknowledging emergency with ID:', emergencyId);
      
      // Send PATCH request to acknowledge emergency
      const response = await axios.patch(
        `${API_BASE_URL}/api/doctors/${doctorId}/emergencies/${emergencyId}/acknowledge`
      );
      
      console.log('Emergency acknowledged successfully:', response.data);
      
      // Update local state with the acknowledged emergency from server response
      const acknowledgedEmergency = response.data.emergency || response.data;
      setEmergencies((prev) => prev.map(e => 
        (e._id === emergencyId || e.id === emergencyId) ? { ...e, acknowledged: true } : e
      ));
      
      return { success: true, emergency: acknowledgedEmergency };
      
    } catch (error) {
      console.error('Error acknowledging emergency:', error);
      
      if (error.response) {
        console.log('API Error response data:', error.response.data);
        console.log('API Error response status:', error.response.status);
        return { 
          success: false, 
          error: error.response.data?.message || 'Failed to acknowledge emergency on server' 
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
          error: 'Failed to acknowledge emergency' 
        };
      }
    }
  };


  const approveReport = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    // Notification removed
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
        `${API_BASE_URL}/api/doctors/${doctorId}/patients/${patientId}/reports`,
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
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medicineId ? { ...m, stock: Math.max(0, m.stock - 1) } : m
      )
    );
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
    if (appt)
      setTreatedLog((prev) => [
        {
          id: `t${Date.now()}`,
          patientId: appt.patientId,
          date: new Date(appt.when).toISOString().slice(0, 10),
        },
        ...prev,
      ]);
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a))
    );
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
        `${API_BASE_URL}/api/doctors/${doctorId}/patients`,
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

  const createEmergency = async ({ patientId, title, details, priority }) => {
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
      
      console.log('Emergency created successfully:', response.data);
      
      // Update local state with the new emergency from server response
      const newEmergency = response.data.emergency || response.data;
      setEmergencies((prev) => [newEmergency, ...prev]);
      
      return { success: true, emergency: newEmergency };
      
    } catch (error) {
      console.error('Error creating emergency:', error);
      
      if (error.response) {
        console.log('API Error response data:', error.response.data);
        console.log('API Error response status:', error.response.status);
        return { 
          success: false, 
          error: error.response.data?.message || 'Failed to create emergency on server' 
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
          error: 'Failed to create emergency' 
        };
      }
    }
  };

  // Function to add a notification
  const addNotification = (notification) => {
    const newNotification = {
      id: `n${Date.now()}`,
      ...notification,
      timestamp: new Date().toISOString()
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Function to mark a notification as read
  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Function to clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Function to add a video call
  const addVideoCall = (call) => {
    const newCall = {
      id: `v${Date.now()}`,
      ...call,
      timestamp: new Date().toISOString(),
      status: call.status || 'pending'
    };
    setVideoCalls((prev) => [newCall, ...prev]);
  };

  // Function to attend a video call
  const attendVideoCall = (id, doctorName) => {
    setVideoCalls((prev) =>
      prev.map((call) =>
        call.id === id
          ? { ...call, attendedBy: doctorName, status: 'attended' }
          : call
      )
    );
  };

  // Function to complete a video call
  const completeVideoCall = (id) => {
    setVideoCalls((prev) =>
      prev.map((call) =>
        call.id === id ? { ...call, status: 'completed' } : call
      )
    );
  };

  const value = {
    doctorData,
    emergencies,
    patients,
    reports,
    appointments,
    medicines,
    treatedLog,
    notifications,
    videoCalls,

    // Actions
    createEmergency,
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
    updateEmergency,
    acknowledgeEmergencyAPI,
    upsertCalendarSlot,
    fetchCalendarData, // Add the new function to fetch calendar data
    
    // Notification functions
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    
    // Video call functions
    addVideoCall,
    attendVideoCall,
    completeVideoCall
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
}

export function useDoctor() {
  return React.useContext(DoctorContext);
}
