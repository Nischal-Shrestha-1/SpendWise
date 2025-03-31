import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  useTheme,
  TextInput as PaperInput,
  Button as PaperButton,
} from "react-native-paper";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.heading, { color: colors.primary }]}>Register</Text>
      <PaperInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <PaperInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <PaperButton
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
      >
        Register
      </PaperButton>
      <PaperButton mode="text" onPress={() => navigation.navigate("Login")}>
        Already have an account? Sign in
      </PaperButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: "#6200ea",
  },
});

export default RegisterScreen;
