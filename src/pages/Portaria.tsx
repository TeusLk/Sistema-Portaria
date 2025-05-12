
import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { 
  Check, 
  X, 
  Search 
} from "lucide-react";

// Dados mockados para os processos
const processos = [
  {
    id: 1,
    dataHora: "12/05/2025 08:30",
    romaneio: "ROM-001",
    tipoMov: "ENTREGA",
    motorista: "João Silva",
    placa: "ABC1234",
    veiculo: "Caminhão 3/4",
    validado: true,
    doca: "DOCA 01",
    emDoca: true,
    concluido: false,
    saida: false
  },
  {
    id: 2,
    dataHora: "12/05/2025 09:15",
    romaneio: "ROM-002",
    tipoMov: "ENTREGA",
    motorista: "Carlos Santos",
    placa: "DEF5678",
    veiculo: "Carreta",
    validado: true,
    doca: "DOCA 03",
    emDoca: false,
    concluido: false,
    saida: false
  },
  {
    id: 3,
    dataHora: "12/05/2025 10:00",
    romaneio: "ROM-003",
    tipoMov: "ENTREGA",
    motorista: "Maria Oliveira",
    placa: "GHI9012",
    veiculo: "Van",
    validado: false,
    doca: null,
    emDoca: false,
    concluido: false,
    saida: false
  },
  {
    id: 4,
    dataHora: "12/05/2025 11:30",
    romaneio: "ROM-004",
    tipoMov: "ENTREGA",
    motorista: "Pedro Costa",
    placa: "JKL3456",
    veiculo: "Caminhão Baú",
    validado: true,
    doca: null,
    emDoca: false,
    concluido: false,
    saida: false
  },
  {
    id: 5,
    dataHora: "12/05/2025 13:45",
    romaneio: "ROM-005",
    tipoMov: "ENTREGA",
    motorista: "Ana Souza",
    placa: "MNO7890",
    veiculo: "Carreta",
    validado: true,
    doca: "DOCA 02",
    emDoca: true,
    concluido: true,
    saida: true
  }
];

const Portaria = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Cálculos para os indicadores
  const totalProcessos = processos.length;
  const processosValidados = processos.filter(p => p.validado).length;
  const processosEmDoca = processos.filter(p => p.emDoca).length;
  const processosConcluidos = processos.filter(p => p.concluido).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Monitoramento de Portaria</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10 w-64" 
              placeholder="Buscar processo..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-sm text-gray-600">Total de Processos</span>
              <span className="text-3xl font-bold text-bluePrimary">{totalProcessos}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-sm text-gray-600">Processos Validados</span>
              <span className="text-3xl font-bold text-bluePrimary">{processosValidados}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-sm text-gray-600">Processos em Doca</span>
              <span className="text-3xl font-bold text-bluePrimary">{processosEmDoca}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-sm text-gray-600">Processos Concluídos</span>
              <span className="text-3xl font-bold text-bluePrimary">{processosConcluidos}</span>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabela de Processos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Romaneio</TableHead>
                <TableHead>Tipo Mov</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Validação</TableHead>
                <TableHead>Acionar</TableHead>
                <TableHead>Em Doca</TableHead>
                <TableHead>Conclusão</TableHead>
                <TableHead>Saída</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell>{processo.dataHora}</TableCell>
                  <TableCell>{processo.romaneio}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-700 text-white hover:bg-emerald-800">
                      {processo.tipoMov}
                    </Badge>
                  </TableCell>
                  <TableCell>{processo.motorista}</TableCell>
                  <TableCell>{processo.placa}</TableCell>
                  <TableCell>{processo.veiculo}</TableCell>
                  <TableCell>
                    {processo.validado ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-bluePrimary" />
                    )}
                  </TableCell>
                  <TableCell>
                    {processo.validado ? (
                      processo.doca ? (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          {processo.doca}
                        </Badge>
                      ) : (
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-xs">
                          ACIONAR MOTORISTA
                        </Button>
                      )
                    ) : (
                      <Badge variant="outline" className="text-gray-500 border-gray-300 bg-gray-100">
                        AG VALIDAÇÃO
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {processo.emDoca ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-bluePrimary" />
                    )}
                  </TableCell>
                  <TableCell>
                    {processo.concluido ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-bluePrimary" />
                    )}
                  </TableCell>
                  <TableCell>
                    {processo.saida ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-bluePrimary" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Portaria;
