import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { ref, onValue, remove } from "firebase/database";
import { useTheme, Card, Button as PaperButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

const ExpenseListScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { colors } = useTheme();

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const expenseRef = ref(db, `expenses/${userId}`);

    const unsubscribe = onValue(expenseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const expenseList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setExpenses(expenseList);
        setFilteredExpenses(expenseList);
      } else {
        setExpenses([]);
        setFilteredExpenses([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(
        expenses.filter((expense) => expense.category === selectedCategory)
      );
    }
  }, [selectedCategory, expenses]);

  const handleDeleteExpense = (id) => {
    const expenseRef = ref(db, `expenses/${auth.currentUser.uid}/${id}`);
    remove(expenseRef).catch((error) => {
      Alert.alert("Error", "Failed to delete expense");
    });
  };

  const renderExpenseItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteExpense(item.id)}
          style={styles.deleteButton}
        >
          <PaperButton mode="outlined" style={styles.deleteButtonText}>
            Delete
          </PaperButton>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: colors.primary }]}>
        Expense List
      </Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="All" value="All" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Rent" value="Rent" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Entertainment" value="Entertainment" />
        <Picker.Item label="Utilities" value="Utilities" />
      </Picker>
      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "column",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ea",
  },
  category: {
    fontSize: 16,
    color: "#444",
  },
  description: {
    fontSize: 14,
    color: "#777",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    color: "#f44336",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
});

export default ExpenseListScreen;
