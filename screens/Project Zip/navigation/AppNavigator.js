import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CategoryScreen from '../screens/CategoryScreen';
import ProductScreen from '../screens/ProductScreen';
import MyCartScreen from '../screens/MyCartScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ShopStack = ({ addToCart, updateQuantity, removeFromCart }) => (
  <Stack.Navigator>
    <Stack.Screen name="Category">
      {props => <CategoryScreen {...props} addToCart={addToCart} />}
    </Stack.Screen>
    <Stack.Screen name="Product">
      {props => <ProductScreen {...props} addToCart={addToCart} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex(item => item.id === product.id);
      if (itemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[itemIndex].quantity += 1;
        return updatedItems;
      } else {
        return [...prevItems, product];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[itemIndex].quantity + delta;
        if (newQuantity <= 0) {
          return prevItems.filter(item => item.id !== id);
        } else {
          updatedItems[itemIndex].quantity = newQuantity;
          return updatedItems;
        }
      }
      return prevItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Shop') {
              iconName = 'store';
            } else if (route.name === 'MyCart') {
              iconName = 'cart';
            } else if (route.name === 'Profile') {
              iconName = 'account';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Shop" options={{
          headerTitle: "London's Mart"
        }}>
          {props => <ShopStack {...props} addToCart={addToCart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />}
        </Tab.Screen>
        <Tab.Screen name="MyCart">
          {props => <MyCartScreen {...props} cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={UserProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
