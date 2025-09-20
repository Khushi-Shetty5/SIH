import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function FileItem({ file, onPress }) {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return 'file-pdf-box';
      case 'image': return 'file-image';
      case 'document': return 'file-document';
      default: return 'file';
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case 'pdf': return '#F44336';
      case 'image': return '#4CAF50';
      case 'document': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  return (
    <TouchableOpacity style={styles.fileItem} onPress={onPress}>
      <Icon 
        name={getFileIcon(file.type)} 
        size={32} 
        color={getFileColor(file.type)} 
        style={styles.fileIcon} 
      />
      <View style={styles.fileDetails}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Text style={styles.fileDate}>{file.date}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#9E9E9E" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileDate: {
    fontSize: 12,
    color: '#666',
  },
});
