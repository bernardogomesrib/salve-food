import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { useThemeColor } from './themedefiner';

type LocalProps = {
    label: string;
};

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

type InputProps = ViewStyle & ThemeProps & TextInputProps & LocalProps;

const Input = (props: InputProps) => {
    let { label, value, onChangeText, style, ...otherProps } = props;
    const { lightColor, darkColor } = props;

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    let width = (style as ViewStyle)?.width;
    if (width !== undefined) {
        style = { ...(typeof style === 'object' ? style : {}), width: '100%' };
    }

    return (
        <View style={[{width}]}>
            <Text style={[stylesLocal.label, { color }]}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={[stylesLocal.input, { color }, style]}
                {...otherProps}
            />
        </View>
    );
};

const stylesLocal = StyleSheet.create({
    container: {
        marginBottom: 16,
        flexDirection: 'column',
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        textAlign: 'left',
    },
    input: {
        padding: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
});

export { Input };
