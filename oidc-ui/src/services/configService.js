import axios from "axios";
import { CONFIG } from "../constants/routes";

// Configuration service
const configService = async () => {
  const response = await axios.get(CONFIG);
  return response.data;
};

// Utility function for random strings
export const generateRandomString = (length = 8) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  
  return Array.from(randomValues, value => 
    characters[value % characters.length]
  ).join('');
};

export default configService;