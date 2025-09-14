
import React from 'react';
import { FlatList } from 'react-native';
import MedicineCard from './MedicineCard';

const FileItem = ({ medicines, onRestock }) => {
  return (
    <FlatList
      data={medicines}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <MedicineCard
          medicine={item}
          isInventory={true}
          onRestock={onRestock}
        />
      )}
    />
  );
};

export default FileItem;