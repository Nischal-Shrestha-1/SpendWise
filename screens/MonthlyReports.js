import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { db, auth } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

const MonthlyReportScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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

        const filteredExpenses = expenseList.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === selectedMonth &&
            expenseDate.getFullYear() === selectedYear
          );
        });

        setExpenses(filteredExpenses);

        const totalSpending = filteredExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        setTotal(totalSpending);

        const categorySummary = filteredExpenses.reduce((summary, expense) => {
          const { category, amount } = expense;
          summary[category] = (summary[category] || 0) + amount;
          return summary;
        }, {});

        const categoryChartData = Object.keys(categorySummary).map(
          (category) => ({
            name: category,
            population: categorySummary[category],
            color: getCategoryColor(category),
            legendFontColor: "#7F7F7F",
            legendFontSize: 15,
          })
        );

        setCategoryData(categoryChartData);
      } else {
        setExpenses([]);
      }
    });

    return () => unsubscribe();
  }, [selectedMonth, selectedYear]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "Food":
        return "#ff6347";
      case "Rent":
        return "#4682b4";
      case "Transport":
        return "#32cd32";
      case "Entertainment":
        return "#ffa500";
      case "Utilities":
        return "#8a2be2";
      default:
        return "#d3d3d3";
    }
  };

  const getCurrentMonthYear = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[selectedMonth]} ${selectedYear}`;
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.heading, { color: colors.primary }]}>
        Monthly Report
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={handleMonthChange}
          style={styles.picker}
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month, index) => (
            <Picker.Item key={index} label={month} value={index} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedYear}
          onValueChange={handleYearChange}
          style={styles.picker}
        >
          {Array.from(
            { length: 10 },
            (_, i) => new Date().getFullYear() - i
          ).map((year) => (
            <Picker.Item key={year} label={String(year)} value={year} />
          ))}
        </Picker>
      </View>

      <Text style={styles.month}>{getCurrentMonthYear()}</Text>
      <Text style={styles.total}>Total Spending: ${total.toFixed(2)}</Text>
      <Text style={styles.subtitle}>Spending by Category</Text>
      <PieChart
        data={categoryData}
        width={320}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[0, 0]}
        hasLegend={true}
      />
    </ScrollView>
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
  month: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200ea",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "45%",
  },
});

export default MonthlyReportScreen;
