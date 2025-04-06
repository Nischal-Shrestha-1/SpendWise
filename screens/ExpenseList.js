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
import { signOut } from "firebase/auth";
import {
  useTheme,
  Card,
  Button as PaperButton,
  IconButton,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Animated, { FadeInDown } from "react-native-reanimated";

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
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const expenseRef = ref(db, `expenses/${auth.currentUser.uid}/${id}`);
            remove(expenseRef).catch(() => {
              Alert.alert("Error", "Failed to delete expense");
            });
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); // Replace with your login screen name
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const renderExpenseItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)} key={item.id}>
      <Card style={styles.card} onPress={() => navigation.navigate("AddExpense", { expense: item })}>
        <View style={styles.cardContent}>
          <View style={styles.rowBetween}>
            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
            <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <TouchableOpacity onPress={() => handleDeleteExpense(item.id)} style={styles.deleteButton}>
            <PaperButton mode="outlined" textColor="#f44336">Delete</PaperButton>
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.primary }]}>Expense List</Text>
        <IconButton
          icon="logout"
          size={24}
          iconColor="#f44336"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </View>

      <View style={styles.pickerContainer}>
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
      </View>

      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No expenses to show.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
  },
  logoutBtn: {
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 3,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
  },
  list: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 4,
    padding: 12,
  },
  cardContent: {
    flexDirection: "column",
    gap: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6200ea",
  },
  category: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#aaa",
  },
});

export default ExpenseListScreen;
