
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Efeito para redirecionar para a Portaria como padrão
  useEffect(() => {
    navigate("/portaria");
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 text-xl">Selecione uma opção no menu lateral</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
