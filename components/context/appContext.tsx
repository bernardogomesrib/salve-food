import { Usuario } from '@/api/auth/tokenHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { getItemsDaApi } from '@/api/item/item';
import { CartItem, Product, Restaurant, Address, Card } from '@/assets/types/types';
import { doLogout } from '@/api/auth/authModule';
import { showMessage } from 'react-native-flash-message';

export interface MyContextType {
    cart: CartItem[];
    cards: Card[];
    addCard: (card: Card) => Promise<void>;
    editCard: (card: Card) => Promise<void>;
    removeCard: (id: number) => Promise<void>;
    loadCards: () => Promise<void>;
    restaurants: Restaurant[];
    product: Product | undefined;
    products: Product[];
    restaurant: Restaurant | undefined;
    setRestaurants: (restaurant: Restaurant[]) => void;
    addToCart: (product: CartItem) => void;
    delToCart: (product: CartItem) => void;
    removeFromCart: (productId: number | undefined) => void;
    handleRestaurantSelection: (restaurant: Restaurant) => void;
    handleProductSelection: (product: Product | undefined) => void;
    setUsuario: (usuario: Usuario) => void;
    getUsuario: (required: boolean | undefined) => Promise<Usuario | undefined>;
    defineUsuario: () => void;
    usuario: Usuario | undefined;
    location: Location.LocationObject | null;
    enderecos: Address[];
    enderecoParaEditar: Address;
    setEnderecoParaEditar: (endereco: Address) => void;
    modificaEndereco: (promessa: Promise<any>) => void;
    apagaEndereco: (id: number) => void;
    enderecoSelecionadoParaEntrega: undefined | Address;
    setEnderecoSelecionadoParaEntrega: (endereco: Address | undefined) => void;
    logout: () => void;
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
    usuario: undefined,
    cards: [],
    addCard: async () => {},
    editCard: async () => {},
    removeCard: async () => {},
    loadCards: async () => {},
    location: null,
    enderecos: [],
    enderecoParaEditar: {
        id: 0,
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        complemento: "",
        cep: "",
        latitude: 0,
        longitude: 0
    },
    setEnderecoParaEditar: () => { },
    modificaEndereco: () => { },
    apagaEndereco: () => { },
    enderecoSelecionadoParaEntrega: undefined,
    setEnderecoSelecionadoParaEntrega: () => { },
    logout: () => { },
};


interface MyProviderProps {
    children: ReactNode;
}
const MyContext = createContext<MyContextType>(defaultContextValue);

const MyProvider: React.FC<MyProviderProps> = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    //const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [product, setProduct] = useState<Product>();
    const [products, setProducts] = useState<Product[]>([]);
    const [restaurant, setRestaurant] = useState<Restaurant>();
    const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [enderecoSelecionadoParaEntrega, setEnderecoSelecionadoParaEntrega] = useState<Address | undefined>(undefined);
    const [enderecoParaEditar, setEnderecoParaEditar] = useState<Address>({
        id: 0,
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        complemento: "",
        cep: "",
        latitude: 0,
        longitude: 0
    });
    const [enderecos, setEnderecos] = useState<Address[]>([]);

    const modificaEndereco = async (promessa: Promise<any>) => {
        const endereco = await promessa;
        console.log(endereco, "promessa resolvida");
        const existingAddressIndex = enderecos.findIndex((item) => item.id === endereco.id);
        if (existingAddressIndex === -1) {
            setEnderecos([...enderecos, endereco]);
        } else {
            for (let i = 0; i < enderecos.length; i++) {
                if (enderecos[i].id === endereco.id) {
                    enderecos[i] = endereco;
                    setEnderecos([...enderecos]);
                }
            }
        }
    }
    const apagaEndereco = async (id: number) => {
        const existingAddressIndex = enderecos.findIndex((item) => item.id === id);
        if (existingAddressIndex !== -1) {
            const updatedEnderecos = [...enderecos];
            updatedEnderecos.splice(existingAddressIndex, 1);
            setEnderecos(updatedEnderecos);
        }
    }
    const logout = async () => {
        setUsuario(undefined);
        doLogout();

    }
    const getUsuario = async (required?: boolean | undefined) => {
        console.log("getUsuario chamado");
        if (usuario === undefined || required === true) {
            console.log("buscando vai api")
            const req = await axios.get(process.env.EXPO_PUBLIC_BACKEND_URL + '/api/auth/introspect', {
                headers: {
                    'Authorization': 'Bearer ' + (await AsyncStorage.getItem('token'))
                }
            });
            console.log(req.data);
            setUsuario(req.data);
            setEnderecos(req.data.enderecos);
            if (enderecoSelecionadoParaEntrega === undefined && req.data.enderecos.length > 0) {
                setEnderecoSelecionadoParaEntrega(req.data.enderecos[0]);
            }
            return req.data;
        } else {
            return usuario;
        }

    }

    const loadCards = async () => {
      try {
        const storedCards = await AsyncStorage.getItem('@cards');
        setCards(storedCards ? JSON.parse(storedCards) : []);
      } catch (error) {
        showMessage({
          message: 'Erro ao carregar cartões',
          type: 'danger',
        })
      }
    };
  
    const addCard = async (newCard: Card) => {
      try {
        const updatedCards = [...cards, newCard];
        await AsyncStorage.setItem('@cards', JSON.stringify(updatedCards));
        setCards(updatedCards);
        showMessage({
          message: 'Cartão adicionado com sucesso',
          type: 'success',
        })
      } catch (error) {
        showMessage({
          message: 'Erro ao adicionar cartão',
          type: 'danger',
        })
      }
    };
  
    const editCard = async (updatedCard: Card) => {
      try {
        const updatedCards = cards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        );
        await AsyncStorage.setItem('@cards', JSON.stringify(updatedCards));
        setCards(updatedCards);
        showMessage({
          message: 'Cartão editado com sucesso',
          type: 'success',
        })
      } catch (error) {
        showMessage({
          message: 'Erro ao editar cartão',
          type: 'danger',
        })
      }
    };
  
    const removeCard = async (id: number) => {
      try {
        const updatedCards = cards.filter((card) => card.id !== id);
        await AsyncStorage.setItem('@cards', JSON.stringify(updatedCards));
        setCards(updatedCards);
      } catch (error) {
        showMessage({
          message: 'Erro ao remover cartão',
          type: 'danger',
        })
      }
    };

    let positionUpdateRoutine: NodeJS.Timeout | null = null;

    const startPositionUpdateRoutine = () => {
        if (positionUpdateRoutine === null) {
            positionUpdateRoutine = setInterval(iniciarCapturaDePosicao, 10000); // Chamar a cada 3 segundos
        } else {
            console.log("Uma rotina de atualização de token já está rodando.");
        }
    };

    const iniciarCapturaDePosicao = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão para pegar localização negada');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        //console.log(location);
        setLocation(location);
    }
    const defineUsuario = async () => {
        const u = await getUsuario(true);
        if (u !== undefined) {
            setUsuario(u)
        }
        startPositionUpdateRoutine();
    }

    const handleRestaurantSelection = async (restaurant: Restaurant) => {
        setRestaurant(restaurant);
        const p = await getItemsDaApi(restaurant.id);
        setProducts(p);
        console.log(restaurant);
        router.push('/restaurante');
    }
    const handleProductSelection = (product: Product | undefined) => {
        setProduct(product);
        router.push(`/menu`);
    }
    const addToCart = (product: CartItem | undefined) => {
        if (product === undefined)
            return;
        console.log(product);

        const existingProductIndex = cart.findIndex((item) => item.product?.id === product.product?.id);

        if (existingProductIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[existingProductIndex].quantity += 1;
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity: product.quantity }]);
        }
    };

    const delToCart = (product: CartItem | undefined) => {
        if (product === undefined)
            return;
        const existingProductIndex = cart.findIndex((item) => item.product?.id === product.product?.id);

        if (existingProductIndex !== -1) {
            const updatedCart = [...cart];
            if (updatedCart[existingProductIndex].quantity > 0) {
                updatedCart[existingProductIndex].quantity -= 1;
                if (updatedCart[existingProductIndex].quantity === 0) {
                    removeFromCart(product.product?.id);
                } else {
                    setCart(updatedCart);
                }
            }
        } else {
            setCart([...cart, { ...product, quantity: 0 }]);
        }
    };

    const removeFromCart = (productId: number | undefined) => {
        const updatedCart = cart
            .map((item) =>
                item.product?.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.product?.id !== productId);

        setCart(updatedCart);
    };

    return (
        <MyContext.Provider value={{ logout, enderecoSelecionadoParaEntrega, setEnderecoSelecionadoParaEntrega, apagaEndereco, modificaEndereco, enderecoParaEditar, setEnderecoParaEditar, restaurants, setRestaurants, cart, addToCart, delToCart, removeFromCart, handleRestaurantSelection, product, restaurant, handleProductSelection, products, setUsuario, getUsuario, defineUsuario, usuario, location, enderecos, cards, addCard, editCard, removeCard, loadCards }}>
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

