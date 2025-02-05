import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import { ColorCompliantHeader } from '@/components/ui/ColorCompliantHeader';
import { CustomHeader } from '@/components/ui/CustomHeader';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    return (

        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Shopping',
                    tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
                    header: () => <CustomHeader router={router} color={colorScheme} insets={insets} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Carrinho',
                    tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
                    header: () => <CustomHeader router={router} color={colorScheme} insets={insets} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                    header: () => <ColorCompliantHeader color={colorScheme} insets={insets} />,
                }}
            />
            <Tabs.Screen
                name="orderHistory"
                options={{
                    title: 'Histórico',
                    tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
                    header: () => <CustomHeader router={router} color={colorScheme} insets={insets} />,
                }}
            />
            <Tabs.Screen
                name="orderDetails"
                options={{
                    title: 'Detalhes',
                    href: null
                }}
            />
        </Tabs>

    );
}
