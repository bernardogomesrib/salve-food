import { Usuario } from "@/api/auth/tokenHandler";
import { conversor } from "@/api/loja/loja";

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
  tiposPagamento: string[];
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
  let ic = "location-on";
  if(end.apelido?.toLocaleLowerCase().includes("casa") ){
    ic = "house";
  }else if(end.apelido?.toLocaleLowerCase().includes("trabalho")){
    ic = "work";
  }else if(end.apelido?.toLocaleLowerCase().includes("apartamento")){
    ic = "apartment";
  }else{
    ic = "location-on"
  }



  const endereco: Address2 = {
    id: end.id ? end.id : 0,
    label: end.apelido ? end.apelido : `${end.rua}, ${end.numero}`,
    address: `${end.rua}, ${end.numero} - ${end.cep}`,
    district: end.bairro,
    city: `${end.cidade}/${end.estado}`,
    details: end.complemento,
    icon: ic,
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
  price?: number;
}

export interface Card {
  isCredit: boolean;
  id: number;
  number: string;
  holder: string;
  expiry: string;
  cvc: string;
  type: 'visa' | 'mastercard'| 'amex' | 'discover' | 'diners' | 'jcb' | 'unknown'; 
}

export interface Review {
  idLoja: number;
  nota: number;
  comentario?: string;
  imagem?: any;
}

export interface Pedido {
  id: number;
  date: string;
  time: string;
  status: string;
  total: string;
  paymentMethod: string;
  deliveryFee: string;
  items: CartItem[];
  address: Address2;
  restaurant: Restaurant;
  recipient: Usuario
}


export const toPedido= function (pedido: any): Pedido {
  const items: CartItem[] = [];
  pedido.itens.forEach((element: any) => {
    items.push({
      product: {
        id: element.item.id,
        name: element.item.nome,
        description: element.item.descricao,
        price: element.valorUnitario,
        image: element.item.itemImage,
        category: element.item.categoriaItem.nome,
      },
      quantity: element.quantidade,
    });
  });
   const pe: Pedido = {
    id: pedido.id,
    date: pedido.dataPedido,
    time: pedido.dataPedido,
    status: pedido.status,
    total: `R$ ${pedido.valorTotal.toFixed(2)}`,
    paymentMethod: pedido.formaPagamento,
    deliveryFee: `R$ ${pedido.taxaEntrega.toFixed(2)}`,
    items,
    restaurant:conversor(pedido.loja),
    address:pedido.enderecoEntrega,
    recipient:pedido.criadoPor
   }
   return pe;
}
    
    
    /* {
          id: 1,
          date: "03/01/2025",
          time: "18:45",
          status: "Entregue",
          total: "R$ 59,90",
          paymentMethod: "Cartão de Crédito",
          deliveryFee: "R$ 5,00",
          items: [
            { name: "Pizza de Calabresa", quantity: 1, unitPrice: "R$ 39,90" },
            { name: "Coca-Cola 2L", quantity: 1, unitPrice: "R$ 15,00" },
          ],
          address: {
            recipient: "João Silva",
            street: "Av. Principal",
            number: 123,
            city: "Pernambuco",
            neighborhood: "Recife",
            reference: "Próximo ao Marco Zero",
          },
          restaurant: {
            name: "Pizzaria Salve Food",
            address: "Rua 01, do lado da rua 02, 10, Recife",
            phone: "(81) 1234-5678",
          },
        }, */
    /* 
    {
        "id": 252,
        "dataPedido": "21/01/2025 18:05:06",
        "dataUltimaModificacao": "21/01/2025 18:25:40",
        "criadoPor": {
          "id": "6346b60f-cc52-4ba5-b1f4-0fac460adaff",
          "firstName": "Nome",
          "lastName": "novo",
          "email": "string@string",
          "phone": "98989898",
          "lastSeenAt": "2025-01-22T18:25:49.840741",
          "loja": null,
          "online": true
        },
        "enderecoEntrega": {
          "id": 1,
          "apelido": null,
          "rua": "string",
          "numero": "string",
          "complemento": "string",
          "bairro": "string",
          "cidade": "string",
          "estado": "string",
          "latitude": 0.1,
          "longitude": 0.1,
          "cep": null,
          "ativo": false
        },
        "status": "PREPARANDO",
        "valorTotal": 64,
        "taxaEntrega": 30,
        "formaPagamento": "AINDA NÃO IMPLEMENTADO",
        "itens": [
          {
            "id": 1,
            "item": {
              "id": 52,
              "nome": "Espetinho de Camarão com Queijo",
              "descricao": "Espetinho de camarão com uma barrotada de queijo e joga na fritura pra matar de ataque cardiaco o ataque cardiaco",
              "valor": 32,
              "categoriaItem": {
                "id": 20,
                "nome": "Camarão"
              },
              "itemImage": null
            },
            "quantidade": 2,
            "valorUnitario": 32
          }
        ],
        "loja": {
          "id": 202,
          "nome": "Bode do nô",
          "descricao": "Pratos nordestinos como fava, arroz, farofa de jerimum, cuscuz e vinagrete, doces, espaço amplo e área kids.",
          "rua": "R. São Miguel",
          "numero": "1401",
          "bairro": "Afogados",
          "cidade": "Recife",
          "estado": "PE",
          "segmentoLoja": {
            "id": 46,
            "nome": "Nordestina",
            "emoji": "🌵"
          },
          "longitude": -34.9793825,
          "latitude": -8.08058,
          "image": null,
          "reviews": [],
          "entregadores": [],
          "rating": null,
          "deliveryTime": null
        },
        "trajetoriaEntregador": null
      } */