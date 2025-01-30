import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, useColorScheme } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useMyContext } from '@/components/context/appContext';
import { router, Stack } from "expo-router";
import { showMessage } from 'react-native-flash-message';
import { fazPedido } from '../../api/pedido/pedido'
import { Text, View } from '@/components/Themed';
import { getRestaurantesPorId } from '@/api/loja/loja';
export default function PaymentOptionsScreen() {

    const { restaurant, cart, setCart, setRestaurant, enderecoSelecionadoParaEntrega, enderecos, setEnderecoSelecionadoParaEntrega, cards, loadCards } = useMyContext();
    const restaurantFare = restaurant ? restaurant?.time / 2 : 30;
    const cor = useColorScheme();
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = cart.reduce((sum, item) => item.product ? sum + item.product.price * item.quantity : sum, 0);
    const total = subtotal + restaurantFare;
    const [modalVisible, setModalVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined);
    const enderecoSelecionado = async (endereco: any) => {
        setEnderecoSelecionadoParaEntrega(endereco);
        const res = await getRestaurantesPorId(restaurant?.id, endereco.latitude, endereco.longitude);
        if(res){
            setRestaurant(res);
        }
        setModalVisible(false);

    }
    const paymentOptions = [
        { id: 1, name: "Cartão de Crédito", icon: <FontAwesome name="credit-card" size={24} color="#7EE462" /> },
        { id: 2, name: "Cartão de Débito", icon: <FontAwesome name="credit-card-alt" size={24} color="#7EE462" /> },
        { id: 3, name: "Pix", icon: <MaterialIcons name="qr-code" size={24} color="#7EE462" /> },
        { id: 4, name: "Dinheiro", icon: <FontAwesome name="money" size={24} color="#7EE462" /> }
    ];

    useEffect(() => {
        loadCards();
    }, []);

    const fazerCompra = async () => {
        console.log("chamando fazer compra");
        if (paymentMethod === undefined) {
            showMessage({
                message: "Erro",
                description: "Selecione um metodo de pagamento",
                type: "warning",
            })
            return;
        }
        const data = {
            itens: cart,
            enderecoEntregaId: enderecoSelecionadoParaEntrega?.id,
            valorTotal: totalQuantity,
            taxaEntrega: restaurantFare,
            lojaId: restaurant?.id,
            formaPagamento: paymentMethod
        }

        console.log(data);
        const resp = await fazPedido(data);
        if (resp.pedido.id) {
            setCart([]);
            setRestaurant(undefined);
            router.push("/home");
        }
        console.log("pedido feito");
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
                                <Text style={[styles.addressDetails,cor==="light"?{color:"#888"}:{color:"#CCC"}]}>
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
                    <Text style={[styles.paymentHeader,cor==="light"?{color:"#333"}:{color:"#aaa"}]}>Meus Cartões Salvos</Text>
                    {(!cards || cards.length === 0) ? (
                        <Text style={[styles.optionText,{textAlign:'center'}]}>Nenhum cartão salvo.</Text>
                    ) : (
                        cards.map((card) => {
                            const cardLabel = `${card.isCredit ? "Crédito" : "Débito"} - final ${card.number.slice(
                                -4
                            )}`;
                            const isSelected = paymentMethod === cardLabel;

                            return (
                                <TouchableOpacity
                                    key={card.id}
                                    style={[
                                        styles.option,
                                        isSelected && styles.selectedOption,
                                    ]}
                                    onPress={() => setPaymentMethod(cardLabel)}
                                >
                                    <View style={styles.iconContainer}>
                                        <FontAwesome name="credit-card" size={24} color="#7EE462" />
                                    </View>
                                    <Text style={styles.optionText}>{cardLabel}</Text>
                                </TouchableOpacity>
                            );
                        })
                    )}

                    {/* Outras Formas de Pagamento */}
                    <Text style={[styles.paymentHeader,cor==="light"?{color:"#333"}:{color:"#aaa"}]}>Outras Formas de Pagamento</Text>
                    {paymentOptions.map((option) => {
                        const isSelected = paymentMethod === option.name;
                        if (!restaurant?.tiposPagamento.includes("CARTAO_CREDITO") && option.name === "Cartão de Crédito") {
                            return null;
                        }
                        if (!restaurant?.tiposPagamento.includes("CARTAO_DEBITO") && option.name === "Cartão de Débito") {
                            return null;
                        }
                        if (!restaurant?.tiposPagamento.includes("PIX") && option.name === "Pix") {
                            return null;
                        }
                        if (!restaurant?.tiposPagamento.includes("DINHEIRO") && option.name === "Dinheiro") {
                            return null;
                        }
                        return (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    cor==="light"?styles.option:styles.optionDark,
                                    isSelected && styles.selectedOption,
                                ]}
                                onPress={() => {setPaymentMethod(option.name);console.log(cor)}}
                            >
                                <View style={styles.iconContainer}>{option.icon}</View>
                                <Text style={[styles.optionText, cor === "light"?{color: "#333"}:{color:"#AAA"}]}>{option.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Rodapé com total + botão */}
                <View style={styles.footer}>
                    <View style={styles.footerDetails}>
                        <Text style={[styles.totalText, cor === "light" ? { color: "#888" }:{color:"#eee"}]}>Total</Text>
                        <Text style={styles.totalAmount}>
                            R${total.toFixed(2)}/{totalQuantity} item
                            {totalQuantity > 1 ? "s" : ""}
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
                    <View style={[styles.modalContent, { backgroundColor: cor === "light" ? "#FFF" : "#333" }]}>
                        <Text style={styles.modalTitle}>Selecione um endereço</Text>
                        {enderecos && enderecos.map((endereco) => (
                            <TouchableOpacity
                                key={endereco.id}
                                style={styles.addressItem}
                                onPress={() => enderecoSelecionado(endereco)}
                            >
                                <Text style={styles.streetText}>{endereco.apelido?endereco.apelido:endereco.cep} - {endereco.rua}, {endereco.numero}</Text>
                            <Text style={[styles.detailsText, { color: cor === "light" ?"#666":"#DDD" }]}>{endereco.bairro} - {endereco.cidade}</Text>
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
    },
    optionsContainer: {
        paddingHorizontal: 20,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    optionDark: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#FFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    selectedOption: {
        borderWidth: 1,
        borderColor: "#7EE462",
    },
    iconContainer: {
        marginRight: 15,
    },
    optionText: {
        fontSize: 16,
        
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

