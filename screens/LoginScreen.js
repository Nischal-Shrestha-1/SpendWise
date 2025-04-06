import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  useTheme,
  TextInput as PaperInput,
  Button as PaperButton,
} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Successful!");
      navigation.replace("MainApp");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.wrapper}>
        {/* Lottie Animated Background */}
        <LottieView
          source={require("../assets/animations/bgs.json")}
          autoPlay
          loop
          style={styles.lottieBackground}
        />

        <ScrollView contentContainerStyle={styles.container}>
          <Animatable.View animation="fadeInDown" style={styles.headerContainer}>
            <Text style={[styles.heading, { color: colors.primary }]}>
              Welcome Back
            </Text>
            <Text style={styles.subheading}>Login to your account</Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
            <PaperInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <PaperInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              error={!!errors.password}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <PaperButton
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              contentStyle={{ paddingVertical: 8 }}
            >
              Login
            </PaperButton>

            <PaperButton
              mode="outlined"
              onPress={() => navigation.navigate("Register")}
              style={styles.outlineButton}
              labelStyle={{ color: colors.primary }}
            >
              Don't have an account? Register
            </PaperButton>
          </Animatable.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  lottieBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 16,
    color: "#777",
    marginTop: 6,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#6200ea",
    borderRadius: 8,
  },
  outlineButton: {
    borderRadius: 8,
    borderColor: "#6200ea",
  },
});

export default LoginScreen;
