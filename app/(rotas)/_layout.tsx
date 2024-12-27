import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";


import { ColorCompliantHeader } from "@/components/ui/ColorCompliantHeader";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { defColorScheme } from "../../assets/styles/Styles";
import { StripeProvider } from "@stripe/stripe-react-native";

export {
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
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
  const clrSch = useColorScheme();
  defColorScheme(clrSch);

  return (
    <StripeProvider
      publishableKey="pk_test_51QYZcjC2PG9ZllTGPmoQ65Ix3USyTOqLAOX9KRZrhgMOMmNZ7cD7Oh9ovnAhdkkLSLwWbkUZoFFdi8ETNn0eRoBN00KMQ5NY11"
    >
    <ThemeProvider value={clrSch === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ header: ColorCompliantHeader }} />
        <Stack.Screen name="cadastro" options={{ title: "cadastre-se", headerShown: false }} />
        <Stack.Screen name="recuperarSenha" options={{ title: "Recuperar senha", headerShown: false }} />
        <Stack.Screen name="home" options={{ header: CustomHeader }} />
        <Stack.Screen name="restaurante/index" options={{ headerShown: true }} />
        <Stack.Screen name="alterarDados" options={{ header: CustomHeader }} />
        <Stack.Screen name="enviarEmail" options={{ headerShown: false }} />
        <Stack.Screen name="orderHistory" options={{ header: CustomHeader }} />
        <Stack.Screen name="profile" options={{ header: CustomHeader }} />
        <Stack.Screen name="menu/index" options={{ headerShown: true }} />
        <Stack.Screen name="seguranca" options={{ header: CustomHeader }} />
        <Stack.Screen name="formasDePagamento/adicionarCartao" options={{ header: CustomHeader }} />
        <Stack.Screen name="formasDePagamento/editarCartao" options={{ header: CustomHeader }} />
        <Stack.Screen name="formasDePagamento/exibirCartoes" options={{ header: CustomHeader }} />
        <Stack.Screen name="formasDePagamento/formasDePagamento" options={{ header: CustomHeader }} />
        <Stack.Screen name="adicionarEnderecos" options={{ header: CustomHeader }} />
        <Stack.Screen name="editarEnderecos" options={{ header: CustomHeader }} />
        <Stack.Screen name="listaEnderecos" options={{ header: CustomHeader }} />
        <Stack.Screen name="formasDePagamento/pixPaymentScreen" options={{ header: CustomHeader }} />
        <Stack.Screen name="formasDePagamento/addCardScreenStripe" options={{ header: CustomHeader }} />
        <Stack.Screen name="formasDePagamento/BoletoPaymentScreen" options={{ header: CustomHeader }} />
      </Stack>
    </ThemeProvider>
    </StripeProvider>

  );
}
