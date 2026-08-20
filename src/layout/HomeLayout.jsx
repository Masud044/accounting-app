import { Outlet } from "react-router-dom";

import { Helmet } from "react-helmet";
// import Navbar from "@/components/Navber";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";



const HomeLayout = () => {
  return (
    // <>
    //   <Helmet>
    //     <title>Dashboard|Accounting</title>
    //   </Helmet>
    //   <div className="flex flex-col  w-full min-h-screen bg-gray-50">
    //     {/* <Sidebar /> */}
    //     <div className="flex-1 flex flex-col">
         
    //       <Navbar />
    //       <main className="">
    //         <Outlet></Outlet>
    //       </main>
    //     </div>
    //   </div>
    // </>

     <>
          <Helmet>
          <title>Dashboard|Accounting</title>
          </Helmet>
     <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-[9999]" />
          <SidebarProvider>
            <AppSidebar />
           
    
            <SidebarInset className="flex flex-col min-h-screen min-w-0 bg-background">
               
              
              <Navbar />
              <main className="flex-1 min-w-0 overflow-x-hidden">
                <Outlet />
              </main>
            </SidebarInset>
          </SidebarProvider>
        </>
  );
};

export default HomeLayout;
