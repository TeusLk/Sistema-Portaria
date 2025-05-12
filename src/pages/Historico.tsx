
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "./Dashboard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Check, Search, Calendar, ArrowLeft } from "lucide-react";

// This would be shared between Portaria and Historico
interface ProcessoPortaria {
  id: number;
  dataHora: string;
  romaneio: number;
  tipoMov: string;
  motorista: string;
  cpfMotorista?: string;
  telefoneMotorista?: string;
  placa: string;
  placaCarreta?: string;
  veiculo: string;
  transportadora?: string;
  validado: boolean;
  doca: string | null;
  emDoca: boolean;
  concluido: boolean;
  saida: boolean;
}

const Historico = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"romaneio" | "cpf" | "data">("romaneio");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoPortaria | null>(null);
  
  // Historically completed processes would come from a context, localStorage or an API
  // For now we'll use mock data
  const [historicalProcessos] = useState<ProcessoPortaria[]>([
    {
      id: 5,
      dataHora: "12/05/2025 13:45",
      romaneio: 5,
      tipoMov: "ENTREGA",
      motorista: "Ana Souza",
      cpfMotorista: "123.456.789-10",
      telefoneMotorista: "(11) 99999-8888",
      placa: "MNO7890",
      placaCarreta: "",
      veiculo: "Carreta",
      transportadora: "Transportadora A",
      validado: true,
      doca: "DOCA 02",
      emDoca: true,
      concluido: true,
      saida: true
    },
    {
      id: 3,
      dataHora: "11/05/2025 10:15",
      romaneio: 3,
      tipoMov: "COLETA",
      motorista: "Roberto Almeida",
      cpfMotorista: "987.654.321-00",
      telefoneMotorista: "(21) 98765-4321",
      placa: "DEF5678",
      placaCarreta: "XYZ1234",
      veiculo: "Bitrem",
      transportadora: "Transportadora C",
      validado: true,
      doca: "DOCA 05",
      emDoca: true,
      concluido: true,
      saida: true
    }
  ]);

  const handleRowClick = (processo: ProcessoPortaria) => {
    setSelectedProcesso(processo);
    setIsDetailOpen(true);
  };

  const filteredProcessos = historicalProcessos.filter(processo => {
    if (searchTerm === "") return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchType) {
      case "romaneio":
        return processo.romaneio.toString().includes(searchTerm);
      case "cpf":
        return processo.cpfMotorista?.toLowerCase().includes(searchLower) || false;
      case "data":
        return processo.dataHora.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/portaria')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Histórico de Portaria</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              <button 
                onClick={() => setSearchType("romaneio")} 
                className={`px-3 py-1 text-sm ${searchType === "romaneio" 
                  ? "bg-blue-800 text-white" 
                  : "bg-gray-200 text-gray-700"} rounded-l-md`}
              >
                Romaneio
              </button>
              <button 
                onClick={() => setSearchType("cpf")} 
                className={`px-3 py-1 text-sm ${searchType === "cpf" 
                  ? "bg-blue-800 text-white" 
                  : "bg-gray-200 text-gray-700"}`}
              >
                CPF
              </button>
              <button 
                onClick={() => setSearchType("data")} 
                className={`px-3 py-1 text-sm ${searchType === "data" 
                  ? "bg-blue-800 text-white" 
                  : "bg-gray-200 text-gray-700"} rounded-r-md`}
              >
                Data
              </button>
            </div>
            <div className="relative">
              {searchType === "data" ? (
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input 
                className="pl-10 w-64" 
                placeholder={`Buscar por ${searchType === "romaneio" ? "número" : searchType === "cpf" ? "CPF" : "data"}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                type={searchType === "data" ? "date" : "text"}
              />
            </div>
          </div>
        </div>
        
        {/* Tabela de Histórico */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Romaneio</TableHead>
                <TableHead>Tipo Mov</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Tipo Veículo</TableHead>
                <TableHead>Finalizado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcessos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    Nenhum processo encontrado no histórico
                  </TableCell>
                </TableRow>
              ) : (
                filteredProcessos.map((processo) => (
                  <TableRow 
                    key={processo.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(processo)}
                  >
                    <TableCell>{processo.dataHora}</TableCell>
                    <TableCell>{processo.romaneio}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-700 text-white hover:bg-emerald-800">
                        {processo.tipoMov}
                      </Badge>
                    </TableCell>
                    <TableCell>{processo.placa}</TableCell>
                    <TableCell>{processo.veiculo}</TableCell>
                    <TableCell>
                      <Check className="h-5 w-5 text-green-500" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog para detalhes do processo */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedProcesso && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Portaria #{selectedProcesso.romaneio}</DialogTitle>
                <DialogDescription>
                  Informações completas do registro
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Data e Hora</p>
                  <p className="text-base">{selectedProcesso.dataHora}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Romaneio</p>
                  <p className="text-base">{selectedProcesso.romaneio}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Movimentação</p>
                  <Badge className="bg-emerald-700 mt-1">
                    {selectedProcesso.tipoMov}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Motorista</p>
                  <p className="text-base">{selectedProcesso.motorista}</p>
                </div>
                {selectedProcesso.cpfMotorista && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">CPF</p>
                    <p className="text-base">{selectedProcesso.cpfMotorista}</p>
                  </div>
                )}
                {selectedProcesso.telefoneMotorista && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Telefone</p>
                    <p className="text-base">{selectedProcesso.telefoneMotorista}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Placa</p>
                  <p className="text-base">{selectedProcesso.placa}</p>
                </div>
                {selectedProcesso.placaCarreta && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Placa Carreta</p>
                    <p className="text-base">{selectedProcesso.placaCarreta}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Veículo</p>
                  <p className="text-base">{selectedProcesso.veiculo}</p>
                </div>
                {selectedProcesso.transportadora && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transportadora</p>
                    <p className="text-base">{selectedProcesso.transportadora}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Doca</p>
                  <p className="text-base">{selectedProcesso.doca || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-green-500">Validado</Badge>
                    <Badge className="bg-green-500">Em Doca</Badge>
                    <Badge className="bg-green-500">Concluído</Badge>
                    <Badge className="bg-green-500">Finalizado</Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Historico;
