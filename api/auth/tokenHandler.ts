import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
  realm_access: {
    roles: string[];
  };
  phone: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
}

export async function decodeToken(): Promise<TokenPayload | null> {
    const token = await AsyncStorage.getItem("token");
  try {
    if(token!==null&&token!==undefined){
        const decoded = await jwt.decode(token) as TokenPayload;
        return decoded;
    }else{
        return null;
    }
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
}

export async function getUserIdFromToken(): Promise<string | null> {
  const payload = await decodeToken();
  return payload ? payload.sub : null;
}

export async function getEmailFromToken(): Promise<string | null> {
  const payload = await decodeToken();
  return payload ? payload.email : null;
}

export async function getRolesFromToken(): Promise<string[] | null> {
  const payload = await decodeToken();
  return payload ? payload.realm_access.roles : null;
}