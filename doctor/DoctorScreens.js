import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useDoctor } from "../context/DoctorContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export function EmergencyScreen() {
  const { emergencies, attendEmergency } = useDoctor();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current Emergencies</Text>
      <Card>
        {emergencies.map((e) => (
          <Row key={e.id} title={e.title} subtitle={`${Math.round((Date.now() - e.time) / 60000)} min ago • ${e.priority}`} action={<Button text={e.attendingBy ? "Attending" : "Attend"} color="#dc3545" onPress={() => attendEmergency(e.id)} />} />
        ))}
      </Card>
    </View>
  );
}

export function PatientList({ navigation }) {
  const [q, setQ] = React.useState("");
  const { patients } = useDoctor();
  const filtered = patients.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patients</Text>
      <View style={styles.searchRow}>
        <Ionicons name="search" color="#6c757d" size={16} />
        <TextInput style={styles.input} placeholder="Search patients" value={q} onChangeText={setQ} />
      </View>
      <Card>
        {filtered.map((p) => (
          <TouchableOpacity key={p.id} onPress={() => navigation.navigate("PatientProfile", { id: p.id })}>
            <Row title={p.name} subtitle={`${p.gender} • ${p.age} • Last visit: ${p.lastVisit}`} />
          </TouchableOpacity>
        ))}
      </Card>
    </View>
  );
}

export function PatientProfile({ route }) {
  const { patients, reports, addReport } = useDoctor();
  const { id } = route.params || {};
  const patient = patients.find((p) => p.id === id);
  const myReports = reports.filter((r) => r.patientId === id);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patient Profile</Text>
      <Card>
        <Row title="Name" subtitle={patient?.name || "Unknown"} />
        <Row title="Contact" subtitle={"+91-0000000000"} />
        <Row title="History" subtitle={"Hypertension, Allergy"} />
      </Card>
      <Text style={styles.subHeader}>Reports</Text>
      <Card>
        {myReports.map((r) => (
          <Row key={r.id} title={r.title} subtitle={new Date(r.createdAt).toISOString().slice(0,10)} action={<Button text="View" />} />
        ))}
      </Card>
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <Button text="Add Report" onPress={() => addReport({ patientId: id, title: "Doctor Note" })} />
        <View style={{ width: 8 }} />
        <Button text="Update Treatment" type="secondary" />
      </View>
    </View>
  );
}

export function LabReports() {
  const { reports, approveReport } = useDoctor();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lab Reports</Text>
      <Card>
        {reports.map((r) => (
          <Row key={r.id} title={r.title} subtitle={`${r.status} • ${new Date(r.createdAt).toLocaleDateString()}`} action={<Button text={r.status === "approved" ? "Approved" : "Approve"} onPress={() => approveReport(r.id)} />} />
        ))}
      </Card>
    </View>
  );
}

export function Medicines() {
  const { medicines, prescribeMedicine, requestMedicineStock } = useDoctor();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medicines</Text>
      <Card>
        {medicines.map((m) => (
          <Row key={m.id} title={m.name} subtitle={`In stock: ${m.stock}`} action={
            <View style={{ flexDirection: "row" }}>
              <Button text="Prescribe" onPress={() => prescribeMedicine({ patientId: "p1", medicineId: m.id })} />
              <View style={{ width: 6 }} />
              {m.stock < 20 ? <Button text="Request" color="#dc3545" onPress={() => requestMedicineStock({ medicineId: m.id, quantity: 100 })} /> : null}
            </View>
          } />
        ))}
      </Card>
    </View>
  );
}


export function Calendar() {
  const { patients, appointments, scheduleAppointment, completeAppointment, treatedLog } = useDoctor();
  const [time, setTime] = React.useState("");
  const [patientId, setPatientId] = React.useState(patients[0]?.id || "");
  const today = new Date();
  const todayAppts = appointments.filter((a) => new Date(a.when).toDateString() === today.toDateString());

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      <Text style={styles.subHeader}>Today's Queue</Text>
      <Card>
        {todayAppts.map((a) => {
          const p = patients.find((x) => x.id === a.patientId);
          return (
            <Row key={a.id} title={`${new Date(a.when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${p?.name || a.patientId}`} subtitle={a.status} action={<Button text="Complete" onPress={() => completeAppointment(a.id)} />} />
          );
        })}
      </Card>

      <Text style={styles.subHeader}>Schedule New</Text>
      <View style={styles.searchRow}>
        <TextInput style={styles.input} placeholder="HH:MM 24h e.g. 15:30" value={time} onChangeText={setTime} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
        {patients.map((p) => (
          <TouchableOpacity key={p.id} onPress={() => setPatientId(p.id)} style={[styles.chip, patientId === p.id ? styles.chipActive : null]}>
            <Text style={[styles.chipText, patientId === p.id ? { color: "#fff" } : null]}>{p.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button text="Add Appointment" onPress={() => {
        const [hh, mm] = time.split(":");
        if (hh != null && mm != null) {
          const d = new Date();
          d.setHours(Number(hh), Number(mm), 0, 0);
          scheduleAppointment({ patientId, when: d.getTime() });
        }
      }} />

      <Text style={styles.subHeader}>Treated Patients</Text>
      <Card>
        {treatedLog.map((t) => {
          const p = patients.find((x) => x.id === t.patientId);
          return <Row key={t.id} title={p?.name || t.patientId} subtitle={t.date} />;
        })}
      </Card>

      <Text style={styles.note}>Day/Week/Month views to be implemented.</Text>
    </View>
  );
}

export function DoctorProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doctor Profile</Text>
      <Card>
        <Row title="Name" subtitle="Dr. Meera Verma" />
        <Row title="Specialization" subtitle="Cardiology" />
        <Row title="Availability" subtitle="Mon-Fri • 9AM-5PM" action={<Button text="Set" />} />
        <Row title="Status" subtitle="Available" action={<Button text="Toggle" type="secondary" />} />
      </Card>
    </View>
  );
}

function Card({ children }) {
  return (
    <View style={styles.card}>{children}</View>
  );
}

function Row({ title, subtitle, action }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle ? <Text style={styles.itemSub}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

function Button({ text, onPress, color, type }) {
  const isSecondary = type === "secondary";
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, isSecondary ? styles.btnSecondary : styles.btnPrimary, color ? { backgroundColor: color } : null]}>
      <Text style={[styles.btnText, isSecondary ? { color: "#2E86C1" } : null]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  header: { fontSize: 20, fontWeight: "800", color: "#2E4053", marginBottom: 10 },
  subHeader: { marginTop: 14, marginBottom: 8, fontWeight: "700", color: "#2E4053" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  itemTitle: { color: "#2E4053", fontWeight: "700" },
  itemSub: { color: "#6c757d", marginTop: 4, fontSize: 12 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnPrimary: { backgroundColor: "#2E86C1" },
  btnSecondary: { backgroundColor: "#e8f1f9", borderWidth: 1, borderColor: "#cfe3f5" },
  btnText: { color: "#fff", fontWeight: "700" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  input: { marginLeft: 8, flex: 1 },
  note: { color: "#6c757d", fontSize: 12, marginTop: 8 },
});


