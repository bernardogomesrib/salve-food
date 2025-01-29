import { Card } from "@/assets/types/types";
import { showMessage } from "react-native-flash-message";

export const detectCardType = (number: string): Card["type"] => {
  const cleaned = number.replace(/\D/g, "");
  
  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]/.test(cleaned) || /^2[2-7][2-7][0-1]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^6011/.test(cleaned) || /^65/.test(cleaned) || /^64[4-9]/.test(cleaned)) return "discover";
  if (/^35/.test(cleaned)) return "jcb";
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return "diners";
  return "unknown";
};

export const formatCardNumber = (text: string) => {
  const cleaned = text.replace(/\D/g, "");
  const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
  return formatted.slice(0, 19);
};

export const formatExpiryDate = (text: string) => {
  const cleaned = text.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    const month = cleaned.slice(0, 2);
    const year = cleaned.slice(2, 4);
    if (parseInt(month) > 12) return "12/" + year;
    if (month === "00") return "01/" + year;
    return month + (cleaned.length > 2 ? "/" + year : "");
  }
  return cleaned;
};

export const validateCard = (card: {
  nome: string;
  numero: string;
  validade: string;
  cvc: string;
}) => {
  const validateCardNumber = (num: string) => {
    const digits = num.replace(/\D/g, "");
    if (digits.length !== 16) return false;
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const validateExpiry = (expiry: string) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    return true;
  };

  if (!card.nome.trim()) {
    showMessage({
      message: "Aviso",
      description: "Digite o nome do titular do cartão",
      type: "warning",
    });
    return false;
  }

  if (!validateCardNumber(card.numero)) {
    showMessage({
      message: "Aviso",
      description: "Número de cartão inválido",
      type: "warning",
    });
    return false;
  }

  if (!validateExpiry(card.validade)) {
    showMessage({
      message: "Aviso",
      description: "Data de validade inválida. Use o formato MM/AA",
      type: "warning",
    });
    return false;
  }

  if (!/^\d{3}$/.test(card.cvc)) {
    showMessage({
      message: "Aviso",
      description: "CVC deve conter 3 dígitos",
      type: "warning",
    });
    return false;
  }

  return true;
};

export function getCardIconName(cardType: string) {
  switch (cardType) {
    case "visa":
      return "cc-visa";
    case "mastercard":
      return "cc-mastercard";
    case "amex":
      return "cc-amex";
    case "discover":
      return "cc-discover";
    case "jcb":
      return "cc-jcb";
    case "diners":
      return "cc-diners-club";
    default:
      return "credit-card";
  }
}
