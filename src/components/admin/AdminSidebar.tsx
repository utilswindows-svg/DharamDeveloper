import {
  LayoutDashboard,
  Users,
  Key,
  Download,
  Settings,
  User,
  LifeBuoy,
  Mail,
  MessageSquare,
  Ticket,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Licenses", url: "/admin/licenses", icon: Key },
  { title: "Downloads", url: "/admin/downloads", icon: Download },
];

const supportItems = [
  { title: "Support Tickets", url: "/admin/tickets", icon: Ticket },
  { title: "Feedback", url: "/admin/feedback", icon: MessageSquare },
  { title: "Contact Details", url: "/admin/contacts", icon: Mail },
  { title: "Help Center", url: "/admin/help", icon: LifeBuoy },
];

const accountItems = [
  { title: "Profile", url: "/admin/profile", icon: User },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const baseCls = "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const activeCls = "bg-sidebar-accent text-sidebar-primary font-semibold";

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <NavLink
                  to={item.url}
                  end={item.url === "/admin"}
                  className={baseCls}
                  activeClassName={activeCls}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
            A
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-sidebar-foreground">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Management", mainItems)}
        {renderGroup("Support", supportItems)}
        {renderGroup("Account", accountItems)}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
