
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ArrowLeft } from "lucide-react";
import { Timeline } from "@/components/Timeline";
import { toast } from "sonner";

// Dados mockados para o histórico
const historicoMock = [
  {
    id: 1,
    dataHora: "10/05/2025 14:30",
    romaneio: 1234,
    tipoMov: "ENTREGA",
    motorista: "João Silva",
    cpfMotorista: "111.222.333-44",
    placa: "ABC1234",
    placaCarreta: "DEF5678",
    veiculo: "Caminhão Baú",
    validado: true,
    validadoEm: "10/05/2025 14:35",
    doca: "DOCA 03",
    docaAlocadaEm: "10/05/2025 14:40",
    emDoca: true,
    emDocaEm: "10/05/2025 14:45",
    concluido: true,
    concluidoEm: "10/05/2025 16:20",
    saida: true,
    saidaEm: "10/05/2025 16:25"
  },
  {
    id: 2,
    dataHora: "09/05/2025 10:15",
    romaneio: 1233,
    tipoMov: "COLETA",
    motorista: "Maria Oliveira",
    cpfMotorista: "222.333.444-55",
    placa: "GHI5678",
    placaCarreta: "",
    veiculo: "Van",
    validado: true,
    validadoEm: "09/05/2025 10:20",
    doca: "DOCA 05",
    docaAlocadaEm: "09/05/2025 10:25",
    emDoca: true,
    emDocaEm: "09/05/2025 10:30",
    concluido: true,
    concluidoEm: "09/05/2025 11:45",
    saida: true,
    saidaEm: "09/05/2025 11:50"
  },
  {
    id: 3,
    dataHora: "08/05/2025 09:00",
    romaneio: 1232,
    tipoMov: "ENTREGA",
    motorista: "Carlos Santos",
    cpfMotorista: "333.444.555-66",
    placa: "JKL9012",
    placaCarreta: "MNO3456",
    veiculo: "Bitrem",
    validado: true,
    validadoEm: "08/05/2025 09:05",
    doca: "DOCA 01",
    docaAlocadaEm: "08/05/2025 09:10",
    emDoca: true,
    emDocaEm: "08/05/2025 09:15",
    concluido: true,
    concluidoEm: "08/05/2025 12:30",
    saida: true,
    saidaEm: "08/05/2025 12:35"
  }
];

const Historico = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"romaneio" | "cpf" | "placa">("romaneio");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  
  // Esta função irá construir a linha do tempo com base nos eventos registrados
  const buildTimelineEvents = (processo: any) => {
    const events = [];

    // Validação
    events.push({
      type: 'validacao',
      timestamp: processo.validadoEm,
      isActive: !!processo.validado
    });

    // Acionamento de Doca
    events.push({
      type: 'acionamento',
      timestamp: processo.docaAlocadaEm,
      details: processo.doca ? `Doca designada: ${processo.doca}` : undefined,
      isActive: !!processo.doca
    });

    // Em Doca
    events.push({
      type: 'em-doca',
      timestamp: processo.emDocaEm,
      isActive: !!processo.emDoca
    });

    // Conclusão
    events.push({
      type: 'conclusao',
      timestamp: processo.concluidoEm,
      isActive: !!processo.concluido
    });

    // Saída/Finalização
    events.push({
      type: 'saida',
      timestamp: processo.saidaEm,
      isActive: !!processo.saida
    });

    return events;
  };

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    setTimelineEvents(buildTimelineEvents(item));
    setDetailsOpen(true);
  };

  const handleReativarProcesso = () => {
    // Aqui seria implementada a lógica real para reativar o processo
    toast.success("Processo reativado com sucesso");
    setDetailsOpen(false);
  };

  const filteredHistorico = historicoMock.filter((item) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchType) {
      case "romaneio":
        return item.romaneio.toString().includes(searchTerm);
      case "cpf":
        return item.cpfMotorista.toLowerCase().includes(searchLower);
      case "placa":
        return item.placa.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              size="icon"
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Histórico de Portarias</h1>
          </div>
          <div className="flex items-center gap-4">
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
                  onClick={() => setSearchType("placa")} 
                  className={`px-3 py-1 text-sm ${searchType === "placa" 
                    ? "bg-blue-800 text-white" 
                    : "bg-gray-200 text-gray-700"} rounded-r-md`}
                >
                  Placa
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10 w-64" 
                  placeholder={`Buscar por ${searchType}...`}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
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
                <TableHead>Tipo</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Doca</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistorico.map((item) => (
                <TableRow 
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{item.dataHora}</TableCell>
                  <TableCell>{item.romaneio}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-700 text-white hover:bg-emerald-800">
                      {item.tipoMov}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.motorista}</TableCell>
                  <TableCell>{item.placa}</TableCell>
                  <TableCell>{item.veiculo}</TableCell>
                  <TableCell>{item.doca}</TableCell>
                  <TableCell>{item.validadoEm}</TableCell>
                  <TableCell>{item.saidaEm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog para detalhes do histórico */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes do Processo #{selectedItem?.romaneio || ''}
            </DialogTitle>
            <DialogDescription>
              Concluído em {selectedItem?.saidaEm || ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Motorista</h3>
              <p className="text-lg">{selectedItem?.motorista || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">CPF</h3>
              <p className="text-lg">{selectedItem?.cpfMotorista || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Placa</h3>
              <p className="text-lg">{selectedItem?.placa || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Placa Carreta</h3>
              <p className="text-lg">{selectedItem?.placaCarreta || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Veículo</h3>
              <p className="text-lg">{selectedItem?.veiculo || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tipo Movimentação</h3>
              <p className="text-lg">{selectedItem?.tipoMov || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Doca</h3>
              <p className="text-lg">{selectedItem?.doca || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tempo Total</h3>
              <p className="text-lg">
                {selectedItem ? 
                  calcularTempoTotal(selectedItem.validadoEm, selectedItem.saidaEm) : 
                  ''}
              </p>
            </div>
          </div>
          
          {/* Linha do Tempo */}
          <div className="border-t pt-4">
            <Timeline events={timelineEvents} />
          </div>
          
          <DialogFooter>
            <Button onClick={() => setDetailsOpen(false)} variant="outline">
              Fechar
            </Button>
            <Button 
              onClick={handleReativarProcesso} 
              className="bg-blue-800 hover:bg-blue-900"
            >
              Reativar Processo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

// Função auxiliar para calcular o tempo total do processo
function calcularTempoTotal(dataInicio: string, dataFim: string) {
  if (!dataInicio || !dataFim) return 'N/A';
  
  const inicio = parseDateTime(dataInicio);
  const fim = parseDateTime(dataFim);
  
  if (!inicio || !fim) return 'N/A';
  
  const diffMs = fim.getTime() - inicio.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHrs}h ${diffMins}min`;
}

// Função para converter string de data/hora em objeto Date
function parseDateTime(dateTimeStr: string) {
  const [dataPart, horaPart] = dateTimeStr.split(' ');
  const [dia, mes, ano] = dataPart.split('/').map(Number);
  const [hora, minuto] = horaPart.split(':').map(Number);
  
  return new Date(ano, mes - 1, dia, hora, minuto);
}

export default Historico;
