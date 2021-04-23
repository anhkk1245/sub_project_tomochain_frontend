import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const register = (name, email, password, password_confirmation) => {
  return axios.post(API_URL + "signup", {
    name,
    email,
    password,
    password_confirmation,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const transferMoney = (address, password, amount, senderAddress) => {
  return axios
    .post(API_URL + "tradeToken", {
      senderAddress,
      password,
      address,
      amount,
    })
    .then((response) => {
      return response.data;
    });
};

const getBalance = (address) => {
  return axios.post(API_URL + "getBalance", {
    address,
  });
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  transferMoney,
  getBalance,
};
