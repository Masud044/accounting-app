

import api from "./Ap";

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
