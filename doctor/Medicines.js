import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

export default function Medicines({ navigation }) {
  const { medicines } = useDoctor();

  const [searchQuery, setSearchQuery] = React.useState("");

  // Dummy medicine data
  const dummyMedicines = [
    { id: "1", name: "Paracetamol 500mg", stock: 150 },
    { id: "2", name: "Amoxicillin 250mg", stock: 75 },
    { id: "3", name: "Ibuprofen 200mg", stock: 200 },
    { id: "4", name: "Aspirin 100mg", stock: 120 },
    { id: "5", name: "Omeprazole 20mg", stock: 90 },
    { id: "6", name: "Lisinopril 10mg", stock: 80 },
    { id: "7", name: "Metformin 500mg", stock: 110 },
    { id: "8", name: "Atorvastatin 20mg", stock: 65 },
    { id: "9", name: "Levothyroxine 50mcg", stock: 95 },
    { id: "10", name: "Amlodipine 5mg", stock: 130 }
  ];

  // Use dummy data if no medicines from context
  const medicineList = medicines && medicines.length > 0 ? medicines : dummyMedicines;

  const filteredMedicines = medicineList.filter(medicine => 
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMedicineItem = ({ item }) => (
    <View style={styles.medicineCard}>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineStock}>In Stock: {item.stock}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.prescribeButton}>
          <MaterialIcons name="prescription" size={16} color="#fff" />
          <Text style={styles.buttonText}>Prescribe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.requestButton}>
          <MaterialIcons name="inventory" size={16} color="#fff" />
          <Text style={styles.buttonText}>Request Stock</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredMedicines}
        renderItem={renderMedicineItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="medication" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No medicines found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  medicineCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medicineInfo: {
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E4053",
  },
  medicineStock: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  prescribeButton: {
    flex: 1,
    backgroundColor: "#2E86C1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  requestButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "600",
  },
});