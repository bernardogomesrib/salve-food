import { useMyContext } from '@/components/context/appContext';
import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
export default function DetalhesPrato() {
    const { restaurant, product, addToCart, delToCart, cart } = useMyContext();
    const name = product?.name;
    const [quantidade, setQuantidade] = useState(1);
    const description = product?.description
    const price = product ? product?.price : 0;
    const image = product ? product?.image : "";
    const restaurantName = restaurant?.name
    const restaurantDelivery = restaurant?.deliveryTime
    const restaurantRating = restaurant?.rating;
    const getProductQuantity = (productId: number | undefined) => {
        const cartItem = cart.find((item) => item.product?.id === productId);
        return cartItem ? cartItem.quantity : 1;
    };

    const quantity = getProductQuantity(product?.id);

    const carrinho = async () => {
        await addToCart({product, quantity:quantidade});
        router.push("/(rotas)/home/cart");
    };

    


    return (
        <>
            <Stack.Screen
                options={{
                    title: name || "carregando",
                    headerTitleStyle: {
                        fontSize: 18,
                    },
                    headerShadowVisible: true,
                }}
            />
            <View style={styles.container}>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.details}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.price}>R$ {Number(price).toFixed(2)}</Text>
                    <View style={styles.restaurantInfo}>
                        <MaterialIcons name="restaurant" size={24} color="#000" />
                        <View style={styles.restaurantText}>
                            <Text style={styles.restaurantName}>{restaurantName}</Text>
                            <Text style={styles.restaurantDetails}>{restaurantDelivery}</Text>
                        </View>
                        <View style={styles.rating}>
                            <MaterialIcons name="star" size={20} color="#FFA500" />
                            <Text style={styles.ratingText}>{restaurantRating}</Text>
                        </View>
                    </View>
                    {/* <Text style={styles.observationLabel}>Observação?</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Ex.: Tirar cebola, molho à parte, etc."
                        placeholderTextColor="#999"
                    /> */}
                </View>
                <View style={styles.footer}>
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity onPress={() => {
                            setQuantidade(quantidade - 1);
                        }} style={styles.button}>
                            <MaterialIcons name="remove" size={20} color="#7EE462" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantidade}</Text>
                        <TouchableOpacity onPress={() => {
                           setQuantidade(quantidade + 1);
                        }} style={styles.button}>
                            <MaterialIcons name="add" size={20} color="#7EE462" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.addButton} onPress={carrinho}>
                        <Text style={styles.addButtonText}>Adicionar</Text>
                        <Text style={styles.addButtonPrice}>R$ {(quantidade * price).toFixed(2)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 200,
    },
    details: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ddd',
    },
    restaurantText: {
        flex: 1,
        marginLeft: 8,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    restaurantDetails: {
        fontSize: 14,
        color: '#666',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#000',
    },
    observationLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        padding: 8,
        borderRadius: 4,
    },
    quantityText: {
        fontSize: 16,
        marginHorizontal: 8,
        fontWeight: 'bold',
    },
    addButton: {
        flex: 1,
        backgroundColor: '#7EE462',
        padding: 16,
        marginLeft: 16,
        borderRadius: 33,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    addButtonPrice: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});