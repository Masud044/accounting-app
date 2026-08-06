// src/Layout/RoleAwareLayout.jsx
import { useAuthV2 } from "@/features/authentication-v2/use-auth-v2";

import PlainLayout from "./PlainLayout";
import HomeLayout from "./HomeLayout";

// Renders DashboardLayout if the user has any of `sidebarRoles`, else PlainLayout.
// Must be used inside <ProtectedRoute> so auth has already resolved.
const RoleAwareLayout = ({ sidebarRoles = ["Admin"] }) => {
  const { user } = useAuthV2();
  const roles = user?.roles ?? [];

  const showSidebar = sidebarRoles.some((r) => roles.includes(r));
  return showSidebar ? <HomeLayout /> : <PlainLayout />;
};

export default RoleAwareLayout;