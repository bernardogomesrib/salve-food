import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useThemeColor } from './themedefiner';
import { MaskedTextInput } from "react-native-mask-text";
import { Ionicons } from '@expo/vector-icons';

type LocalProps = {
    label: string;
    mask?: string;
};

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

type InputProps = ViewStyle & ThemeProps & TextInputProps & LocalProps;

const Input = (props: InputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    let { mask, label, value, onChangeText, style, placeholder, secureTextEntry, ...otherProps } = props;
    const { lightColor, darkColor } = props;

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    let width = (style as ViewStyle)?.width;
    if (width !== undefined) {
        style = { ...(typeof style === 'object' ? style : {}), width: '100%' };
    }
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const applyMask = (text: string) => {
        if (mask === 'cep') {
            return text.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
        }
        return text;
    };

    const handleChangeText = (text: string) => {
        if (mask) {
            onChangeText && onChangeText(applyMask(text));
        }
    };
    return (
        <View style={[{ width }]}>
            <Text style={[stylesLocal.label, { color }]}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
            {mask ? (
                    <MaskedTextInput
                        mask={mask}
                        value={value}
                        onChangeText={handleChangeText}
                        style={[stylesLocal.input, { color }, style]}
                        placeholder={placeholder}
                        placeholderTextColor={lightColor || "#888"}
                        secureTextEntry={secureTextEntry && !isPasswordVisible}
                        {...otherProps}
                    />
            ) : (
                <TextInput
                value={value}
                onChangeText={onChangeText}
                style={[stylesLocal.input, { color, flex: 1 }, style]}
                placeholder={placeholder}
                placeholderTextColor={lightColor || "#888"}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                {...otherProps}
                />
            )}
            {secureTextEntry && (
                <TouchableOpacity onPress={togglePasswordVisibility} style={{ padding: 12 }}>
                <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color={lightColor || "#888"} />
                </TouchableOpacity>
            )}
            </View>
        </View>
    );
};

const stylesLocal = StyleSheet.create({
    label: {
        marginBottom: 8,
        fontSize: 16,
        textAlign: 'left',
    },
    input: {
        padding: 12,
        fontSize: 16,
       
    },
    
});

export { Input };
