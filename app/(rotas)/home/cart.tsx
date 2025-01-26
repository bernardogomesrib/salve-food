import React, { useEffect, useState } from "react";
import { useMyContext } from '@/components/context/appContext';
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from "react-native";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Text, View } from "@/components/Themed";

export default function CartScreen() {
    const { restaurant, products, cart, removeFromCart, addToCart, delToCart } = useMyContext();
    const restaurantName = restaurant?.name;
    const restaurantImage = restaurant?.image;
    const restaurantFare = restaurant ? restaurant?.time / 2 : 30;




    const mainProductId = 1; // ID do produto principal
    const mainProduct = products[mainProductId];
    const suggestedProducts = Object.values(products).filter(
        (product) => product.id !== mainProductId
    );

    const [quantity, setQuantity] = useState(1);

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = cart.reduce((sum, item) => item.product ? sum + item.product.price * item.quantity : sum, 0);
    const total = subtotal + restaurantFare;

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Carrinho",
                    headerTitleStyle: {
                        fontSize: 18,
                    },
                    headerShadowVisible: true,
                }}
            />
            <View style={styles.container}>

                <View style={styles.header}>
                    <Image
                        source={{ uri: restaurantImage }}
                        style={styles.itemRestaurante}
                    />
                    <Text style={styles.restaurantName}>{restaurantName}</Text>
                </View>


                <Text style={styles.sectionTitle}>Itens adicionados</Text>
                <FlatList
                    data={cart}
                    keyExtractor={(item) => item.product?.id.toString() || ''}
                    renderItem={({ item }) => (
                        item.product ? (
                            <View style={styles.cartItem}>
                                <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>{item.product.name}</Text>
                                    <Text style={styles.itemDescription}>{item.product.description}</Text>
                                    <Text style={styles.itemPrice}>
                                        R$ {(item.product.price * item.quantity).toFixed(2)}
                                    </Text>
                                </View>
                                <View>
                                    {item.quantity == 1 ? (
                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity onPress={() => removeFromCart(item.product?.id)}>
                                                <Octicons name="trash" size={20} color="#60DA40" />
                                            </TouchableOpacity>
                                            <Text style={styles.quantityText}>{item.quantity}</Text>
                                            <TouchableOpacity onPress={() => addToCart(item)}><MaterialIcons name="add" size={20} color="#7EE462" />
                                            </TouchableOpacity></View>
                                    ) : (
                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity onPress={() => delToCart(item)}>
                                                <MaterialIcons name="remove" size={20} color="#7EE462" />
                                            </TouchableOpacity>
                                            <Text style={styles.quantityText}>{item.quantity}</Text>
                                            <TouchableOpacity onPress={() => addToCart(item)}>
                                                <MaterialIcons name="add" size={20} color="#7EE462" />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                    }

                                </View>
                            </View>
                        ) : null
                    )}
                />
                {cart.length === 0 && (
                    <Text style={styles.message}>
                        O carrinho está vazio.
                    </Text>
                )}

                {restaurant&&<TouchableOpacity onPress={() => router.push("/restaurante")}>
                    <Text style={styles.addMoreText}>Adicionar mais itens</Text>
                </TouchableOpacity>}

                
                {restaurant && <><Text style={styles.sectionTitle}>Peça também</Text>
                    <FlatList
                        data={products}
                        horizontal
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.suggestionItem}>
                                <Image source={{ uri: item.image }} style={styles.suggestionImage} />
                                <Text style={styles.suggestionPrice}>R$ {item.price.toFixed(2)}</Text>
                                <Text style={styles.suggestionName}>{item.name}</Text>

                            </View>
                        )}
                    /></>}


                {cart.length > 0 && (<>
                
                    <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Resumo de valores</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Taxa de entrega</Text>
                        <Text style={styles.summaryValue}>R$ {restaurantFare.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryTotalLabel}>Total</Text>
                        <Text style={styles.summaryTotalValue}>R$ {total.toFixed(2)}</Text>
                    </View>
                </View>


                <View style={styles.footer}>
                    <View style={styles.footerDetails}>
                        <Text style={styles.footerTotalText}>Total com entrega</Text>
                        <Text style={styles.footerTotalAmount}>
                            R${total.toFixed(2)}/{totalQuantity} item{totalQuantity > 1 ? "s" : ""}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.continueButton}>
                        <Text style={styles.continueButtonText}>Continuar</Text>
                    </TouchableOpacity>
                </View>
                </>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    restaurantName: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "bold",
    },
    itemRestaurante: {
        width: 30,
        height: 30,
        borderRadius: 50,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 8
    },
    message: {
        fontSize: 20,
        textAlign: "center",
        position: "absolute",
        top: "25%",
        width: "100%",
    },
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    itemImage: {
        width: 64,
        height: 64,
        borderRadius: 8
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16
    },
    itemName: {
        fontSize: 16,
        fontWeight: "bold"
    },
    itemDescription: {
        fontSize: 10,
        color: "#888",
        marginVertical: 4
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: "bold"
    },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
    },
    quantityText: {
        marginHorizontal: 8,
        fontSize: 16
    },
    addMoreText: {
        color: "#60DA40",
        textAlign: "center",
        marginVertical: 8
    },
    suggestionItem: {
        alignItems: "center",
        marginRight: 16,
        width: 80,
    },
    suggestionImage: {
        width: 64,
        height: 64,
        borderRadius: 8
    },
    suggestionName: {
        fontSize: 12,
        marginTop: 4
    },
    suggestionPrice: {
        fontSize: 12,
        color: "#888"
    },
    summary: {
        marginVertical: 16
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
    summaryLabel: {
        fontSize: 14,
        color: "#888"
    },
    summaryValue: {
        fontSize: 14,
        color: "#888"
    },
    summaryTotalLabel: {
        fontSize: 14,
        fontWeight: "bold"
    },
    summaryTotalValue: {
        fontSize: 14,
        fontWeight: "bold"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    footerDetails: {
        flex: 1
    },
    footerTotalText: {
        fontSize: 14,
        color: "#888"
    },
    footerTotalAmount: {
        fontSize: 16,
        fontWeight: "bold"
    },
    continueButton: {
        backgroundColor: "#60DA40",
        padding: 16,
        borderRadius: 33,
        alignItems: "center",
    },
    continueButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});
