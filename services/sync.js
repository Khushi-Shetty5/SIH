import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios'; // Commented out for offline testing

const PENDING_APPOINTMENTS_KEY = 'PENDING_SMS_APPOINTMENTS';

// Sync pending appointments to backend API with retry/failure handling
export const syncPendingAppointments = async () => {
  try {
    const stored = await AsyncStorage.getItem(PENDING_APPOINTMENTS_KEY);
    const pendings = stored ? JSON.parse(stored) : [];
    if (pendings.length === 0) return;

    const failed = [];
    for (const appt of pendings) {
      try {
        // Uncomment below for real backend syncing
        // await axios.post('https://your-backend.com/api/appointments', appt);

        // For now simulate network delay and success for local testing
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log(`Mock sync success for appointment ${appt.id}`);

        // Simulate updating local storage appointment status to 'approved'
        // This requires fetching all appointments, updating, and saving back
        const allStoredStr = await AsyncStorage.getItem(PENDING_APPOINTMENTS_KEY);
        if (allStoredStr) {
          let allStored = JSON.parse(allStoredStr);
          allStored = allStored.map(a => a.id === appt.id ? { ...a, status: 'approved' } : a);
          await AsyncStorage.setItem(PENDING_APPOINTMENTS_KEY, JSON.stringify(allStored));
        }
      } catch (error) {
        console.error('Sync failed for appointment:', appt.id, error.message);
        failed.push(appt);
      }
    }

    if (failed.length > 0) {
      await AsyncStorage.setItem(PENDING_APPOINTMENTS_KEY, JSON.stringify(failed));
      console.log(`${failed.length} appointments failed to sync`);
    } else {
      await AsyncStorage.removeItem(PENDING_APPOINTMENTS_KEY);
      console.log('All pending appointments synced successfully');
    }
  } catch (e) {
    console.error('Error during sync:', e.message);
  }
};

// Setup network listener to trigger sync on reconnect
export const setupSyncOnReconnect = () => {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncPendingAppointments();
    }
  });
};
