export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  category: string;
  deliveryTime: string;
  image: string;
  description?: string;
  address?: string;
  items?: MenuItem[];
  time: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Category {
  id: number;
  name: string;
  emoji: string;
}

export type Address = {
  id?: number;
  rua: string;
  apelido?: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  complemento: string;
  cep: string;
  latitude: number|null;
  longitude: number|null;
};

export const toAddress2 = function (end: Address): Address2 {
  const endereco: Address2 = {
    id: end.id ? end.id : 0,
    label: end.apelido ? end.apelido : `${end.rua}, ${end.numero}`,
    address: `${end.rua}, ${end.numero} - ${end.cep}`,
    district: end.bairro,
    city: `${end.cidade}/${end.estado}`,
    details: end.complemento,
    icon: "location-on",
  };
  return endereco;
};

export interface Address2 {
  id: number;
  label: string;
  address?: string;
  district: string;
  city: string;
  details: string;
  icon: string;
}

/* {
    id: "1",
    label: "Rua São José, 83",
    district: "Nova Descoberta",
    city: "Recife/PE",
    details: "Primeiro Andar, xxxxxxxxxx",
    icon: "location-on",
  }, */

export interface Product {
  id: number;
  description: string;
  price: number;
  image: string;
  category: string;
  name: string;
}

export interface CartItem {
  product?: Product;
  quantity: number;
}
