import api from "./api";

  export const login = (email, password) =>
    api.post("/login", { email, password });
  
  export const register = (email, password) =>
    api.post("/register", { email, password });