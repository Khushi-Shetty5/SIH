import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import FileItem from '../components/FileItem';
import FloatingChatButton from '../components/FloatingChatButton';
import { strings } from '../constants/strings';

export default function RecordsScreen() {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'Blood Test Report.pdf',
      type: 'pdf',
      date: '2024-08-10'
    },
    {
      id: 2,
      name: 'X-Ray Chest.jpg',
      type: 'image',
      date: '2024-08-08'
    },
    {
      id: 3,
      name: 'Prescription.pdf',
      type: 'pdf',
      date: '2024-08-05'
    },
    {
      id: 4,
      name: 'ECG Report.pdf',
      type: 'pdf',
      date: '2024-08-03'
    },
    {
      id: 5,
      name: 'MRI Scan.jpg',
      type: 'image',
      date: '2024-07-28'
    }
  ]);

  const handleFilePress = (file) => {
    console.log('Opening file:', file.name);
    Alert.alert('File', `Opening ${file.name}`);
  };

  const handleUploadFile = () => {
    console.log('Upload file pressed');
    Alert.alert(
      'Upload File',
      'File upload functionality would be implemented here',
      [{ text: 'OK' }]
    );
  };

  const handleChatPress = () => {
    console.log('Chat button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handleUploadFile}
        >
          <Icon name="upload" size={20} color="#fff" />
          <Text style={styles.uploadButtonText}>{strings.uploadFile}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {files.length > 0 ? (
          files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onPress={() => handleFilePress(file)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="file-document-outline" size={64} color="#9E9E9E" />
            <Text style={styles.emptyStateText}>{strings.noRecords}</Text>
          </View>
        )}
      </ScrollView>

      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  uploadButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 48,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 16,
  },
});
