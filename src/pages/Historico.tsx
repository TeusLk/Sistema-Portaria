
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
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Check, Search, Calendar, ArrowLeft, MessageSquare, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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
  validadoEm?: string;
  doca: string | null;
  docaAlocadaEm?: string;
  emDoca: boolean;
  emDocaEm?: string;
  concluido: boolean;
  concluidoEm?: string;
  saida: boolean;
  saidaEm?: string;
}

const Historico = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"romaneio" | "cpf" | "data">("romaneio");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessoPortaria | null>(null);
  const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false);
  const [messageToSend, setMessageToSend] = useState("");
  
  // Historically completed processes would come from a context, localStorage or an API
  // For now we'll use mock data with timestamps for events
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
      validadoEm: "12/05/2025 13:50",
      doca: "DOCA 02",
      docaAlocadaEm: "12/05/2025 13:55",
      emDoca: true,
      emDocaEm: "12/05/2025 14:05",
      concluido: true,
      concluidoEm: "12/05/2025 15:30",
      saida: true,
      saidaEm: "12/05/2025 15:45"
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
      validadoEm: "11/05/2025 10:20",
      doca: "DOCA 05",
      docaAlocadaEm: "11/05/2025 10:25",
      emDoca: true,
      emDocaEm: "11/05/2025 10:40",
      concluido: true,
      concluidoEm: "11/05/2025 11:30",
      saida: true,
      saidaEm: "11/05/2025 11:45"
    }
  ]);

  const handleRowClick = (processo: ProcessoPortaria) => {
    setSelectedProcesso(processo);
    setIsDetailOpen(true);
  };

  // Function to handle sending messages to drivers
  const handleSendMessage = () => {
    if (!messageToSend.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Digite uma mensagem para enviar"
      });
      return;
    }

    // Here would be the implementation of the API for sending the message
    toast({
      title: "Sucesso",
      description: `Mensagem enviada para ${selectedProcesso?.motorista}`
    });
    setSendMessageDialogOpen(false);
    setMessageToSend("");
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

      {/* Dialog para detalhes do processo com linha do tempo */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          {selectedProcesso && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Portaria #{selectedProcesso.romaneio}</DialogTitle>
                <DialogDescription>
                  Informações completas do registro
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Dados do processo em grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Informações Gerais</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Data e Hora:</span>
                        <span className="font-medium">{selectedProcesso.dataHora}</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Romaneio:</span>
                        <span className="font-medium">{selectedProcesso.romaneio}</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Tipo Movimentação:</span>
                        <Badge className="bg-emerald-700 text-white">
                          {selectedProcesso.tipoMov}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Dados do Motorista</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Nome:</span>
                        <span className="font-medium">{selectedProcesso.motorista}</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">CPF:</span>
                        <span className="font-medium">{selectedProcesso.cpfMotorista}</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Telefone:</span>
                        <span className="font-medium">{selectedProcesso.telefoneMotorista}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Dados do Veículo</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Placa Cavalo:</span>
                        <span className="font-medium">{selectedProcesso.placa}</span>
                      </div>
                      {selectedProcesso.placaCarreta && (
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-500">Placa Carreta:</span>
                          <span className="font-medium">{selectedProcesso.placaCarreta}</span>
                        </div>
                      )}
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Tipo de Veículo:</span>
                        <span className="font-medium">{selectedProcesso.veiculo}</span>
                      </div>
                      {selectedProcesso.transportadora && (
                        <div className="flex justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-500">Transportadora:</span>
                          <span className="font-medium">{selectedProcesso.transportadora}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Status do Processo</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Validado:</span>
                        <span className="font-medium">{selectedProcesso.validado ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Doca:</span>
                        <span className="font-medium">{selectedProcesso.doca || "Não alocado"}</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Em Doca:</span>
                        <span className="font-medium">{selectedProcesso.emDoca ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-500">Concluído:</span>
                        <span className="font-medium">{selectedProcesso.concluido ? "Sim" : "Não"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Linha do Tempo */}
                <div>
                  <h3 className="text-sm font-semibold mb-4">Linha do Tempo dos Eventos</h3>
                  <div className="space-y-4 border-l-2 border-blue-200 pl-4 ml-4">
                    <div className="relative">
                      <div className="absolute -left-[1.45rem] bg-blue-500 rounded-full p-1">
                        <Clock className="h-3 w-3 text-white" />
                      </div>
                      <div className="mb-1 flex justify-between">
                        <p className="text-sm font-medium">Registro no Sistema</p>
                        <p className="text-xs text-gray-500">{selectedProcesso.dataHora}</p>
                      </div>
                      <p className="text-xs text-gray-600">Processo registrado na portaria</p>
                    </div>
                    
                    {selectedProcesso.validadoEm && (
                      <div className="relative">
                        <div className="absolute -left-[1.45rem] bg-green-500 rounded-full p-1">
                          <Clock className="h-3 w-3 text-white" />
                        </div>
                        <div className="mb-1 flex justify-between">
                          <p className="text-sm font-medium">Validação</p>
                          <p className="text-xs text-gray-500">{selectedProcesso.validadoEm}</p>
                        </div>
                        <p className="text-xs text-gray-600">Processo validado pelo operador</p>
                      </div>
                    )}
                    
                    {selectedProcesso.docaAlocadaEm && (
                      <div className="relative">
                        <div className="absolute -left-[1.45rem] bg-yellow-500 rounded-full p-1">
                          <Clock className="h-3 w-3 text-white" />
                        </div>
                        <div className="mb-1 flex justify-between">
                          <p className="text-sm font-medium">Acionamento</p>
                          <p className="text-xs text-gray-500">{selectedProcesso.docaAlocadaEm}</p>
                        </div>
                        <p className="text-xs text-gray-600">Motorista acionado para {selectedProcesso.doca}</p>
                      </div>
                    )}
                    
                    {selectedProcesso.emDocaEm && (
                      <div className="relative">
                        <div className="absolute -left-[1.45rem] bg-orange-500 rounded-full p-1">
                          <Clock className="h-3 w-3 text-white" />
                        </div>
                        <div className="mb-1 flex justify-between">
                          <p className="text-sm font-medium">Entrada em Doca</p>
                          <p className="text-xs text-gray-500">{selectedProcesso.emDocaEm}</p>
                        </div>
                        <p className="text-xs text-gray-600">Veículo posicionado na doca</p>
                      </div>
                    )}
                    
                    {selectedProcesso.concluidoEm && (
                      <div className="relative">
                        <div className="absolute -left-[1.45rem] bg-purple-500 rounded-full p-1">
                          <Clock className="h-3 w-3 text-white" />
                        </div>
                        <div className="mb-1 flex justify-between">
                          <p className="text-sm font-medium">Conclusão</p>
                          <p className="text-xs text-gray-500">{selectedProcesso.concluidoEm}</p>
                        </div>
                        <p className="text-xs text-gray-600">Operação concluída</p>
                      </div>
                    )}
                    
                    {selectedProcesso.saidaEm && (
                      <div className="relative">
                        <div className="absolute -left-[1.45rem] bg-red-500 rounded-full p-1">
                          <Clock className="h-3 w-3 text-white" />
                        </div>
                        <div className="mb-1 flex justify-between">
                          <p className="text-sm font-medium">Saída</p>
                          <p className="text-xs text-gray-500">{selectedProcesso.saidaEm}</p>
                        </div>
                        <p className="text-xs text-gray-600">Veículo liberado da portaria</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Ações */}
                <div className="flex justify-end space-x-3 mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                  >
                    Fechar
                  </Button>
                  <Button 
                    onClick={() => setSendMessageDialogOpen(true)}
                    className="bg-blue-800 hover:bg-blue-900"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para Enviar Mensagem ao Motorista */}
      <Dialog open={sendMessageDialogOpen} onOpenChange={setSendMessageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Mensagem ao Motorista</DialogTitle>
            <DialogDescription>
              A mensagem será enviada ao telefone {selectedProcesso?.telefoneMotorista}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea 
              placeholder="Digite a mensagem para o motorista..."
              value={messageToSend}
              onChange={e => setMessageToSend(e.target.value)}
              className="w-full min-h-[100px] p-2 border rounded-md"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setSendMessageDialogOpen(false)} variant="outline">Cancelar</Button>
            <Button onClick={handleSendMessage} className="bg-blue-800 hover:bg-blue-900">
              <MessageSquare className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Historico;
