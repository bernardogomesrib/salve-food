import { Href, useRouter } from 'expo-router';
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { useThemeColor } from './themedefiner';

type LocalProps = {
    title: string;
    href?: Href;
};

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

type ButtonProps = ViewStyle & ThemeProps & TouchableOpacityProps & LocalProps;

const Button = (props: ButtonProps) => {
    let { title, style, onPress ,href , ...otherProps } = props;
    const { lightColor, darkColor } = props;
    const backgroundColor = useThemeColor({ light: "#343434", dark: "#ffcd03" }, 'background');
    const textColor = useThemeColor({ light: "#fff", dark: darkColor }, 'text');
    const router = useRouter();

    const handlePress = (event:GestureResponderEvent) => {
        if (onPress) {
            onPress(event);
        }
        if (href) {
            router.push(href);
        }
    };

    return (
        <TouchableOpacity
            style={[stylesLocal.button, { backgroundColor }, style]}
            onPress={href ? handlePress : onPress}
            {...otherProps}>
            <Text style={[stylesLocal.text, { color: textColor }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const stylesLocal = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export { Button };
