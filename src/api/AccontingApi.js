

import axios from "axios";
// import api from "./Ap";

//  Payment- API

const url  = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const PaymentService = {
  insert: async (payload) => {
    // return api.post("/acc/payment.php", { action: "insert", ...payload });
    return axios.post(`${url}/api/payment`, { action: "insert", ...payload });

  },

  update: async (payload) => {
    // return api.post("/acc/payment.php", { action: "update", ...payload });
    return axios.post(`${url}/api/payment`, { action: "update", ...payload });
    
  },

  delete: async (masterID) => {
    // return api.post("/acc/payment.php", {
    return axios.post(`${url}/api/payment`, {

      action: "delete",
      masterID,
    });
  },

  search: async (id) => {
    // return api.post("/acc/payment.php", {
    return axios.post(`${url}/api/payment`, {

      action: "search",
      id,
    });
  },
};

// Receive -API
export const ReceiveService = {
  insert: async (payload) => {
    // return api.post("/acc/receipt.php", { action: "insert", ...payload });
    return axios.post(`${url}/api/receipt`, { action: "insert", ...payload });

  },

  update: async (payload) => {
    // return api.post("/acc/receipt.php", { action: "update", ...payload });
     return axios.post(`${url}/api/receipt`, { action: "update", ...payload });

  },

  delete: async (masterID) => {
    // return api.post("/acc/receipt.php", {
       return axios.post(`${url}/api/receipt`, {
      action: "delete",
      masterID,
    });
  },

  search: async (id) => {
    // return api.post("/acc/receipt.php", {
       return axios.post(`${url}/api/receipt`, {
      action: "search",
      id,
    });
  },
};


