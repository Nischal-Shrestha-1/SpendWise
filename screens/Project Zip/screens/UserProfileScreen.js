import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const user = {
  name: "Yash Doshi",
  email: "yashdoshi2708ca@gmail.com",
  profilePicture: "https://firebasestorage.googleapis.com/v0/b/grocery-app-1287d.appspot.com/o/315033546_3412685735653690_6192569577389285499_n.jpg?alt=media&token=4b34a879-3c69-46af-8b29-9b1be03b3c0a",
};

const UserProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.details}>Here you can manage your account details.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserProfileScreen;
