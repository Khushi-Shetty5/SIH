import React from "react";

const DoctorContext = React.createContext(null);

export function DoctorProvider({ children }) {
  const [emergencies, setEmergencies] = React.useState([
    {
      id: "e1",
      title: "Chest pain - John Doe",
      priority: "high",
      time: Date.now() - 2 * 60 * 1000,
      attendingBy: null,
    },
    {
      id: "e2",
      title: "Severe allergy - Mary P.",
      priority: "medium",
      time: Date.now() - 8 * 60 * 1000,
      attendingBy: null,
    },
    {
      id: "e3",
      title: "Headache - Alex R.",
      priority: "low",
      time: Date.now() - 10 * 60 * 1000,
      attendingBy: null,
    },
  ]);

  const [patients, setPatients] = React.useState([
    {
      id: "p1",
      name: "John Doe",
      gender: "M",
      age: 34,
      lastVisit: "2025-08-12",
    },
    {
      id: "p2",
      name: "Anita Kumari",
      gender: "F",
      age: 29,
      lastVisit: "2025-07-26",
    },
  ]);

  const [reports, setReports] = React.useState([
    {
      id: "r1",
      patientId: "p1",
      title: "CBC.pdf",
      type: "pdf",
      status: "new",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    {
      id: "r2",
      patientId: "p2",
      title: "X-Ray.png",
      type: "image",
      status: "reviewed",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: "r3",
      patientId: "p2",
      title: "MRI.pdf",
      type: "pdf",
      status: "new",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
  ]);

  const [appointments, setAppointments] = React.useState([
    {
      id: "a1",
      patientId: "p1",
      when: new Date().setHours(10, 0, 0, 0),
      status: "scheduled",
    },
    {
      id: "a2",
      patientId: "p2",
      when: new Date().setHours(10, 30, 0, 0),
      status: "scheduled",
    },
  ]);

  const [medicines, setMedicines] = React.useState([
    { id: "m1", name: "Paracetamol 500mg", stock: 240 },
    { id: "m2", name: "Amoxicillin 250mg", stock: 12 },
  ]);

  const [treatedLog, setTreatedLog] = React.useState([
    { id: "t1", patientId: "p1", date: "2025-08-12" },
  ]);

  const [notifications, setNotifications] = React.useState([]);
  
  const [videoCalls, setVideoCalls] = React.useState([
    // Dummy request from a patient for testing
    { id: "VC1", patientId: "p1", patientName: "John Doe", time: Date.now() - 60000, attendedBy: null },

  ]);

  // ---------------- Notifications ----------------
  const addNotification = (msg) => {
    setNotifications((prev) => [
      { id: Date.now().toString(), msg, time: Date.now() },
      ...prev,
    ]);
  };

// ---------------- Video Call ----------------
const requestVideoCall = (patientId) => {
  const patient = patients.find((p) => p.id === patientId);
  const patientName = patient ? patient.name : "Unknown Patient";

  const id = Date.now().toString();
  setVideoCalls((prev) => [
    {
      id,
      patientId,
      patientName,
      time: Date.now(),
      attendedBy: null,
    },
    ...prev,
  ]);
  addNotification(`📞 Patient ${patientName} (${patientId}) requested a video call`);
};


const attendVideoCall = (id, doctorId = "Dr. Robin") => {
  setVideoCalls((prev) =>
    prev.map((v) =>
      v.id === id ? { ...v, attendedBy: doctorId } : v
    )
  );
  addNotification(`✅ Video call ${id} is being attended by ${doctorId}`);
};


// ---------------- Emergencies ----------------
const createEmergency = ({ title, priority = "high", patientId = "unknown" }) => {
  const id = `e${Date.now()}`;

  // get patient name from patients array
  const patient = patients.find((p) => p.id === patientId);
  const patientName = patient ? patient.name : "Unknown Patient";

  const newEmergency = {
    id,
    title: `${title} - ${patientName}`, // title includes patient name
    priority,
    time: Date.now(),
    attendingBy: null,
    patientId,
  };

  setEmergencies((prev) => [newEmergency, ...prev]);
  addNotification(`🚨 Emergency reported for ${patientName}`);
};

const attendEmergency = (id, doctorId = "Dr. Meena Verma") => {
  setEmergencies((prev) =>
    prev.map((e) => (e.id === id ? { ...e, attendingBy: doctorId } : e))
  );

  const emergency = emergencies.find((e) => e.id === id);
  const patient = patients.find((p) => p.id === emergency?.patientId);
  const patientName = patient ? patient.name : "Unknown Patient";

  addNotification(`Emergency for ${patientName} is being attended by ${doctorId}`);
};



  // ---------------- Lab Reports ----------------
  const approveReport = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    // Notification removed
  };

  const addReport = ({
    patientId,
    title,
    type = "note",
    isEmergency = false,
  }) => {
    const id = `r${Date.now()}`;
    setReports((prev) => [
      {
        id,
        patientId,
        title,
        type,
        status: "new",
        isEmergency,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    // Notification removed
  };

  // ---------------- Medicines ----------------
  const prescribeMedicine = ({ patientId, medicineId }) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medicineId ? { ...m, stock: Math.max(0, m.stock - 1) } : m
      )
    );
  };

  const requestMedicineStock = ({ medicineId, quantity = 100 }) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medicineId ? { ...m, stock: m.stock + quantity } : m
      )
    );
  };

  // ---------------- Appointments ----------------
  const scheduleAppointment = ({ patientId, when }) => {
    const id = `a${Date.now()}`;
    setAppointments((prev) => [
      { id, patientId, when, status: "scheduled" },
      ...prev,
    ]);
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

  // ---------------- Export Context Value ----------------
  const value = {
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
    approveReport,
    addReport,
    prescribeMedicine,
    requestMedicineStock,
    scheduleAppointment,
    completeAppointment,
    requestVideoCall,
    attendVideoCall,
    addNotification,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
}

export function useDoctor() {
  return React.useContext(DoctorContext);
}
