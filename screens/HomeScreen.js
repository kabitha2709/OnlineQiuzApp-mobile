import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Online Quiz App</Text>
      <Text style={styles.subheading}>
        Manage your data efficiently using our mobile app.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Register Now"
          onPress={() => navigation.navigate("Registration")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="View Users"
          onPress={() => navigation.navigate("UserList")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="About App"
          onPress={() => navigation.navigate("About")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subheading: { fontSize: 16, color: "#555", marginBottom: 20, textAlign: "center" },
  buttonContainer: { width: "80%", marginVertical: 5 }
});
