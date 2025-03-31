import React, { useState } from "react";
import { Text, Alert, StyleSheet, ScrollView } from "react-native";
import { db, auth } from "../firebaseConfig";
import { ref, push } from "firebase/database";
import { Picker } from "@react-native-picker/picker";
import {
  useTheme,
  TextInput as PaperInput,
  Button as PaperButton,
} from "react-native-paper";

const AddExpense = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const { colors } = useTheme();

  const handleAddExpense = async () => {
    if (!amount || !category) return Alert.alert("Please fill all fields");

    try {
      const userId = auth.currentUser.uid;
      await push(ref(db, `expenses/${userId}`), {
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString(),
      });

      Alert.alert("Expense Added!");

      setAmount("");
      setCategory("Food");
      setDescription("");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error adding expense", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.heading, { color: colors.primary }]}>
        Add Expense
      </Text>
      <PaperInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.text}>Category:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Rent" value="Rent" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Entertainment" value="Entertainment" />
        <Picker.Item label="Utilities" value="Utilities" />
      </Picker>
      <PaperInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <PaperButton
        mode="contained"
        onPress={handleAddExpense}
        style={styles.button}
      >
        Add Expense
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
  text: {
    marginBottom: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 15,
  },
});

export default AddExpense;
