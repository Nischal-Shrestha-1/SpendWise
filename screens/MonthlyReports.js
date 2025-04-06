import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Animated, { FadeInDown } from "react-native-reanimated";
import LottieView from "lottie-react-native"; // 🔥 Added Lottie

const screenWidth = Dimensions.get("window").width;

const MonthlyReportScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { colors } = useTheme();
  const today = new Date();

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
            legendFontColor: "#333",
            legendFontSize: 15,
          })
        );

        setCategoryData(categoryChartData);
      } else {
        setExpenses([]);
        setCategoryData([]);
        setTotal(0);
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

  const handleResetFilter = () => {
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  const getCurrentMonthYear = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${months[selectedMonth]} ${selectedYear}`;
  };

  return (
    <View style={styles.wrapper}>
      {/* 🔥 Lottie Background */}
      <LottieView
        source={require("../assets/animations/bgs.json")}
        autoPlay
        loop
        style={styles.lottieBackground}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <Text style={[styles.heading, { color: colors.primary }]}>Monthly Report</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100)} style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={setSelectedMonth}
            style={styles.picker}
          >
            {[
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December",
            ].map((month, index) => (
              <Picker.Item key={index} label={month} value={index} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedYear}
            onValueChange={setSelectedYear}
            style={styles.picker}
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(
              (year) => (
                <Picker.Item key={year} label={String(year)} value={year} />
              )
            )}
          </Picker>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)} style={styles.resetButtonContainer}>
          <Text onPress={handleResetFilter} style={styles.resetButton}>
            Reset Filter to Today
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Text style={styles.month}>{getCurrentMonthYear()}</Text>
          <Text style={styles.total}>Total Spending: ${total.toFixed(2)}</Text>
          <Text style={styles.subtitle}>Spending by Category</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.chartContainer}>
          {categoryData.length > 0 ? (
            <PieChart
              data={categoryData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#f8f8f8",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
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
          ) : (
            <Text style={styles.noDataText}>No data for selected month.</Text>
          )}
        </Animated.View>
      </ScrollView>
    </View>
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
    flexGrow: 1,
    padding: 20,
    backgroundColor: "transparent",
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
    marginBottom: 15,
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
    marginBottom: 16,
    gap: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  chartContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  noDataText: {
    marginTop: 20,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  resetButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  resetButton: {
    color: "#6200ea",
    fontWeight: "600",
    fontSize: 14,
    backgroundColor: "#e6e0f8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default MonthlyReportScreen;
