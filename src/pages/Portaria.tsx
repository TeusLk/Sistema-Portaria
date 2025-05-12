
import { DashboardLayout } from "./Dashboard";

const Portaria = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Portaria</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Bem-vindo ao módulo de Portaria. Aqui você poderá gerenciar entradas e saídas de pessoas e veículos.
          </p>
          
          {/* Placeholder para funcionalidades futuras */}
          <div className="mt-8 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <p className="text-gray-500">Funcionalidades em desenvolvimento</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Portaria;
