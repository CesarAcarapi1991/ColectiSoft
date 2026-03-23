import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '../types/auth';

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Error decoding token', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};