import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LabProvider, useLab } from "../context/LabContext";
import { ToastProvider } from "../context/ToastContext";
import axios from "axios"; // Add axios import

// Import Lab screens
import HomeScreen from "../components/HomeScreen";
import PatientSearch from "../lab/PatientSearch";
import UploadReport from "../lab/UploadReport";
import AddPatient from "../lab/AddPatient";
import Profile from "../lab/Profile";
import ReportDetail from "../lab/ReportDetail";
import PatientDetail from "../lab/PatientDetail";

const Stack = createNativeStackNavigator();

// Inner component that handles lab doctor data fetching
function LabAppInner({ labDoctorId, route }) {
  const { setLabWorkerData } = useLab();
  
  useEffect(() => {
    // Fetch lab doctor details
    const fetchLabDoctorDetails = async () => {
      try {
        // Use axios instead of fetch for consistent error handling
        const response = await axios.get(`http://192.168.1.48:5000/api/lab-doctors/${labDoctorId}`);
        const data = response.data;
        
        if (data.success) {
          setLabWorkerData(data.labDoctor);
        }
      } catch (error) {
        console.error("Error fetching lab doctor details:", error);
      }
    };
    
    if (labDoctorId) {
      fetchLabDoctorDetails();
    }
  }, [labDoctorId, setLabWorkerData]);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#2E86C1" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} initialParams={{ ...route?.params }} />
      <Stack.Screen name="PatientSearch" component={PatientSearch} options={{ title: "Search Patient" }} initialParams={{ ...route?.params }} />
      <Stack.Screen name="AddPatient" component={AddPatient} options={{ title: "Add Patient" }} initialParams={{ ...route?.params }} />
      <Stack.Screen name="UploadReport" component={UploadReport} options={{ title: "Upload Report" }} initialParams={{ ...route?.params }} />
      <Stack.Screen name="PatientDetail" component={PatientDetail} options={{ title: "Patient Detail" }} initialParams={{ ...route?.params }} />
      <Stack.Screen name="ReportDetail" component={ReportDetail} options={{ title: "Report Detail" }} initialParams={{ ...route?.params }} />
      <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile" }} initialParams={{ ...route?.params }} />
    </Stack.Navigator>
  );
}

// Wrapper component to pass route params to LabProvider
function LabApp({ route }) {
  // Extract lab doctor data from route params
  const { userData } = route?.params || {};
  const labDoctorId = userData?.id || userData?._id;
  
  console.log("LabApp called with route params:", route?.params);
  console.log("Extracted userData:", userData);
  console.log("Extracted labDoctorId:", labDoctorId);
  
  // Check if we have a labDoctorId
  if (!labDoctorId) {
    console.log("No labDoctorId provided to LabApp");
    // Return a simple view with error message
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Lab Doctor ID not provided. Please login again.</Text>
        <Button title="Go to Login" onPress={() => route?.navigation?.navigate('Auth')} />
      </View>
    );
  }
  
  return (
    <ToastProvider>
      <LabProvider labDoctorId={labDoctorId}>
        <LabAppInner labDoctorId={labDoctorId} route={route} />
      </LabProvider>
    </ToastProvider>
  );
}

export default LabApp;