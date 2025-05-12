
import Sidebar from "@/components/Sidebar";

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
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Sistema de Controle</h1>
        <p className="text-gray-600 text-xl mb-8">Bem-vindo ao painel de controle</p>
        <p className="text-gray-400 text-lg">Selecione uma opção no menu lateral para começar</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
