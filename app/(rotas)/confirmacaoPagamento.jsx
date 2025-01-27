import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useMyContext } from '@/components/context/appContext';
import { router, Stack } from "expo-router";
import { showMessage } from 'react-native-flash-message';
import { fazPedido } from '../../api/pedido/pedido'
export default function PaymentOptionsScreen() {

    const { restaurant, cart,setCart,setRestarant, enderecoSelecionadoParaEntrega, enderecos, setEnderecoSelecionadoParaEntrega } = useMyContext();
    const restaurantFare = restaurant ? restaurant?.time / 2 : 30;

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = cart.reduce((sum, item) => item.product ? sum + item.product.price * item.quantity : sum, 0);
    const total = subtotal + restaurantFare;
    const [modalVisible, setModalVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(undefined);
    const enderecoSelecionado = (endereco) => {
        setEnderecoSelecionadoParaEntrega(endereco);
        setModalVisible(false);

    }
    const paymentOptions = [
        { id: 1, name: "Cartão de Crédito", icon: <FontAwesome name="credit-card" size={24} color="#7EE462" /> },
        { id: 2, name: "Cartão de Débito", icon: <FontAwesome name="credit-card-alt" size={24} color="#7EE462" /> },
        { id: 3, name: "Pix", icon: <MaterialIcons name="qr-code" size={24} color="#7EE462" /> }
    ];

    const fazerCompra = async () => {
        console.log("chamando fazer compra");
        if(paymentMethod === undefined) {
            showMessage({
                message: "Erro",
                description: "Selecione um metodo de pagamento",
                type: "warning",
            })
            return;
        }
        const data = {
            itens: cart,
            enderecoEntregaId: enderecoSelecionadoParaEntrega.id,
            valorTotal: totalQuantity,
            taxaEntrega: restaurantFare,
            lojaId: restaurant.id,
            formaPagamento: paymentMethod
        }

        console.log(data);
        const resp = await fazPedido(data);
        if(resp.id){
            setCart([]);
            setRestarant(undefined);
            router.push("/home");
        }
        console.log("pedido feito");
        console.log(resp);
    }



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
                <View style={styles.addressContainer}>
                    <Text style={styles.addressTitle}>Confirmar endereço de entrega</Text>
                    {enderecoSelecionadoParaEntrega ? (
                        <View style={styles.addressContainer2}>
                            <View>
                                <Text style={styles.address}>
                                    {enderecoSelecionadoParaEntrega.rua}, {enderecoSelecionadoParaEntrega.numero}
                                </Text>
                                <Text style={styles.addressDetails}>
                                    {enderecoSelecionadoParaEntrega.bairro}, {enderecoSelecionadoParaEntrega.cidade} - {enderecoSelecionadoParaEntrega.estado}
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.changeAddressText} onPress={() => setModalVisible(true)}>Trocar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text>Nenhum endereço selecionado</Text>
                    )}

                </View>


                <View style={styles.paymentContainer}>
                    <Text style={styles.paymentHeader}>Formas de Pagamento</Text>
                    {paymentOptions.map((option) => (
                        <TouchableOpacity key={option.id} style={styles.option} onPress={() => setPaymentMethod(option.name)}>
                            <View style={styles.iconContainer}>{option.icon}</View>
                            <Text style={styles.optionText}>{option.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.footer}>
                    <View style={styles.footerDetails}>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalAmount}>
                            R${total.toFixed(2)}/{totalQuantity} item{totalQuantity > 1 ? "s" : ""}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.continueButton} onPress={fazerCompra}>
                        <Text style={styles.continueText}>Concluir pedido</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione um endereço</Text>
                        {enderecos && enderecos.map((endereco) => (
                            <TouchableOpacity
                                key={endereco.id}
                                style={styles.addressItem}
                                onPress={() => enderecoSelecionado(endereco)}
                            >
                                <Text style={styles.streetText}>{endereco.rua}, {endereco.numero}</Text>
                                <Text style={styles.detailsText}>{endereco.bairro} - {endereco.cidade}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    clearText: {
        color: 'red',
        fontSize: 14,
    },
    addressContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        backgroundColor: "#FFF"
    },
    addressContainer2: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
    },
    addressTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
        marginBottom: 2,
    },
    addressDetails: {
        fontSize: 12,
        color: '#888',
    },
    changeAddressText: {
        color: '#7EE462',
        fontSize: 14,
        marginTop: 8,
    },
    paymentContainer: {
        flex: 1,
        paddingTop: 40,
    },
    paymentHeader: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    optionsContainer: {
        paddingHorizontal: 20,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    iconContainer: {
        marginRight: 15,
    },
    optionText: {
        fontSize: 16,
        color: "#333",
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
        flex: 2
    },
    totalText: {
        fontSize: 14,
        color: "#888"
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "bold"
    },
    continueButton: {
        backgroundColor: "#60DA40",
        padding: 16,
        borderRadius: 33,
        alignItems: "center",
    },
    continueText: {
        color: "#fff",
        fontSize: 16,
    },
    streetText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    detailsText: {
        fontSize: 14,
        color: "#666",
    },
    changeText: {
        color: "red",
        fontSize: 14,
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    addressItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#7EE462",
        alignItems: "center",
    },
    closeButtonText: {
        color: "#FFF",
        fontSize: 16,
    },
});

