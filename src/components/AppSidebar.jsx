// // src/components/AppSidebar.jsx
// import { NavLink, useLocation } from "react-router-dom";
// import { Moon, Sun, ChevronDown } from "lucide-react";
// import {
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { NAV_ITEMS } from "@/lib/constants/nav-item";
// import { useTheme } from "@/components/theme-provider";
// import { IconTractor } from "@tabler/icons-react";
// import { useAuthV2 } from "@/features/authentication-v2/use-auth-v2";
// import logo from "@/assets/account-image.jpeg";

// export default function AppSidebar() {
//   const { state } = useSidebar();
//   const isCollapsed = state === "collapsed";
//   const { setTheme } = useTheme();
//   const location = useLocation();
//   const { user } = useAuthV2();

//   const userPermissions = user?.permissions ?? [];


//   const hasAnyRequiredPermission = (required) => {
  
   
//     const codes = Array.isArray(required) ? required : [required];
//     return codes.some((code) => userPermissions.includes(code));
//   };

//   return (
//     <Sidebar collapsible="icon" className="border-r border-border">
//       {/* ── Header ── */}
//       <SidebarHeader className="h-14 flex flex-row items-center border-b border-border px-3">
//         <NavLink to="/dashboard/welcome" className="flex items-center gap-2 overflow-hidden cursor-pointer">
//           {/* <div className="w-8 h-8 rounded-md bg-emerald-500 flex items-center justify-center shrink-0">
//             <IconTractor />
//           </div>
//           {!isCollapsed && (
//             <span className="font-display text-lg font-bold text-emerald-600 tracking-tight whitespace-nowrap">
//               Bangladesh Welfare Agro
//             </span>
//           )} */}
//            <div className=" flex items-center gap-3">
//                       <img
//                         src={logo}
//                         alt="Bangladesh Welfare Agro"
//                         width={44}
//                         height={44}
//                         className="rounded-full object-contain ring-1 ring-emerald-900/10"
//                       />
//                       <div className="leading-tight">
                       
//                         <p className="-mt-0.5 text-[15px] font-bold text-emerald-700">
//                            Bangladesh Welfare Agro
//                         </p>
//                       </div>
//                     </div>
//         </NavLink>
//       </SidebarHeader>

//       {/* ── Nav Groups ── */}
//       <SidebarContent className="px-2 py-4 gap-4">
//         {NAV_ITEMS.map((group, idx) => {
//           const visibleLinks = group.links.filter((linkItem) =>
//             hasAnyRequiredPermission(linkItem.requiredPermission)
//           );
//           if (visibleLinks.length === 0) return null;

//           return (
//             <Collapsible key={idx} defaultOpen={false} className="group/collapsible">
//               <SidebarGroup className="px-0">
//                 {!isCollapsed && (
//                   <CollapsibleTrigger asChild>
//                     <SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-3 cursor-pointer hover:text-foreground transition-colors flex items-center justify-between">
//                       {group.label}
//                       <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
//                     </SidebarGroupLabel>
//                   </CollapsibleTrigger>
//                 )}
//                 <CollapsibleContent>
//                   <SidebarGroupContent>
//                     <SidebarMenu className="gap-1">
//                       {visibleLinks.map((linkItem, linkIdx) => {
//                         const isActive =
//                           linkItem.to === "/dashboard"
//                             ? location.pathname === linkItem.to
//                             : location.pathname.startsWith(linkItem.to);

//                         return (
//                           <SidebarMenuItem key={linkIdx}>
//                             <SidebarMenuButton
//                               asChild
//                               isActive={isActive}
//                               tooltip={isCollapsed ? linkItem.label : undefined}
//                               className="
//                                 h-auto rounded-md px-2 py-2
//                                 text-[13px] font-medium
//                                 text-muted-foreground
//                                 hover:bg-accent hover:text-primary
//                                 data-[active=true]:bg-[#818CF8]
//                                 data-[active=true]:text-[#F0F0F5]
//                                 dark:data-[active=true]:bg-accent
//                                 dark:data-[active=true]:text-primary
//                               "
//                             >
//                               <NavLink to={linkItem.to} end={linkItem.to === "/dashboard"} className="flex items-center gap-4">
//                                 {linkItem.Icon && (
//                                   <linkItem.Icon className="w-5 h-5 shrink-0" />
//                                 )}
//                                 <span>{linkItem.label}</span>
//                               </NavLink>
//                             </SidebarMenuButton>
//                           </SidebarMenuItem>
//                         );
//                       })}
//                     </SidebarMenu>
//                   </SidebarGroupContent>
//                 </CollapsibleContent>
//               </SidebarGroup>
//             </Collapsible>
//           );
//         })}
//       </SidebarContent>

//       {/* ── Footer ── */}
//       <SidebarFooter className="border-t border-border p-2">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton
//                   tooltip={isCollapsed ? "Toggle theme" : undefined}
//                   className="text-muted-foreground hover:bg-accent hover:text-primary"
//                 >
//                   <Sun className="w-[18px] h-[18px] shrink-0 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//                   <Moon className="absolute w-[18px] h-[18px] shrink-0 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
//                   {!isCollapsed && <span>Toggle theme</span>}
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" side="top" className="w-40">
//                 <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

// src/components/AppSidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  ChevronDown,
  Monitor,
  Home,
  LayoutDashboard,
  FileText,
  Factory,
  Package,
  BarChart3,
  ClipboardList,
  Settings,
  Users,
  Folder,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NAV_ITEMS } from "@/lib/constants/nav-item";
import { useTheme } from "@/components/theme-provider";
import { useAuthV2 } from "@/features/authentication-v2/use-auth-v2";
import logo from "@/assets/account-image.jpeg";

// Fallback icons for group/root labels — used only when a group doesn't
// already define its own `Icon` in NAV_ITEMS.
const GROUP_ICON_MAP = {
  home: Home,
  dashboard: LayoutDashboard,
  "voucher entry": FileText,
  production: Factory,
  inventory: Package,
  "account report": BarChart3,
  "inventory report": ClipboardList,
  setup: Settings,
  "user management": Users,
};

function getGroupIcon(group) {
  return group.ItemIcon || GROUP_ICON_MAP[group.label?.toLowerCase()?.trim()] || Folder;
}

export default function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { user } = useAuthV2();

  const userPermissions = user?.permissions ?? [];

  const hasAnyRequiredPermission = (required) => {
    const codes = Array.isArray(required) ? required : [required];
    return codes.some((code) => userPermissions.includes(code));
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60 bg-sidebar">
      {/* ── Header / Brand ── */}
      <SidebarHeader className="h-16 flex flex-row items-center border-b border-border/60 px-3">
        <NavLink
          to="/dashboard/welcome"
          className="flex items-center gap-3 overflow-hidden cursor-pointer group"
        >
          <div className="relative shrink-0">
            <img
              src={logo}
              alt="Bangladesh Welfare Agro"
              width={38}
              height={38}
              className="w-[38px] h-[38px] rounded-xl object-cover ring-1 ring-emerald-900/10 shadow-sm transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight overflow-hidden">
              <p className="text-[14.5px] font-bold text-emerald-700 dark:text-emerald-400 tracking-tight truncate">
                Bangladesh Welfare Agro
              </p>
              <p className="text-[11px] font-medium text-muted-foreground/70 truncate">
                Enterprise Suite
              </p>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      {/* ── Nav Groups ── */}
      <SidebarContent className="px-2.5 py-4 gap-1.5 scrollbar-thin">
        {NAV_ITEMS.map((group, idx) => {
          const visibleLinks = group.links.filter((linkItem) =>
            hasAnyRequiredPermission(linkItem.requiredPermission)
          );
          if (visibleLinks.length === 0) return null;

          const groupHasActive = visibleLinks.some((linkItem) =>
            linkItem.to === "/dashboard"
              ? location.pathname === linkItem.to
              : location.pathname.startsWith(linkItem.to)
          );

          return (
            <Collapsible
              key={idx}
              defaultOpen={groupHasActive || true}
              className="group/collapsible"
            >
              <SidebarGroup className="px-0 py-0.5">
                {!isCollapsed && (() => {
                  const GroupIcon = getGroupIcon(group);
                  return (
                    <CollapsibleTrigger asChild>
                      <SidebarGroupLabel
                        className="text-[10.5px] font-bold tracking-[0.08em] text-foreground
                          uppercase px-2.5 h-8 cursor-pointer rounded-md
                          hover:text-foreground hover:bg-accent/50 transition-colors
                          flex items-center justify-between select-none"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <GroupIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
                          <span className="truncate">{group.label}</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground/40 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarGroupLabel>
                    </CollapsibleTrigger>
                  );
                })()}
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <SidebarGroupContent>
                    <SidebarMenu className="gap-0.5 mt-0.5">
                      {visibleLinks.map((linkItem, linkIdx) => {
                        const isActive =
                          linkItem.to === "/dashboard"
                            ? location.pathname === linkItem.to
                            : location.pathname.startsWith(linkItem.to);

                        return (
                          <SidebarMenuItem key={linkIdx}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={isCollapsed ? linkItem.label : undefined}
                            
                            >
                              <NavLink
                                to={linkItem.to}
                                end={linkItem.to === "/dashboard"}
                                className="flex items-center gap-3"
                              >
                                {linkItem.Icon && (
                                  <linkItem.Icon
                                    className={`w-[17px] h-[17px] shrink-0 ${
                                      isActive ? "" : "text-muted-foreground/60"
                                    }`}
                                  />
                                )}
                                <span className="truncate">{linkItem.label}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-border/60 p-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={isCollapsed ? "Toggle theme" : undefined}
                  className="h-9 rounded-lg px-2.5 text-[13px] font-medium text-muted-foreground/90 hover:bg-accent hover:text-foreground transition-colors"
                >
                  <span className="relative w-[17px] h-[17px] shrink-0 flex items-center justify-center">
                    <Sun className="absolute w-[17px] h-[17px] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute w-[17px] h-[17px] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0" />
                  </span>
                  {!isCollapsed && <span>Appearance</span>}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-40">
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="gap-2 text-[13px]"
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                  {theme === "light" && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="gap-2 text-[13px]"
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                  {theme === "dark" && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="gap-2 text-[13px]"
                >
                  <Monitor className="w-3.5 h-3.5" /> System
                  {theme === "system" && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {!isCollapsed && user && (
            <SidebarMenuItem>
              <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1 rounded-lg bg-accent/40">
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight overflow-hidden">
                  <p className="text-[12.5px] font-semibold text-foreground truncate">
                    {user?.name || user?.username}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground/70 truncate">
                    {user?.role || user?.email || "Signed in"}
                  </p>
                </div>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}