import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Modal, Portal, Button, Provider, TextInput as PaperInput } from "react-native-paper";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); 

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert("Confirm", "Delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "users", id));
          setUsers(users.filter((u) => u.id !== id));
        },
      },
    ]);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Validation Error", "All fields are required!");
      return;
    }

    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, { name, email, phone });

      setUsers(users.map(u => u.id === editingUser.id ? { ...u, name, email, phone } : u));
      setModalVisible(false);
      setEditingUser(null);
      setName(""); setEmail(""); setPhone("");
      Alert.alert("Success", "User updated successfully!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not update user");
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      let aVal = a[sortKey].toLowerCase();
      let bVal = b[sortKey].toLowerCase();
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.heading}>Registered Users</Text>
        <TextInput
          style={styles.input}
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
          <Button mode="contained" onPress={() => handleSort("name")}>
            Sort Name {sortKey === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </Button>
          <Button mode="contained" onPress={() => handleSort("email")}>
            Sort Email {sortKey === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </Button>
          <Button mode="contained" onPress={() => handleSort("phone")}>
            Sort Phone {sortKey === "phone" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
          </Button>
        </View>

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Phone: {item.phone}</Text>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                  <Text style={{ color: "white" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Text style={{ color: "white" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Edit User Modal */}
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <Text style={styles.modalTitle}>Edit User</Text>
            <PaperInput label="Name" value={name} onChangeText={setName} mode="outlined" style={{ marginBottom: 10 }} />
            <PaperInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={{ marginBottom: 10 }} />
            <PaperInput label="Phone" value={phone} onChangeText={setPhone} mode="outlined" style={{ marginBottom: 10 }} keyboardType="numeric"/>
            <Button mode="contained" onPress={handleUpdate} style={{ marginBottom: 5 }}>Update</Button>
            <Button mode="outlined" onPress={() => setModalVisible(false)}>Cancel</Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 15 },
  card: { backgroundColor: "#f9f9f9", padding: 15, marginBottom: 10, borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 } },
  name: { fontSize: 18, fontWeight: "bold" },
  editBtn: { backgroundColor: "#007bff", padding: 8, borderRadius: 5, marginRight: 10 },
  deleteBtn: { backgroundColor: "red", padding: 8, borderRadius: 5 },
  modal: { backgroundColor: "white", padding: 20, margin: 20, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 }
});
