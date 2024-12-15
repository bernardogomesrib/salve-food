import { StyleSheet } from "react-native";
let colorScheme: 'light' | 'dark' | null | undefined = null;
const defColorScheme = (scheme: 'light' | 'dark' | null | undefined) => {
    colorScheme = scheme
};
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    logo: {
        width: 120,
        height: 40,
        resizeMode: "contain",
    },
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
        width: "80%",
        borderRadius: 20
    }
});

export { defColorScheme, styles };

