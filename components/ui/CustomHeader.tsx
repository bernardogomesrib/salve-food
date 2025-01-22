import { styles } from "@/assets/styles/Styles";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";
import { useMyContext } from "../context/appContext";

const CustomHeader = ({color, insets,router }:{color:'dark'|'light'|undefined|null,insets:any,router:Router}) => {
    const { enderecoSelecionadoParaEntrega }= useMyContext();

    return (<>

        <View style={{ height: insets.top }}>
            <StatusBar style={color === 'dark' ? 'light' : 'dark'} />
        </View>
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => {
                    console.log("Vázio por enquanto");
                }}
            >
                
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    router.push("/(rotas)/listaEnderecos");
                }}
            >
                {enderecoSelecionadoParaEntrega ? <Text>{enderecoSelecionadoParaEntrega.apelido} - {enderecoSelecionadoParaEntrega.rua }</Text>:<Image
                    source={require("../../assets/images/salve-food.png")}
                    style={styles.logo}
                />}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    console.log("Vázio por enquanto");
                }}
            >
                
            </TouchableOpacity>
        </View>
    </>
    );
};
export { CustomHeader };
