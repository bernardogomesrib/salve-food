import { deleteEndereco } from "@/api/endereco/endereco";
import { Address2, toAddress2 } from "@/assets/types/types";
import { useMyContext } from "@/components/context/appContext";
import { Text, View } from "@/components/Themed";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function ListaEnderecos() {
  const [modalVisible, setModalVisible] = useState(false);
  const { enderecos, setEnderecoParaEditar,apagaEndereco,setEnderecoSelecionadoParaEntrega } = useMyContext();
  const [selectedAddress, setSelectedAddress] = useState<Address2 | null>(null);
  const [enderecos2, setEnderecos2] = useState<Address2[]>([]);
  const openModal = (ad: Address2) => {
	setSelectedAddress(ad);
	setModalVisible(true);
  };

  const closeModal = () => {
	setSelectedAddress(null);
	setModalVisible(false);
  };

  const handleDelete = async () => {
	if (!selectedAddress) return;

	Alert.alert(
  	"Confirmar Exclusão",
  	"Você tem certeza que deseja excluir este endereço?",
  	[
    	{
      	text: "Cancelar",
      	style: "cancel",
    	},
    	{
      	text: "Excluir",
      	style: "destructive",
      	onPress: async () => {
        	const sucesso = await deleteEndereco(selectedAddress.id);
        	if (sucesso) {
            apagaEndereco(selectedAddress.id);
          	closeModal();
        	}
      	},
    	},
  	]
	);
  };

  return (
	<View style={styles.container}>
  	<Text style={styles.title}>Endereços</Text>

  	<View style={styles.searchBar}>
    	<FontAwesome name="search" size={18} color="#666" />
    	<TextInput
      	style={styles.input}
      	placeholder="Buscar endereço e número"
    	/>
  	</View>

  	<ScrollView>
    	<View>
		{enderecos && enderecos.length > 0 ? (
			enderecos.map((address) => {
			const ad = toAddress2(address);
			if(ad===undefined){
				return <></>
			}
			return(

				<View style={styles.card} key={address.id}>
				<MaterialIcons
					name={ad.icon as keyof typeof MaterialIcons.glyphMap}
					size={24}
					color="#000"
				/>
						<View style={styles.cardContent}>
							<TouchableOpacity onPress={() => { setEnderecoSelecionadoParaEntrega(address);router.push("/(rotas)/home") }}>
					<Text style={styles.cardTitle}>{ad.label}</Text>
					<Text style={styles.cardText}>{ad.address}</Text>
					<Text style={styles.cardText}>{ad.district}</Text>
					<Text style={styles.cardText}>{ad.city}</Text>
					<Text style={styles.cardText}>{ad.details}</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => { openModal(ad); setEnderecoParaEditar(address) }}>
					<MaterialIcons name="more-vert" size={24} color="#000" />
				</TouchableOpacity>
				</View>
			);
			})
			) : (
				<View>
					<Text style={{fontSize:25,textAlign:"center"}}>Nenhum endereço cadastrado!</Text>
					<Text style={{textAlign:"center"}}>Adicione algum endereço para poder usar os serviços!</Text>
				</View>
			)}
    	</View>
       	 
    	{/* Novo botão no final da lista */}
    	<View style={{ alignItems: "center", marginVertical: 20 }}>
      	<TouchableOpacity style={styles.buttonNewAddress}>
        	<Link href="/adicionarEnderecos">
          	<Text style={styles.buttonText}>Novo Endereço</Text>
        	</Link>
      	</TouchableOpacity>
    	</View>
  	</ScrollView>

  	<Modal
    	visible={modalVisible}
    	transparent
    	animationType="fade"
    	onRequestClose={closeModal}
  	>
    	<View style={styles.modalBackground}>
      	<View style={styles.modalContainer}>
        	<Text style={styles.modalTitle}>{selectedAddress?.label}</Text>
        	<View style={styles.button}>
          	<TouchableOpacity style={styles.modalButtonDelete} onPress={handleDelete}>
            	<Text style={styles.modalButtonText}>Excluir</Text>
          	</TouchableOpacity>
          	<TouchableOpacity style={styles.modalButtonEdit} onPress={() => { closeModal();router.push("/(rotas)/editarEnderecos")}}>
           	 
              	<Text style={styles.modalButtonText}>Editar</Text>
           	 
          	</TouchableOpacity>
        	</View>
        	<TouchableOpacity
          	style={styles.modalCloseButton}
          	onPress={closeModal}
        	>
          	<MaterialIcons name="close" size={24} color="#000" />
        	</TouchableOpacity>
      	</View>
    	</View>
  	</Modal>
	</View>
  );
}

const styles = StyleSheet.create({
  container: {
	flex: 1,
  },
  title: {
	fontSize: 24,
	fontWeight: "bold",
	marginBottom: 8,
	marginLeft: 15,
  },
  searchBar: {
	flexDirection: "row",
	alignItems: "center",
	backgroundColor: "#f0f0f0",
	borderRadius: 8,
	paddingHorizontal: 8,
	height: 40,
	marginBottom: 16,
	margin: 15,
  },
  input: {
	flex: 1,
  },
  card: {
	flexDirection: "row",
	alignItems: "center",
	backgroundColor: "#f9f9f9",
	padding: 16,
	borderRadius: 8,
	marginBottom: 8,
	margin: 15,
  },
  cardContent: {
	flex: 1,
	marginLeft: 8,
	backgroundColor: "#f9f9f9",
  },
  cardTitle: {
	fontSize: 16,
	fontWeight: "bold",
	color: "#555",
  },
  cardText: {
	color: "#555",
  },
  buttonNewAddress: {
	backgroundColor: "#4CAF50",
	paddingVertical: 12,
	paddingHorizontal: 20,
	borderRadius: 8,
  },
  buttonText: {
	color: "#fff",
	fontWeight: "bold",
	fontSize: 16,
  },
  modalBackground: {
	flex: 1,
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
	width: 250,
	padding: 20,
	backgroundColor: "#f9f9f9",
	borderRadius: 8,
	alignItems: "center",
  },
  modalTitle: {
	fontSize: 18,
	fontWeight: "bold",
	marginBottom: 16,
	color: "#555",
  },
  modalButtonDelete: {
	backgroundColor: "#FE251A",
	paddingVertical: 10,
	paddingHorizontal: 20,
	borderRadius: 20,
	marginBottom: 8,
  },
  modalButtonEdit: {
	backgroundColor: "#FFCD03",
	paddingVertical: 10,
	paddingHorizontal: 20,
	borderRadius: 20,
	marginBottom: 8,
  },
  modalButtonText: {
	color: "#fff",
	fontWeight: "bold",
  },
  modalCloseButton: {
	position: "absolute",
	top: 10,
	right: 10,
  },
  button: {
	flexDirection: "row",
	justifyContent: "space-evenly",
	width: "100%",
	backgroundColor: "#f9f9f9",
  },
});
