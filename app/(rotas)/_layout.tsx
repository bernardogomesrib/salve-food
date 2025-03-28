import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";


import { ColorCompliantHeader } from "@/components/ui/ColorCompliantHeader";
import { CustomHeader } from "@/components/ui/CustomHeader";
import { defColorScheme } from "../../assets/styles/Styles";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <StripeProvider
      publishableKey="pk_test_51QYZcjC2PG9ZllTGPmoQ65Ix3USyTOqLAOX9KRZrhgMOMmNZ7cD7Oh9ovnAhdkkLSLwWbkUZoFFdi8ETNn0eRoBN00KMQ5NY11"
    >
    <ThemeProvider value={clrSch === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login/index" options={{ header: () => <ColorCompliantHeader color={clrSch} insets={insets} /> }} />
          <Stack.Screen name="login/cadastro" options={{ title: "cadastre-se", headerShown: false }} />
          <Stack.Screen name="login/recuperarSenha" options={{ title: "Recuperar senha", headerShown: false }} />
          <Stack.Screen name="alterarDados" options={{ title:"Editar Pefil", headerShown:true}} />
          <Stack.Screen name="restaurante/index" options={{ headerShown: true }} />
          <Stack.Screen name="login/enviarEmail" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="menu/index" options={{ headerShown: false }} />
          <Stack.Screen name="seguranca" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
          <Stack.Screen name="formasDePagamento/adicionarCartao" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
          <Stack.Screen name="formasDePagamento/editarCartao" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
          <Stack.Screen name="formasDePagamento/exibirCartoes" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
          <Stack.Screen name="formasDePagamento/formasDePagamento" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
          <Stack.Screen name="adicionarEnderecos" options={{ title: "Novo Endereço", headerShown: true }} />
          <Stack.Screen name="editarEnderecos" options={{ title:"Editar Endereço", headerShown:true}} />
          <Stack.Screen name="listaEnderecos" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
          <Stack.Screen name="formasDePagamento/pixPaymentScreen" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
          <Stack.Screen name="formasDePagamento/addCardScreenStripe" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
          <Stack.Screen name="formasDePagamento/BoletoPaymentScreen" options={{ header: () => <CustomHeader color={clrSch} insets={insets} router={router} /> }} />
      </Stack>
    </ThemeProvider>
    </StripeProvider>

  );
}
