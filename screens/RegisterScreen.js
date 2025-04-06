import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  useTheme,
  TextInput as PaperInput,
  Button as PaperButton,
} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import LottieView from "lottie-react-native";

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      alert("Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      alert("Registration Failed: " + error.message);
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
              Create Account
            </Text>
            <Text style={styles.subheading}>
              Please fill in the form to continue
            </Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
            {/* Email */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email format",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <PaperInput
                    label="Email"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    keyboardType="email-address"
                    style={styles.input}
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <PaperInput
                    label="Password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    error={!!errors.password}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <PaperInput
                    label="Confirm Password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    error={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword.message}
                    </Text>
                  )}
                </>
              )}
            />

            {/* Submit Button */}
            <PaperButton
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.button}
              contentStyle={{ paddingVertical: 8 }}
            >
              Register
            </PaperButton>

            <PaperButton
              mode="text"
              onPress={() => navigation.navigate("Login")}
              labelStyle={{ color: colors.primary }}
            >
              Already have an account? Sign in
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
    backgroundColor: "transparent",
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
});

export default RegisterScreen;
