import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const CustomHeader = () => {
    const color = useColorScheme();
    return (<View style={styles.header}>
      <TouchableOpacity onPress={() => {console.log("pagina de Ellen");router.push("/listaEnderecos")}}>
        <FontAwesome name="bars" size={32} color={color == 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
      <Image
        source={require("../../assets/images/salve-food.png")}
        style={styles.logo}
      />
      <TouchableOpacity onPress={()=>{console.log("pagina de thiago");router.push("/orderHistory")}}>
        <FontAwesome name="user" size={32} color={color == 'dark' ? 'white' : 'black'} />
      </TouchableOpacity>
    </View>)
  }
  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    logo: {
      width: 120,
      height: 40,
      resizeMode: "contain",
    },
  })
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: 'cadastre-se', headerShown: false }} />
        <Stack.Screen name="recuperarSenha" options={{ title: 'Recuperar senha', headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'Home', header: CustomHeader }} />
        <Stack.Screen name="restaurant" options={{ headerShown: false }} />
        <Stack.Screen name="alterarDados" options={{ header: CustomHeader }} />
        <Stack.Screen name="enviarEmail" options={{ headerShown: false }} />
        <Stack.Screen name="orderHistory" options={{ header: CustomHeader}} />
        <Stack.Screen name="listaEnderecos" options={{ header: CustomHeader }} />
      </Stack>
    </ThemeProvider>
  );
}
