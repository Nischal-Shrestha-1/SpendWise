import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, Dimensions, Animated, StyleSheet } from 'react-native';
import { firestore } from '../data/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const height = (width * 14) / 20;

const CategoryScreen = ({ navigation, addToCart }) => {
    const [categories, setCategories] = useState([]);
    const [featuredItems, setFeaturedItems] = useState([]);
    const [activeInd, setActiveInd] = useState(0);
    const scrollX = new Animated.Value(0);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryCollectionRef = collection(firestore, 'Category');
                const categorySnapshot = await getDocs(categoryCollectionRef);
                const categoriesList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCategories(categoriesList);

                const featuredCollectionRef = collection(firestore, 'Featured');
                const featuredSnapshot = await getDocs(featuredCollectionRef);
                const featuredList = featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFeaturedItems(featuredList);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const newInd = (activeInd + 1) % featuredItems.length;
            setActiveInd(newInd);
            scrollViewRef.current.scrollTo({ x: newInd * width, animated: true });
        }, 4000);

        return () => clearInterval(interval);
    }, [activeInd, featuredItems]);

    return (
        <View style={styles.container}>
            <View style={styles.carouselContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
                        setActiveInd(newIndex);
                    }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                >
                    {featuredItems.map((item, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image source={{ uri: item.Image }} style={styles.image} />
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.pagination}>
                    {featuredItems.map((_, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.paginationDot,
                                {
                                    opacity: scrollX.interpolate({
                                        inputRange: [
                                            (index - 1) * width,
                                            index * width,
                                            (index + 1) * width,
                                        ],
                                        outputRange: [0.5, 1, 0.5],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.categoriesContainer}>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('Product', { categoryName: item.Name })}>
                            <View style={styles.categoryItem}>
                                <Image source={{ uri: item.Image }} style={styles.categoryImage} />
                                <Text style={styles.categoryName}>{item.Name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    carouselContainer: {
        width: width * 0.9,
        height: height * 0.8,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    imageContainer: {
        width: width * 0.9,
        height: height * 0.8,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: width * 0.9,
        height: height * 0.8,
        resizeMode: 'cover',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#6b52ae',
        margin: 8,
    },
    categoriesContainer: {
        flex: 1,
    },
    categoryItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryImage: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 30,
    },
    categoryName: {
        fontSize: 18,
        fontWeight: '600',
    },
});

export default CategoryScreen;
