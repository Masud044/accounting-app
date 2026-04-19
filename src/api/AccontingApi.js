

import api from "./Ap";

//  Payment- API

const url  = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const PaymentService = {
  insert: async (payload) => {
    return api.post("/acc/payment.php", { action: "insert", ...payload });
  },

  update: async (payload) => {
    return api.post("/acc/payment.php", { action: "update", ...payload });
  },

  delete: async (masterID) => {
    return api.post("/acc/payment.php", {
      action: "delete",
      masterID,
    });
  },

  search: async (id) => {
    return api.post("/acc/payment.php", {
      action: "search",
      id,
    });
  },
};

// Receive -API
export const ReceiveService = {
  insert: async (payload) => {
    return api.post("/acc/receipt.php", { action: "insert", ...payload });
  },

  update: async (payload) => {
    return api.post("/acc/receipt.php", { action: "update", ...payload });
  },

  delete: async (masterID) => {
    return api.post("/acc/receipt.php", {
      action: "delete",
      masterID,
    });
  },

  search: async (id) => {
    return api.post("/acc/receipt.php", {
      action: "search",
      id,
    });
  },
};


