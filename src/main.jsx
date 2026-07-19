import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css"; 
import {
  QueryClient,
  QueryClientProvider,
 
} from '@tanstack/react-query'

const queryClient = new QueryClient() // Tailwind CSS import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">

     <QueryClientProvider client={queryClient}>
       <App />
     </QueryClientProvider>
     </ThemeProvider>

   
  </React.StrictMode>
);
