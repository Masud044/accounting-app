import { Outlet } from "react-router-dom";

import { Helmet } from "react-helmet";
import Navbar from "@/component/navber/Navber";



const HomeLayout = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard|HRMS</title>
      </Helmet>
      <div className="flex flex-col  w-full min-h-screen bg-gray-50">
        {/* <Sidebar /> */}
        <div className="flex-1 flex flex-col">
         
          <Navbar />
          <main className="">
            <Outlet></Outlet>
          </main>
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
