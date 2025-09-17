import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://192.168.1.18:5000/api/doctors";

const LabContext = createContext(null);

export function LabProvider({ children }) {
  const [labWorker, setLabWorker] = useState({
    id: "68c81b568ecd90085701e053", // Using a valid ObjectId format
    name: "Dr. A. Kumar",
    email: "a.kumar@labhealth.org",
    role: "Lab Worker",
  });

  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch patients from backend
  const fetchPatients = useCallback(async (doctorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/patients/${doctorId}`);
      setPatients(response.data.patients || []);
      
      // Extract reports from patients
      const allReports = response.data.patients.flatMap(patient => 
        (patient.reports || []).map(report => ({
          ...report,
          patientId: patient._id,
          patientName: patient.name
        }))
      );
      setReports(allReports);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add patient to backend
  const addPatient = useCallback(async (patientData, doctorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/add-patient`, {
        ...patientData,
        doctorId
      });
      
      // Add the new patient to the local state
      setPatients(prev => [response.data.patient, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error("Error adding patient:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload report to backend
  const uploadReport = useCallback(async (reportData, doctorId) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Sending report data to backend:", { ...reportData, doctorId });
      const response = await axios.post(`${API_BASE_URL}/upload-report`, {
        ...reportData,
        uploadedBy: labWorker.id, // Now using a valid ObjectId
        uploadedByRole: "LabDoctor"
      });
      
      console.log("Received response from backend:", response.data);
      
      // Add the new report to the local state
      const newReport = {
        ...response.data.report,
        patientName: patients.find(p => p._id === response.data.report.patient)?.name || "Unknown Patient"
      };
      setReports(prev => [newReport, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error("Error uploading report:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [labWorker.id, patients]);

  // Add manual report
  const addManualReport = useCallback(async (patientId, title, content, doctorId) => {
    const reportData = {
      title: title || "Manual Report",
      content,
      patientId,
      files: []
    };
    
    return await uploadReport(reportData, doctorId);
  }, [uploadReport]);

  // Add PDF report
  const addPdfReport = useCallback(async (patientId, title, fileUri, fileName, doctorId) => {
    const reportData = {
      title: title || fileName || "PDF Report",
      content: "",
      patientId,
      files: [fileUri]
    };
    
    return await uploadReport(reportData, doctorId);
  }, [uploadReport]);

  const logout = useCallback(() => {
    // For now, just clear worker name minimally
    setLabWorker((prev) => ({ ...prev, name: "" }));
  }, []);

  // Initial data fetch
  useEffect(() => {
    // Using a default doctor ID for demonstration
    // In a real app, this would come from authentication
    const defaultDoctorId = "68c81b568ecd90085701e053";
    fetchPatients(defaultDoctorId);
  }, [fetchPatients]);

  const value = useMemo(() => ({
    labWorker,
    patients,
    reports,
    loading,
    error,
    addPatient,
    addManualReport,
    addPdfReport,
    logout,
    fetchPatients
  }), [labWorker, patients, reports, loading, error, addPatient, addManualReport, addPdfReport, logout, fetchPatients]);

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
}

export function useLab() {
  const ctx = useContext(LabContext);
  if (!ctx) throw new Error("useLab must be used within LabProvider");
  return ctx;
}