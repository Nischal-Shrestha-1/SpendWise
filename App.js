import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ExpenseList from "./screens/ExpenseList";
import AddExpense from "./screens/AddExpense";
import MonthlyReports from "./screens/MonthlyReports";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Expenses"
      component={ExpenseList}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="format-list-bulleted" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Add Expense"
      component={AddExpense}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="add-circle" size={24} color={color} />
        ),
      }}
    />
    <Stack.Screen
      name="MonthlyReports"
      component={MonthlyReports}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="pie-chart" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AddExpense" component={AddExpense} />
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
