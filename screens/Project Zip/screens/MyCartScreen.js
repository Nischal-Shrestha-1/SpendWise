import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MyCartScreen = ({ cartItems, updateQuantity, removeFromCart }) => {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
            <View style={styles.actionsContainer}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, -1)}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 1)}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {cartItems.length === 0 ? (
                <Text style={styles.emptyText}>My Cart is empty.</Text>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total Amount: ${totalAmount.toFixed(2)}</Text>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDescription: {
        fontSize: 14,
        color: '#555',
    },
    itemPrice: {
        fontSize: 16,
        color: '#000',
        marginVertical: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    quantityButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    totalContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MyCartScreen;
