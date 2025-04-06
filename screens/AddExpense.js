import React, { useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig";
import { ref, push, update } from "firebase/database";
import { Picker } from "@react-native-picker/picker";
import {
  useTheme,
  TextInput as PaperInput,
  Button as PaperButton,
} from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";

const AddExpense = ({ navigation, route }) => {
  const isEditMode = !!route?.params?.expense;
  const expense = route?.params?.expense || {};
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      category: "Food",
      description: "",
    },
  });

  // Populate form on edit
  useEffect(() => {
    if (isEditMode) {
      reset({
        amount: expense.amount?.toString() || "",
        category: expense.category || "Food",
        description: expense.description || "",
      });
    }
  }, [expense, isEditMode]);

  // Reset on screen focus (for add mode)
  useFocusEffect(
    useCallback(() => {
      if (!isEditMode) {
        reset({
          amount: "",
          category: "Food",
          description: "",
        });
      }
    }, [isEditMode])
  );

  const onSubmit = async (data) => {
    try {
      const userId = auth.currentUser.uid;
      const expenseData = {
        amount: parseFloat(data.amount),
        category: data.category,
        description: data.description.trim(),
        date: new Date().toISOString(),
      };

      if (isEditMode) {
        await update(ref(db, `expenses/${userId}/${expense.id}`), expenseData);
        alert("Expense updated!");
      } else {
        await push(ref(db, `expenses/${userId}`), expenseData);
        alert("Expense added!");
      }

      navigation.goBack();
    } catch (error) {
      alert("Error saving expense: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {isEditMode && (
          <Animated.View entering={FadeInDown.duration(300)}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
              <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={[styles.heading, { color: colors.primary }]}>
            {isEditMode ? "Edit Expense" : "Add Expense"}
          </Text>
        </Animated.View>

        {/* Amount Field */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <Controller
            control={control}
            name="amount"
            rules={{
              required: "Amount is required",
              validate: (val) =>
                parseFloat(val) > 0 || "Amount must be greater than 0",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <PaperInput
                  label="Amount"
                  keyboardType="numeric"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  style={[
                    styles.input,
                    errors.amount && styles.inputErrorBorder,
                  ]}
                  error={!!errors.amount}
                />
                {errors.amount && (
                  <Text style={styles.errorText}>{errors.amount.message}</Text>
                )}
              </>
            )}
          />
        </Animated.View>

        {/* Category Picker */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.pickerContainer}>
          <Text style={styles.label}>Category</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
              >
                <Picker.Item label="Food" value="Food" />
                <Picker.Item label="Rent" value="Rent" />
                <Picker.Item label="Transport" value="Transport" />
                <Picker.Item label="Entertainment" value="Entertainment" />
                <Picker.Item label="Utilities" value="Utilities" />
              </Picker>
            )}
          />
        </Animated.View>

        {/* Description Field */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <Controller
            control={control}
            name="description"
            rules={{
              required: "Description is required",
              minLength: {
                value: 3,
                message: "Must be at least 3 characters",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <PaperInput
                  label="Description"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  mode="outlined"
                  style={[
                    styles.input,
                    errors.description && styles.inputErrorBorder,
                  ]}
                  error={!!errors.description}
                />
                {errors.description && (
                  <Text style={styles.errorText}>
                    {errors.description.message}
                  </Text>
                )}
              </>
            )}
          />
        </Animated.View>

        {/* Submit Button */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <PaperButton
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            {isEditMode ? "Update Expense" : "Add Expense"}
          </PaperButton>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 6,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  inputErrorBorder: {
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 1,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#6200ea",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default AddExpense;
