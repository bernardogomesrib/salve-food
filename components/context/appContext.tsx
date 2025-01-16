import { Usuario } from '@/api/auth/tokenHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Product {
    id: number;
    description: string;
    price: number;
    image: string;
    category: string;
    name: string;

}
export interface CartItem {
    product: Product;
    quantity: number;
}
export interface Restaurant {
    id: number;
    name: string;
    rating: number;
    category: string;
    deliveryTime: string;
    image: string;
    description: string;
    address: string;
}
export interface MyContextType {
    cart: CartItem[];
    restaurants: Restaurant[];
    product: Product | undefined;
    products: Product[];
    restaurant: Restaurant | undefined;
    setRestaurants: (restaurant: Restaurant[]) => void;
    addToCart: (product: CartItem) => void;
    delToCart: (product: CartItem) => void;
    removeFromCart: (productId: number) => void;
    handleRestaurantSelection: (restaurant: Restaurant) => void;
    handleProductSelection: (product: Product) => void;
    setUsuario: (usuario: Usuario) => void;
    getUsuario: () => Promise<Usuario | undefined>;
    defineUsuario: () => void;
    usuario: Usuario | undefined;
}

const defaultContextValue: MyContextType = {
    restaurants: [],
    product: undefined,
    restaurant: undefined,
    setRestaurants: () => { },
    products: [],
    cart: [],
    addToCart: () => { },
    delToCart: () => { },
    removeFromCart: () => { },
    handleRestaurantSelection: () => { },
    handleProductSelection: () => { },
    setUsuario: () => { },
    defineUsuario: () => { },
    getUsuario: async () => undefined,
    usuario: undefined
};


interface MyProviderProps {
    children: ReactNode;
}
const MyContext = createContext<MyContextType>(defaultContextValue);

const MyProvider: React.FC<MyProviderProps> = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    //const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [product, setProduct] = useState<Product>();
    const [products, setProducts] = useState<Product[]>([]);
    const [restaurant, setRestaurant] = useState<Restaurant>();
    const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);

    const getUsuario = async () => {
        if (usuario === undefined) {
            const req = await axios.get(process.env.EXPO_PUBLIC_BACKEND_URL + '/api/auth/introspect', {
                headers: {
                    'Authorization': 'Bearer ' + (await AsyncStorage.getItem('token'))
                }
            });
            console.log(req.data);
            setUsuario(req.data);
        } else {
            return usuario;
        }

    }

    const defineUsuario = async () => {
        const u = await getUsuario();
        if (u !== undefined) {
            setUsuario(u)
        }
    }

    const handleRestaurantSelection = (restaurant: Restaurant) => {
        setRestaurant(restaurant);
        setProducts(mockMenuItems[restaurant.id - 1]);
        console.log(restaurant);
        router.push('/restaurante');
    }
    const handleProductSelection = (product: Product) => {
        setProduct(product);
        router.push(`/menu`);
    }
    const addToCart = (product: CartItem) => {
        console.log(product);

        const existingProductIndex = cart.findIndex((item) => item.product.id === product.product.id);

        if (existingProductIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingProductIndex].quantity += 1;
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const delToCart = (product: CartItem) => {
        const existingProductIndex = cart.findIndex((item) => item.product.id === product.product.id);

        if (existingProductIndex !== -1) {
            const updatedCart = [...cart];
            if (updatedCart[existingProductIndex].quantity > 0) {
                updatedCart[existingProductIndex].quantity -= 1;
                if (updatedCart[existingProductIndex].quantity === 0) {
                    removeFromCart(product.product.id);
                } else {
                    setCart(updatedCart);
                }
            }
        } else {
            setCart([...cart, { ...product, quantity: 0 }]);
        }
    };

    const removeFromCart = (productId: number) => {
        const updatedCart = cart
            .map((item) =>
                item.product.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.product.id !== productId);

        setCart(updatedCart);
    };

    return (
        <MyContext.Provider value={{ restaurants,setRestaurants, cart, addToCart, delToCart, removeFromCart, handleRestaurantSelection, product, restaurant, handleProductSelection, products, setUsuario, getUsuario, defineUsuario, usuario }}>
            {children}
        </MyContext.Provider>
    );
};

const useMyContext = () => {
    const context = useContext(MyContext);
    return context;
};

export { useMyContext };
export default MyProvider;
//area de variaveis de mock

const mockMenuItems = [
    [
        {
            id: 1,
            name: "Feijoada Completa",
            description: "Feijoada tradicional com arroz, couve e farofa",
            price: 45.9,
            image: "https://via.placeholder.com/400",
            category: "Pratos Principais",
        },
        {
            id: 2,
            name: "Moqueca de Peixe",
            description: "Peixe fresco com leite de coco e dendê",
            price: 52.9,
            image: "https://via.placeholder.com/400",
            category: "Pratos Principais",
        },
    ],
    [
        {
            id: 1,
            name: "Pizza Margherita",
            description: "Molho de tomate, mussarela, manjericão",
            price: 39.9,
            image: "https://via.placeholder.com/400",
            category: "Pizzas",
        },
        {
            id: 2,
            name: "Lasanha à Bolonhesa",
            description: "Massa fresca, molho bolonhesa e bechamel",
            price: 45.9,
            image: "https://via.placeholder.com/400",
            category: "Massas",
        },
    ],
]
