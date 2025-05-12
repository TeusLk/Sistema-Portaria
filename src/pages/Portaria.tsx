
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
  Search,
  PlusCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Dados mockados para os processos
const initialProcessos = [
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
    doca: null,
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

// Lista de docas disponíveis
const docas = Array.from({ length: 18 }, (_, i) => `DOCA ${String(i + 1).padStart(2, '0')}`);

// Lista de transportadoras
const transportadoras = ["Transportadora A", "Transportadora B", "Transportadora C", "Transportadora D"];

// Lista de tipos de veículos
const tiposVeiculos = ["Van", "Caminhão 3/4", "Caminhão Baú", "Carreta", "Bitrem", "Rodotrem"];

// Lista de clientes
const clientes = ["Cliente A", "Cliente B", "Cliente C", "Cliente D", "Cliente E"];

// Tipos de movimentação
const tiposMovimentacao = ["ENTREGA", "COLETA", "DEVOLUÇÃO", "TRANSFERÊNCIA"];

const Portaria = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [processos, setProcessos] = useState(initialProcessos);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    id: number;
    field: 'validado' | 'emDoca' | 'concluido' | 'saida';
  } | null>(null);
  const [docaDialogOpen, setDocaDialogOpen] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(null);
  const [selectedDoca, setSelectedDoca] = useState<string | null>(null);
  const [novaPortariaOpen, setNovaPortariaOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      tipoMovimentacao: "",
      romaneio: "",
      cpfMotorista: "",
      nomeMotorista: "",
      statusCnh: "",
      transportadora: "",
      placaCavalo: "",
      placaCarreta: "",
      tipoVeiculo: "",
      telefoneMotorista: "",
      cliente: "",
    }
  });

  // Cálculos para os indicadores
  const totalProcessos = processos.length;
  const processosValidados = processos.filter(p => p.validado).length;
  const processosEmDoca = processos.filter(p => p.emDoca).length;
  const processosConcluidos = processos.filter(p => p.concluido).length;

  const handleConfirmAction = () => {
    if (!currentAction) return;

    setProcessos(prev => 
      prev.map(processo => 
        processo.id === currentAction.id
          ? { ...processo, [currentAction.field]: true }
          : processo
      )
    );
    setConfirmDialogOpen(false);
    setCurrentAction(null);
  };

  const handleStatusClick = (id: number, field: 'validado' | 'emDoca' | 'concluido' | 'saida') => {
    const processo = processos.find(p => p.id === id);
    if (!processo || processo[field]) return; // Se já está validado, não faz nada

    setCurrentAction({ id, field });
    setConfirmDialogOpen(true);
  };

  const handleAcionarClick = (id: number) => {
    const processo = processos.find(p => p.id === id);
    if (!processo || !processo.validado || processo.doca) return;

    setSelectedProcessId(id);
    setDocaDialogOpen(true);
  };

  const handleDocaSelect = () => {
    if (!selectedProcessId || !selectedDoca) return;

    setProcessos(prev => 
      prev.map(processo => 
        processo.id === selectedProcessId
          ? { ...processo, doca: selectedDoca, emDoca: true }
          : processo
      )
    );
    setDocaDialogOpen(false);
    setSelectedProcessId(null);
    setSelectedDoca(null);
  };

  const handleNovaPortariaSubmit = (data: any) => {
    // Criar um novo registro com dados do formulário
    const newId = Math.max(...processos.map(p => p.id)) + 1;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const novoProcesso = {
      id: newId,
      dataHora: formattedDate,
      romaneio: data.romaneio,
      tipoMov: data.tipoMovimentacao,
      motorista: data.nomeMotorista,
      placa: data.placaCavalo,
      veiculo: data.tipoVeiculo,
      validado: false,
      doca: null,
      emDoca: false,
      concluido: false,
      saida: false
    };

    setProcessos([...processos, novoProcesso]);
    setNovaPortariaOpen(false);
    form.reset();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Monitoramento de Portaria</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10 w-64" 
                placeholder="Buscar processo..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setNovaPortariaOpen(true)} 
              className="bg-bluePrimary hover:bg-blue-800"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Portaria
            </Button>
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
                    <button 
                      onClick={() => handleStatusClick(processo.id, 'validado')}
                      className="focus:outline-none"
                    >
                      {processo.validado ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-bluePrimary" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    {processo.validado ? (
                      processo.doca ? (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          {processo.doca}
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleAcionarClick(processo.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-xs"
                        >
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
                    <button 
                      onClick={() => handleStatusClick(processo.id, 'emDoca')}
                      className="focus:outline-none"
                      disabled={!processo.validado || !processo.doca}
                    >
                      {processo.emDoca ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-bluePrimary" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button 
                      onClick={() => handleStatusClick(processo.id, 'concluido')}
                      className="focus:outline-none"
                      disabled={!processo.emDoca}
                    >
                      {processo.concluido ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-bluePrimary" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button 
                      onClick={() => handleStatusClick(processo.id, 'saida')}
                      className="focus:outline-none"
                      disabled={!processo.concluido}
                    >
                      {processo.saida ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-bluePrimary" />
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog de confirmação para alteração de status */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja confirmar esta ação?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para seleção da doca */}
      <Dialog open={docaDialogOpen} onOpenChange={setDocaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Selecionar Doca</DialogTitle>
            <DialogDescription>
              Escolha a doca para a qual o motorista deve ser direcionado
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedDoca || ""} onValueChange={setSelectedDoca}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar doca" />
              </SelectTrigger>
              <SelectContent>
                {docas.map((doca) => (
                  <SelectItem key={doca} value={doca}>
                    {doca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleDocaSelect} 
              className="bg-bluePrimary hover:bg-blue-800"
              disabled={!selectedDoca}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Nova Portaria */}
      <Dialog open={novaPortariaOpen} onOpenChange={setNovaPortariaOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Portaria</DialogTitle>
            <DialogDescription>
              Preencha os dados para registrar uma nova portaria
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleNovaPortariaSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data e Hora</label>
                <Input 
                  value={new Date().toLocaleString()}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tipo da Movimentação <span className="text-red-500">*</span>
                </label>
                <Select
                  value={form.watch("tipoMovimentacao")}
                  onValueChange={value => form.setValue("tipoMovimentacao", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMovimentacao.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nº do Romaneio <span className="text-red-500">*</span>
                </label>
                <Input 
                  {...form.register("romaneio")}
                  placeholder="Digite o romaneio"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  CPF do Motorista <span className="text-red-500">*</span>
                </label>
                <Input 
                  {...form.register("cpfMotorista")}
                  placeholder="Digite o CPF"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nome do Motorista <span className="text-red-500">*</span>
                </label>
                <Input 
                  {...form.register("nomeMotorista")}
                  placeholder="Digite o nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status CNH</label>
                <Input 
                  {...form.register("statusCnh")}
                  placeholder="Status da CNH"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Transportadora <span className="text-red-500">*</span>
                </label>
                <Select
                  value={form.watch("transportadora")}
                  onValueChange={value => form.setValue("transportadora", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a transportadora" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportadoras.map((transp) => (
                      <SelectItem key={transp} value={transp}>
                        {transp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Placa Cavalo <span className="text-red-500">*</span>
                </label>
                <Input 
                  {...form.register("placaCavalo")}
                  placeholder="Digite a placa"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Placa Carreta</label>
                <Input 
                  {...form.register("placaCarreta")}
                  placeholder="Digite a placa (se aplicável)"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tipo de Veículo <span className="text-red-500">*</span>
                </label>
                <Select
                  value={form.watch("tipoVeiculo")}
                  onValueChange={value => form.setValue("tipoVeiculo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposVeiculos.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone do Motorista</label>
                <Input 
                  {...form.register("telefoneMotorista")}
                  placeholder="Digite o telefone"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <Select
                  value={form.watch("cliente")}
                  onValueChange={value => form.setValue("cliente", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente} value={cliente}>
                        {cliente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-bluePrimary hover:bg-blue-800 mt-4"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Portaria;
