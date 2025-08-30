import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Registration({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (name.length < 3) {
      Alert.alert("Validation Error", "Name must be at least 3 characters");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Validation Error", "Invalid email");
      return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
      Alert.alert("Validation Error", "Phone must be 10 digits");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "users"), {
        name,
        email,
        phone,
        timestamp: new Date(),
      });
      Alert.alert("Success", "Registration successful!");
      setName(""); setEmail(""); setPhone("");
      navigation.navigate("UserList");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address"/>
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="numeric" />
      <Button title={loading ? "Submitting..." : "Submit"} onPress={handleSubmit} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
});
