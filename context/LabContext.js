import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

const LabContext = createContext(null);

export function LabProvider({ children }) {
  const [labWorker, setLabWorker] = useState({
    id: "LW001",
    name: "Dr. A. Kumar",
    email: "a.kumar@labhealth.org",
    role: "Lab Worker",
  });

  const [patients, setPatients] = useState([
    { id: "P001", name: "ravi Sharma", age: 32, gender: "Male", contact: "9876543210" },
    { id: "P002", name: "Neha Verma", age: 28, gender: "Female", contact: "9876501234" },
  ]);

  const [reports, setReports] = useState([
    {
      id: "R1",
      patientId: "P001",
      type: "manual",
      title: "Blood Test",
      content: "Hemoglobin: 13.5 g/dL; WBC: 6k",
      uploadedBy: "LW001",
      uploadedByName: "Dr. A. Kumar",
      createdAt: new Date().toISOString(),
    },
  ]);

  const addPatient = useCallback((newPatient) => {
    setPatients((prev) => [{ ...newPatient }, ...prev]);
  }, []);

  const addManualReport = useCallback((patientId, title, content) => {
    const report = {
      id: `R${Date.now()}`,
      patientId,
      type: "manual",
      title: title || "Manual Report",
      content,
      uploadedBy: labWorker.id,
      uploadedByName: labWorker.name,
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [report, ...prev]);
  }, [labWorker]);

  const addPdfReport = useCallback((patientId, title, uri, name) => {
    const report = {
      id: `R${Date.now()}`,
      patientId,
      type: "pdf",
      title: title || name || "PDF Report",
      fileUri: uri,
      fileName: name,
      uploadedBy: labWorker.id,
      uploadedByName: labWorker.name,
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [report, ...prev]);
  }, [labWorker]);

  const logout = useCallback(() => {
    // For now, just clear worker name minimally
    setLabWorker((prev) => ({ ...prev, name: "" }));
  }, []);

  const value = useMemo(() => ({
    labWorker,
    patients,
    reports,
    addPatient,
    addManualReport,
    addPdfReport,
    logout,
  }), [labWorker, patients, reports, addPatient, addManualReport, addPdfReport, logout]);

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
}

export function useLab() {
  const ctx = useContext(LabContext);
  if (!ctx) throw new Error("useLab must be used within LabProvider");
  return ctx;
}

