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
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  useTheme,
  TextInput as PaperInput,
  Button as PaperButton,
} from "react-native-paper";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Successful!");
      navigation.replace("MainApp");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.heading, { color: colors.primary }]}>Login</Text>
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
      <PaperButton mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </PaperButton>
      <PaperButton
        mode="outlined"
        onPress={() => navigation.navigate("Register")}
      >
        Register
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

export default LoginScreen;
