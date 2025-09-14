import React from "react";

const DoctorContext = React.createContext(null);

export function DoctorProvider({ children }) {
  const [emergencies, setEmergencies] = React.useState([
    { id: "e1", title: "Chest pain - John Doe", priority: "high", time: Date.now() - 2 * 60 * 1000, attendingBy: null },
    { id: "e2", title: "Severe allergy - Mary P.", priority: "medium", time: Date.now() - 8 * 60 * 1000, attendingBy: null },
  ]);

  const [patients, setPatients] = React.useState([
    { id: "p1", name: "John Doe", gender: "M", age: 34, lastVisit: "2025-08-12", contact: "8431036155", history: "Hypertension, Seasonal Allergy" },
    { id: "p2", name: "Anita Kumari", gender: "F", age: 29, lastVisit: "2025-07-26", contact: "+91-9876543211", history: "Diabetes, Lower Back Pain" },
    { id: "p3", name: "Rajesh Singh", gender: "M", age: 45, lastVisit: "2025-08-10", contact: "+91-9876543212", history: "Asthma, Migraine" },
  ]);

  const [reports, setReports] = React.useState([
    { 
      id: "r1", 
      patientId: "p1", 
      title: "Blood Test Results", 
      content: "Complete Blood Count (CBC) analysis shows normal values for all parameters. White blood cells: 7,200/µL (normal range: 4,500-11,000). Red blood cells: 4.8 million/µL (normal range: 4.2-5.9). Hemoglobin: 14.2 g/dL (normal range: 12-15.5). All values are within normal limits. Patient shows good overall health indicators.",
      type: "lab", 
      status: "approved", 
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      attachments: [
        {
          name: "blood_test_report.pdf",
          type: "pdf",
          size: "2.1 MB",
          uri: "mock_pdf_uri"
        },
        {
          name: "lab_results_chart.jpg",
          type: "image",
          size: "1.8 MB",
          uri: "https://chatgpt.com/"
        }
      ]
    },
    { 
      id: "r2", 
      patientId: "p2", 
      title: "Chest X-Ray Analysis", 
      content: "Chest X-ray shows clear lung fields with no signs of pneumonia, tuberculosis, or other abnormalities. Heart size appears normal. No fluid accumulation in the pleural space. Bones and soft tissues appear normal. Overall assessment: Normal chest X-ray.",
      type: "scan", 
      status: "reviewed", 
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      attachments: [
        {
          name: "chest_xray_front.jpg",
          type: "image",
          size: "3.2 MB",
          uri: "https://via.placeholder.com/400x500/2196F3/FFFFFF?text=Chest+X-Ray+Front+View"
        },
        {
          name: "chest_xray_lateral.jpg",
          type: "image",
          size: "3.1 MB",
          uri: "https://via.placeholder.com/400x500/2196F3/FFFFFF?text=Chest+X-Ray+Lateral+View"
        }
      ]
    },
  ]);

  const [appointments, setAppointments] = React.useState([
    { 
      id: "a1", 
      patientId: "p1", 
      when: new Date().setHours(10, 0, 0, 0), 
      endTime: new Date().setHours(10, 30, 0, 0),
      type: 'consultation',
      duration: 30,
      status: "scheduled",
      createdAt: Date.now()
    },
    { 
      id: "a2", 
      patientId: "p2", 
      when: new Date().setHours(11, 0, 0, 0), 
      endTime: new Date().setHours(11, 30, 0, 0),
      type: 'follow-up',
      duration: 30,
      status: "scheduled",
      createdAt: Date.now()
    },
    {
      id: "a3",
      patientId: "custom-task",
      when: new Date().setHours(14, 0, 0, 0),
      endTime: new Date().setHours(15, 0, 0, 0),
      type: 'personal',
      duration: 60,
      status: "scheduled",
      customTitle: "Hospital Rounds",
      isCustomTask: true,
      createdAt: Date.now()
    },{
      id: "a4",
      patientId: "custom-task",
      when: new Date().setHours(14, 0, 0, 0),
      endTime: new Date().setHours(15, 0, 0, 0),
      type: 'personal',
      duration: 60,
      status: "scheduled",
      customTitle: "Hospital Rounds",
      isCustomTask: true,
      createdAt: Date.now()
    }
  ]);

  const [medicines, setMedicines] = React.useState([
    { id: "m1", name: "Paracetamol 500mg", stock: 240 },
    { id: "m2", name: "Amoxicillin 250mg", stock: 12 },
    { id: "m3", name: "Ibuprofen 400mg", stock: 0 },
    { id: "m4", name: "Aspirin 75mg", stock: 8 },
    { id: "m5", name: "Ciprofloxacin 500mg", stock: 0 },
    { id: "m6", name: "Metformin 500mg", stock: 156 },
    { id: "m7", name: "Omeprazole 20mg", stock: 0 },
    { id: "m8", name: "Amlodipine 5mg", stock: 67 },
    { id: "m9", name: "Cetirizine 10mg", stock: 5 },
    { id: "m10", name: "Azithromycin 250mg", stock: 0 },
    { id: "m11", name: "Prednisone 10mg", stock: 23 },
    { id: "m12", name: "Insulin Glargine", stock: 0 },
    { id: "m13", name: "Salbutamol Inhaler", stock: 15 },
    { id: "m14", name: "Diclofenac 50mg", stock: 0 },
    { id: "m15", name: "Pantoprazole 40mg", stock: 89 },
  ]);


  const [treatedLog, setTreatedLog] = React.useState([
    { id: "t1", patientId: "p1", date: "2025-08-12" },
  ]);

  const attendEmergency = (id, doctorId = "doctor-1") => {
    setEmergencies((prev) => prev.map((e) => (e.id === id ? { ...e, attendingBy: doctorId } : e)));
  };

  const approveReport = (id) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
  };

  const addReport = ({ patientId, title, content = "", type = "note", attachments = [] }) => {
    const id = `r${Date.now()}`;
    setReports((prev) => [{ id, patientId, title, content, type, attachments, status: "new", createdAt: Date.now() }, ...prev]);
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

  const addPatient = (patientData) => {
    const id = `p${Date.now()}`;
    const newPatient = {
      id,
      ...patientData
    };
    setPatients((prev) => [newPatient, ...prev]);
  };

  const updatePatientTreatment = (patientId) => {
    setPatients((prev) => prev.map(p => 
      p.id === patientId 
        ? { ...p, lastVisit: new Date().toISOString().slice(0, 10) }
        : p
    ));
  };


  const value = {
    emergencies,
    patients,
    reports,
    appointments,
    medicines,
    treatedLog,
    // actions
    attendEmergency,
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
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
}

export function useDoctor() {
  return React.useContext(DoctorContext);
}


