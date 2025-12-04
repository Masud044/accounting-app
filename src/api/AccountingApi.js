import api from "./Ap";

/*.... Fetch all payment vouchers Api.....*/

export const getPaymentVouchers = () => api.get("/pay_all_unposted.php");
export const getPaymentVoucher = (id) => api.get(`/pay_view.php?id=${id}`);
export const createPaymentVoucher = (payload) => api.post("/pay_api.php", payload);
export const updatePaymentVoucher = (payload) => api.post("/bwal_update_gl.php", payload);


/*.... Fetch all received vouchers Api.....*/

export const getReceiveVouchers = () => api.get("/receive_all_unposted.php");
export const getReceiveVoucher = (id) => api.get(`/receive_view.php?id=${id}`);
export const createReceiveVoucher = (payload) => api.post("/addReceive.php", payload);
export const updateReceiveVoucher = (payload) => api.post("/ediRecive.php", payload);


/*.... Fetch all Journal vouchers Api.....*/

export const getJournalVouchers = () => api.get("/GL_all_unposted.phpp");
export const getJournalVoucher = (id) => api.get(`/GL_VIEW.php?id=${id}`);
export const createJournalVoucher = (payload) => api.post("/gl_add.php", payload);
export const updateJournalVoucher = (payload) => api.post("/gl_edit.php", payload);

/*.... Fetch all Cash transfer Api.....*/

export const getCashTransfers = () => api.get("/cash_all_unposted.php");
export const createCashTransfer = (payload) => api.post("/CashFlowAdd.php", payload);

export const getCashAccountCode = () => api.get("/case_flow_account_code.php");


