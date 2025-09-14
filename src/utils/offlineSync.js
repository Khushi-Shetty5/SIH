import * as FileSystem from 'expo-file-system';

export const queueAction = async (action) => {
  try {
    let queue = [];
    try {
      const stored = await FileSystem.readAsStringAsync(
        `${FileSystem.documentDirectory}pharmacy_offlineQueue.json`,
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      queue = JSON.parse(stored);
    } catch (e) {
      console.log('No offline queue found');
    }
    queue.push(action);
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}pharmacy_offlineQueue.json`,
      JSON.stringify(queue),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  } catch (e) {
    console.error('Error queuing action:', e);
  }
};

export const syncQueue = async () => {
  try {
    const queue = await FileSystem.readAsStringAsync(
      `${FileSystem.documentDirectory}pharmacy_offlineQueue.json`,
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    if (queue) {
      console.log('Syncing queue:', JSON.parse(queue));
      // Process queue, send to server (stub)
      await FileSystem.deleteAsync(`${FileSystem.documentDirectory}pharmacy_offlineQueue.json`, { idempotent: true });
    }
  } catch (e) {
    console.log('No queue to sync');
  }
};