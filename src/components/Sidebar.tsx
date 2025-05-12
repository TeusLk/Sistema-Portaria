
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";

interface SidebarItemProps {
  icon?: React.ReactNode;
  title: string;
  path: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, title, path, isActive }: SidebarItemProps) => {
  return (
    <Link to={path}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-blue-100",
          isActive ? "bg-blue-100 text-bluePrimary font-medium" : "text-gray-600"
        )}
      >
        {icon && <div className="w-5 h-5">{icon}</div>}
        <span>{title}</span>
        {isActive && <div className="ml-auto w-1 h-5 rounded-full bg-bluePrimary" />}
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [
    { title: "Portaria", path: "/portaria" },
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
        {!collapsed && <h2 className="text-lg font-semibold text-bluePrimary">Sistema</h2>}
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
              title={!collapsed ? item.title : ""}
              path={item.path}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>
      </div>
      
      <div className="border-t p-4">
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
