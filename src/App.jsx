
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import './App.css'
import Home from "./pages/Home";


import HomeLayout from "./layout/HomeLayout";
import DashboardHome from "./component/MainEntry/dashboardHome/DashboardHome";
import { ToastContainer } from 'react-toastify';
import PaymentVoucherForm from "./component/MainEntry/payment/PaymentVoucher";
import JournalVoucher from "./component/MainEntry/journal/JournalVoucher";
import ReceiveVoucher from "./component/MainEntry/receive/ReceiveVoucher";
import CashTransfer from "./component/MainEntry/cash/CashTransfer";
import { AuthProvider } from "./authentication/AuthProvaider";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
 
  return (
    <AuthProvider>
     <ToastContainer position="top-right" autoClose={3000} />
       <Router>
        <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/dashboard" element={<HomeLayout />}> 
             <Route index element={<DashboardHome />} />
             <Route path="payment-voucher" element={<PaymentVoucherForm />} />
            <Route
              path="payment-voucher/:voucherId"
              element={<PaymentVoucherForm />}
            />
            <Route path="journal-voucher" element={<JournalVoucher />} />
            <Route path="journal-voucher/:voucherId" element={<JournalVoucher />} />

            <Route path="receive-voucher" element={<ReceiveVoucher />} />
            <Route path="receive-voucher/:voucherId" element={<ReceiveVoucher />} />
            <Route path="cash-voucher" element={<CashTransfer />} />
            <Route path="cash-voucher/:voucherID" element={<CashTransfer />} />
            
            
            
            </Route>
             <Route path="/login" element={<Login></Login>} />
          <Route path="/register" element={<Register></Register>} />
        </Routes>

       </Router>
    </AuthProvider>

    
  )
}

export default App
