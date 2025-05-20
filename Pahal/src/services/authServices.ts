import api from "./api";
import { API_URLS } from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(API_URLS.LOGIN, { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};




