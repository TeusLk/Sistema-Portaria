
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Settings } from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  isActive: boolean;
  collapsed: boolean;
}

const SidebarItem = ({ icon, title, path, isActive, collapsed }: SidebarItemProps) => {
  return (
    <Link to={path}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-blue-100",
          isActive ? "bg-blue-100 text-bluePrimary font-medium" : "text-gray-600"
        )}
      >
        <div className="w-5 h-5">{icon}</div>
        {!collapsed && <span>{title}</span>}
        {isActive && !collapsed && <div className="ml-auto w-1 h-5 rounded-full bg-bluePrimary" />}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [
    { title: "Portaria", path: "/portaria", icon: <Menu className="h-5 w-5" /> },
    // Outros itens do menu serão adicionados posteriormente
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-white transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <Link to="/dashboard" className="text-lg font-semibold text-bluePrimary">
          {!collapsed && <h2>Sistema</h2>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              title={item.title}
              path={item.path}
              icon={item.icon}
              isActive={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>
      
      <div className="border-t p-4">
        {/* Configurações button */}
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-gray-600 hover:text-gray-800 mb-2",
            collapsed && "justify-center px-0"
          )}
        >
          <Settings className="mr-2 h-4 w-4" />
          {!collapsed && "Configurações"}
        </Button>
        
        {/* Sair button */}
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Sair"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
