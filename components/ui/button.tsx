import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { useThemeColor } from './themedefiner';

type LocalProps = {
    title: string;
};

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

type ButtonProps = ViewStyle & ThemeProps & TouchableOpacityProps & LocalProps;

const Button = (props: ButtonProps) => {
    let { title, style, ...otherProps } = props;
    const { lightColor, darkColor } = props;

    const backgroundColor = useThemeColor({ light: "#343434", dark: "#ffcd03" }, 'background');
    const textColor = useThemeColor({ light: "#fff", dark: darkColor }, 'text');

    return (
        <TouchableOpacity style={[stylesLocal.button, { backgroundColor }, style]} {...otherProps}>
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
