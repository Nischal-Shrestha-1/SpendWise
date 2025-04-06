import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { firestore } from '../data/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProductScreen = ({ route, addToCart }) => {
    const { categoryName } = route.params;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productCollectionRef = collection(firestore, 'Product');
                const q = query(productCollectionRef, where('Category', '==', categoryName));
                const snapshot = await getDocs(q);
                const productsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsList);
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        };

        fetchProducts();
    }, [categoryName]);

    const handleAddToCart = (product) => {
        const item = {
            id: product.id,
            name: product.Name,
            description: product.Description,
            price: parseFloat(product.Price) || 0,
            quantity: 1,
        };
        addToCart(item);
        Alert.alert('Add to cart', `${item.name} added to the cart successfully`)
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image source={{ uri: item.Image }} style={styles.image} />
                        <Text style={styles.name}>{item.Name}</Text>
                        <Text style={styles.description}>{item.Description}</Text>
                        <Text style={styles.price}>${parseFloat(item.Price).toFixed(2)}</Text>
                        <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    itemContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    price: {
        fontSize: 16,
        color: '#000',
        marginVertical: 10,
    },
});

export default ProductScreen;
