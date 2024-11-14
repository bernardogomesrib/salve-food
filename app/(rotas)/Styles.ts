import { StyleSheet, useColorScheme } from "react-native";
const colorScheme = useColorScheme();
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    esqueci: {
        color: colorScheme === 'dark' ? '#0660FC' : 'blue',
        textDecorationLine: "underline",
        width: "80%",
        textAlign: "left",
        height: 20
    },
    image: {
        width: "40%",
        aspectRatio: 1,
        resizeMode: 'stretch'
    },
    buttonEntrar: {
        marginTop: 20,
        width: "80%"
    }
});
export { styles };
