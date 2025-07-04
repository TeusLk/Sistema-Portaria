import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Check, 
  X, 
  Search,
  PlusCircle,
  History,
  Settings,
  Edit,
  Trash2,
  Clock,
  MessageSquare,
  ArrowLeft
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Timeline } from "@/components/Timeline";

// Dados mockados para os processos
const initialProcessos = [
  {
    id: 1,
    dataHora: "12/05/2025 08:30",
    romaneio: 1,
    tipoMov: "ENTREGA",
    motorista: "João Silva",
    cpfMotorista: "111.222.333-44",
    telefoneMotorista: "(11) 98765-4321",
    placa: "ABC1234",
    placaCarreta: "",
    transportadora: "Transportadora A",
    veiculo: "Caminhão 3/4",
    validado: true,
    validadoEm: "12/05/2025 08:35",
    doca: "DOCA 01",
    docaAlocadaEm: "12/05/2025 08:40",
    emDoca: true,
    emDocaEm: "12/05/2025 08:45",
    concluido: false,
    concluidoEm: "",
    saida: false,
    saidaEm: ""
  },
  {
    id: 2,
    dataHora: "12/05/2025 09:15",
    romaneio: 2,
    tipoMov: "ENTREGA",
    motorista: "Carlos Santos",
    cpfMotorista: "222.333.444-55",
    telefoneMotorista: "(21) 98765-4321",
    placa: "DEF5678",
    placaCarreta: "",
    transportadora: "Transportadora B",
    veiculo: "Carreta",
    validado: true,
    validadoEm: "12/05/2025 09:20",
    doca: null,
    docaAlocadaEm: "",
    emDoca: false,
    emDocaEm: "",
    concluido: false,
    concluidoEm: "",
    saida: false,
    saidaEm: ""
  },
  {
    id: 3,
    dataHora: "12/05/2025 10:00",
    romaneio: 3,
    tipoMov: "ENTREGA",
    motorista: "Maria Oliveira",
    cpfMotorista: "333.444.555-66",
    telefoneMotorista: "(31) 98765-4321",
    placa: "GHI9012",
    placaCarreta: "",
    transportadora: "Transportadora C",
    veiculo: "Van",
    validado: false,
    validadoEm: "",
    doca: null,
    docaAlocadaEm: "",
    emDoca: false,
    emDocaEm: "",
    concluido: false,
    concluidoEm: "",
    saida: false,
    saidaEm: ""
  },
  {
    id: 4,
    dataHora: "12/05/2025 11:30",
    romaneio: 4,
    tipoMov: "ENTREGA",
    motorista: "Pedro Costa",
    cpfMotorista: "444.555.666-77",
    telefoneMotorista: "(41) 98765-4321",
    placa: "JKL3456",
    placaCarreta: "",
    transportadora: "Transportadora D",
    veiculo: "Caminhão Baú",
    validado: true,
    validadoEm: "12/05/2025 11:35",
    doca: null,
    docaAlocadaEm: "",
    emDoca: false,
    emDocaEm: "",
    concluido: false,
    concluidoEm: "",
    saida: false,
    saidaEm: ""
  },
];

// Lista de docas disponíveis
const docas = Array.from({ length: 18 }, (_, i) => `DOCA ${String(i + 1).padStart(2, '0')}`);

// Lista de tipos de veículos
const tiposVeiculos = ["Van", "Caminhão 3/4", "Caminhão Baú", "Carreta", "Bitrem", "Rodotrem"];

// Tipos de movimentação atualizados conforme requisitos
const tiposMovimentacao = ["VAZIO", "COLETA", "ENTREGA", "EM ANÁLISE", "ENTREGA COLETA", "DESCARGA MANIFESTO", "CARREGAMENTO MANIFESTO"];

// Mensagens padrão para configuração
const mensagensPadrao = {
  mensagemInicial: "Olá, seu romaneio está pronto para recebimento.",
  acionamentoMotorista: "Dirija-se à doca designada.",
  estorno: "Seu processo foi estornado.",
  trocaDoca: "Sua doca foi alterada.",
  conclusao: "Processo concluído com sucesso.",
  desocuparDoca: "Favor desocupar a doca.",
  finalizarProcesso: "Seu processo foi finalizado.",
  retornoFinalizados: "Seu processo retornou para análise.",
  finalizarInsucesso: "Processo finalizado sem sucesso.",
  confirmacaoCadastro: "Motorista cadastrado com sucesso."
};

// Função utilitária para buscar motorista pelo CPF
async function fetchMotoristaByCpf(cpf: string) {
  try {
    const response = await fetch(`/api/v1/motorista/${cpf.replace(/\D/g, "")}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

const Portaria = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"romaneio" | "cpf" | "placa">("romaneio");
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
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [configTab, setConfigTab] = useState("docas");
  const [docasList, setDocasList] = useState(docas);
  const [veiculosList, setVeiculosList] = useState(tiposVeiculos);
  const [tiposMovList, setTiposMovList] = useState(tiposMovimentacao);
  const [novaDoca, setNovaDoca] = useState("");
  const [novoVeiculo, setNovoVeiculo] = useState("");
  const [novoTipoMov, setNovoTipoMov] = useState("");
  const [historicalProcessos, setHistoricalProcessos] = useState<any[]>([]);
  const [mensagens, setMensagens] = useState(mensagensPadrao);
  const [msgDialogOpen, setMsgDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editItemDialog, setEditItemDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: string; value: string} | null>(null);
  const [itemToEdit, setItemToEdit] = useState<{type: string; value: string; newValue: string}>({
    type: '',
    value: '',
    newValue: ''
  });
  const [sendMessageDialogOpen, setSendMessageDialogOpen] = useState(false);
  const [messageToSend, setMessageToSend] = useState("");
  const [predefinedMessage, setPredefinedMessage] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProcessDetails, setSelectedProcessDetails] = useState<any>(null);
  const [trocaDocaDialogOpen, setTrocaDocaDialogOpen] = useState(false);
  const [retrocessoDialogOpen, setRetrocessoDialogOpen] = useState(false);
  const [retrocessoProcessoId, setRetrocessoProcessoId] = useState<number | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  const form = useForm({
    defaultValues: {
      tipoMovimentacao: "",
      romaneio: "",
      cpfMotorista: "",
      nomeMotorista: "",
      cnh: "",
      placaCavalo: "",
      placaCarreta: "",
      tipoVeiculo: "",
      telefoneMotorista: "",
    }
  });

  // Efeito para remover processos concluídos da lista principal
  useEffect(() => {
    const completedProcesses = processos.filter(p => p.saida);
    if (completedProcesses.length > 0) {
      setHistoricalProcessos(prev => [...prev, ...completedProcesses]);
      setProcessos(prev => prev.filter(p => !p.saida));
    }
  }, [processos]);

  // Função para gerar o próximo número de romaneio
  const generateNextRomaneioNumber = () => {
    const allProcessos = [...processos, ...historicalProcessos];
    const highestId = Math.max(...allProcessos.map(p => p.id), 0);
    return highestId + 1;
  };

  // Função para formatar a data atual
  const getCurrentFormattedDateTime = () => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // Cálculos para os indicadores
  const totalProcessos = processos.length;
  const processosValidados = processos.filter(p => p.validado).length;
  const processosEmDoca = processos.filter(p => p.emDoca).length;
  const processosConcluidos = processos.filter(p => p.concluido).length;

  const handleConfirmAction = () => {
    if (!currentAction) return;

    const formattedDateTime = getCurrentFormattedDateTime();
    
    setProcessos(prev => 
      prev.map(processo => 
        processo.id === currentAction.id
          ? { 
              ...processo, 
              [currentAction.field]: true,
              ...(currentAction.field === 'validado' ? { validadoEm: formattedDateTime } : {}),
              ...(currentAction.field === 'emDoca' ? { emDocaEm: formattedDateTime } : {}),
              ...(currentAction.field === 'concluido' ? { concluidoEm: formattedDateTime } : {}),
              ...(currentAction.field === 'saida' ? { saidaEm: formattedDateTime } : {})
            }
          : processo
      )
    );
    
    // Se a ação é de saída, mostra uma confirmação
    if (currentAction.field === 'saida') {
      toast.success("Processo concluído e movido para o histórico");
    }

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

    const formattedDateTime = getCurrentFormattedDateTime();

    setProcessos(prev => 
      prev.map(processo => 
        processo.id === selectedProcessId
          ? { 
              ...processo, 
              doca: selectedDoca, 
              docaAlocadaEm: formattedDateTime,
              emDoca: false 
            }
          : processo
      )
    );

    toast.success(`Motorista direcionado para ${selectedDoca}`);
    setDocaDialogOpen(false);
    setSelectedProcessId(null);
    setSelectedDoca(null);
  };

  const handleTrocaDocaClick = (id: number) => {
    setSelectedProcessId(id);
    setTrocaDocaDialogOpen(true);
  };

  const handleRetrocessoClick = (id: number) => {
    setRetrocessoProcessoId(id);
    setRetrocessoDialogOpen(true);
  };

  const handleTrocaDoca = () => {
    if (!selectedProcessId || !selectedDoca) return;
    
    const formattedDateTime = getCurrentFormattedDateTime();
    
    setProcessos(prev => 
      prev.map(processo => 
        processo.id === selectedProcessId
          ? { 
              ...processo, 
              doca: selectedDoca, 
              docaAlocadaEm: formattedDateTime
            }
          : processo
      )
    );
    
    toast.success(`Doca alterada para ${selectedDoca}`);
    setTrocaDocaDialogOpen(false);
    setSelectedProcessId(null);
    setSelectedDoca(null);
  };

  const handleRetrocessoProcess = () => {
    if (!retrocessoProcessoId) return;
    
    const processo = processos.find(p => p.id === retrocessoProcessoId);
    if (!processo) return;
    
    // Logic to undo the last confirmed action
    if (processo.saida) {
      setProcessos(prev =>
        prev.map(p =>
          p.id === retrocessoProcessoId ? { ...p, saida: false, saidaEm: "" } : p
        )
      );
    } else if (processo.concluido) {
      setProcessos(prev =>
        prev.map(p =>
          p.id === retrocessoProcessoId ? { ...p, concluido: false, concluidoEm: "" } : p
        )
      );
    } else if (processo.emDoca) {
      setProcessos(prev =>
        prev.map(p =>
          p.id === retrocessoProcessoId ? { ...p, emDoca: false, emDocaEm: "" } : p
        )
      );
    } else if (processo.doca) {
      setProcessos(prev =>
        prev.map(p =>
          p.id === retrocessoProcessoId ? { ...p, doca: null, docaAlocadaEm: "" } : p
        )
      );
    } else if (processo.validado) {
      setProcessos(prev =>
        prev.map(p =>
          p.id === retrocessoProcessoId ? { ...p, validado: false, validadoEm: "" } : p
        )
      );
    }
    
    toast.success("Processo retrocedido com sucesso");
    setRetrocessoDialogOpen(false);
    setRetrocessoProcessoId(null);
  };

  const handleNovaPortariaSubmit = (data: any) => {
    const requiredFields = ['tipoMovimentacao', 'nomeMotorista', 'placaCavalo', 'tipoVeiculo'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Criar um novo registro com dados do formulário
    const newId = Math.max(...processos.map(p => p.id), ...historicalProcessos.map(p => p.id), 0) + 1;
    const formattedDateTime = getCurrentFormattedDateTime();
    
    const novoProcesso = {
      id: newId,
      dataHora: formattedDateTime,
      romaneio: generateNextRomaneioNumber(),
      tipoMov: data.tipoMovimentacao,
      motorista: data.nomeMotorista,
      cpfMotorista: data.cpfMotorista,
      telefoneMotorista: data.telefoneMotorista,
      placa: data.placaCavalo,
      placaCarreta: data.placaCarreta,
      veiculo: data.tipoVeiculo,
      transportadora: "", // Add empty transportadora field to fix type issue
      cnh: data.cnh,
      validado: false,
      validadoEm: "",
      doca: null,
      docaAlocadaEm: "",
      emDoca: false,
      emDocaEm: "",
      concluido: false,
      concluidoEm: "",
      saida: false,
      saidaEm: ""
    };

    setProcessos([...processos, novoProcesso]);
    setNovaPortariaOpen(false);
    form.reset();
    toast.success("Nova portaria registrada com sucesso");
  };

  const handleAddDoca = () => {
    if (!novaDoca) return;
    setDocasList([...docasList, novaDoca]);
    setNovaDoca("");
    toast.success("Nova doca adicionada com sucesso");
  };

  const handleDeleteItem = (type: string, value: string) => {
    setItemToDelete({type, value});
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'doca') {
      setDocasList(docasList.filter(d => d !== itemToDelete.value));
      toast.success("Doca removida com sucesso");
    } else if (itemToDelete.type === 'veiculo') {
      setVeiculosList(veiculosList.filter(v => v !== itemToDelete.value));
      toast.success("Tipo de veículo removido com sucesso");
    } else if (itemToDelete.type === 'tipoMov') {
      setTiposMovList(tiposMovList.filter(t => t !== itemToDelete.value));
      toast.success("Tipo de movimentação removido com sucesso");
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleEditItem = (type: string, value: string) => {
    setItemToEdit({type, value, newValue: value});
    setEditItemDialog(true);
  };

  const handleSaveEdit = () => {
    if (!itemToEdit.newValue.trim()) {
      toast.error("O campo não pode ficar vazio");
      return;
    }

    const {type, value, newValue} = itemToEdit;

    if (type === 'doca') {
      setDocasList(docasList.map(d => d === value ? newValue : d));
      toast.success("Doca editada com sucesso");
    } else if (type === 'veiculo') {
      setVeiculosList(veiculosList.map(v => v === value ? newValue : v));
      toast.success("Tipo de veículo editado com sucesso");
    } else if (type === 'tipoMov') {
      setTiposMovList(tiposMovList.map(t => t === value ? newValue : t));
      toast.success("Tipo de movimentação editado com sucesso");
    }

    setEditItemDialog(false);
  };

  const handleAddVeiculo = () => {
    if (!novoVeiculo) return;
    setVeiculosList([...veiculosList, novoVeiculo]);
    setNovoVeiculo("");
    toast.success("Novo tipo de veículo adicionado com sucesso");
  };

  const handleAddTipoMov = () => {
    if (!novoTipoMov) return;
    setTiposMovList([...tiposMovList, novoTipoMov]);
    setNovoTipoMov("");
    toast.success("Novo tipo de movimentação adicionado com sucesso");
  };

  const handleSaveMensagens = () => {
    toast.success("Mensagens salvas com sucesso");
    setMsgDialogOpen(false);
  };

  // This function builds the timeline events for a specific process
  const buildTimelineEvents = (processo: any) => {
    const events = [];

    // Validação
    events.push({
      type: 'validacao',
      timestamp: processo.validadoEm || 'Pendente',
      isActive: !!processo.validado
    });

    // Acionamento de Doca
    events.push({
      type: 'acionamento',
      timestamp: processo.docaAlocadaEm || 'Pendente',
      details: processo.doca ? `Doca designada: ${processo.doca}` : undefined,
      isActive: !!processo.doca
    });

    // Em Doca
    events.push({
      type: 'em-doca',
      timestamp: processo.emDocaEm || 'Pendente',
      isActive: !!processo.emDoca
    });

    // Conclusão
    events.push({
      type: 'conclusao',
      timestamp: processo.concluidoEm || 'Pendente',
      isActive: !!processo.concluido
    });

    // Saída/Finalização
    events.push({
      type: 'saida',
      timestamp: processo.saidaEm || 'Pendente',
      isActive: !!processo.saida
    });

    return events;
  };

  // Update the handleRowClick function to include timeline events
  const handleRowClick = (processo: any) => {
    setSelectedProcessDetails(processo);
    setTimelineEvents(buildTimelineEvents(processo));
    setDetailDialogOpen(true);
  };

  const filteredProcessos = processos.filter(processo => {
    if (searchTerm === "") return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    switch (searchType) {
      case "romaneio":
        return processo.romaneio.toString().includes(searchTerm);
      case "cpf":
        return processo.cpfMotorista?.toLowerCase().includes(searchLower) || false;
      case "placa":
        return processo.placa.toLowerCase().includes(searchLower);
      default:
        return true;
    }
  });

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (!messageToSend) {
      toast.error("Digite uma mensagem para enviar");
      return;
    }
    
    // Here you would integrate with your actual messaging system
    toast.success(`Mensagem enviada com sucesso para ${selectedProcessDetails?.motorista}`);
    setSendMessageDialogOpen(false);
    setMessageToSend("");
  };

  // Function to select a predefined message
  const handleSelectPredefinedMessage = (messageKey: keyof typeof mensagens) => {
    setMessageToSend(mensagens[messageKey]);
    setPredefinedMessage(messageKey);
  };

  // Adicione este useEffect dentro do componente Portaria
  useEffect(() => {
    const cpf = form?.watch && form.watch("cpfMotorista");
    if (cpf && cpf.replace(/\D/g, "").length === 11) {
      fetchMotoristaByCpf(cpf).then(motorista => {
        if (motorista) {
          form.setValue("nomeMotorista", motorista.nome);
          form.setValue("telefoneMotorista", motorista.telefone || "");
          form.setValue("cnh", motorista.cnh || "");
        }
      });
    }
    // eslint-disable-next-line
  }, [form?.watch && form.watch("cpfMotorista")]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Monitoramento de Portaria</h1>
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
            <Button 
              onClick={() => setConfigDialogOpen(true)} 
              className="bg-gray-700 hover:bg-gray-800"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <Button 
              onClick={() => navigate("/historico")} 
              className="bg-gray-600 hover:bg-gray-700"
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </Button>
            <Button 
              onClick={() => setNovaPortariaOpen(true)} 
              className="bg-blue-800 hover:bg-blue-900"
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
              <span className="text-3xl font-bold text-blue-800">{totalProcessos}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-sm text-gray-600">Processos Validados</span>
              <span className="text-3xl font-bold text-blue-800">{processosValidados}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-sm text-gray-600">Processos em Doca</span>
              <span className="text-3xl font-bold text-blue-800">{processosEmDoca}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <span className="text-sm text-gray-600">Processos Concluídos</span>
              <span className="text-3xl font-bold text-blue-800">{processosConcluidos}</span>
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
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-6 text-gray-500">
                    Nenhum processo em andamento
                  </TableCell>
                </TableRow>
              ) : (
                filteredProcessos.map((processo) => (
                  <TableRow 
                    key={processo.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(processo)}
                  >
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
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleStatusClick(processo.id, 'validado')}
                        className="focus:outline-none"
                      >
                        {processo.validado ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-blue-800" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleStatusClick(processo.id, 'emDoca')}
                        className="focus:outline-none"
                        disabled={!processo.validado || !processo.doca}
                      >
                        {processo.emDoca ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-blue-800" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleStatusClick(processo.id, 'concluido')}
                        className="focus:outline-none"
                        disabled={!processo.emDoca}
                      >
                        {processo.concluido ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-blue-800" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleStatusClick(processo.id, 'saida')}
                        className="focus:outline-none"
                        disabled={!processo.concluido}
                      >
                        {processo.saida ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-blue-800" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        {processo.doca && !processo.saida && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleTrocaDocaClick(processo.id)}
                            title="Trocar doca"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {processo.validado && !processo.saida && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-orange-500 hover:text-orange-700" 
                            onClick={() => handleRetrocessoClick(processo.id)}
                            title="Retroceder processo"
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
                {docasList.map((doca) => (
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
              className="bg-blue-800 hover:bg-blue-900"
              disabled={!selectedDoca}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Trocar Doca */}
      <Dialog open={trocaDocaDialogOpen} onOpenChange={setTrocaDocaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Trocar Doca</DialogTitle>
            <DialogDescription>
              Selecione a nova doca para a qual o motorista deve ser direcionado
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedDoca || ""} onValueChange={setSelectedDoca}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar doca" />
              </SelectTrigger>
              <SelectContent>
                {docasList.map((doca) => (
                  <SelectItem key={doca} value={doca}>
                    {doca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleTrocaDoca} 
              className="bg-blue-800 hover:bg-blue-900"
              disabled={!selectedDoca}
            >
              Confirmar Troca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Retroceder Processo */}
      <AlertDialog open={retrocessoDialogOpen} onOpenChange={setRetrocessoDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retroceder Processo</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação irá desfazer a última etapa confirmada do processo. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRetrocessoProcessoId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRetrocessoProcess}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Retroceder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  value={new Date().toLocaleString('pt-BR')}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  N° do Romaneio
                </label>
                <Input 
                  value={generateNextRomaneioNumber()}
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
                    {tiposMovList.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  CPF do Motorista <span className="text-red-500">*</span>
                </label>
                <InputMask
                  mask="999.999.999-99"
                  value={form.watch("cpfMotorista")}
                  onChange={e => form.setValue("cpfMotorista", e.target.value)}
                >
                  {(inputProps: any) => (
                    <Input 
                      {...inputProps}
                      placeholder="000.000.000-00"
                    />
                  )}
                </InputMask>
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
                <label className="text-sm font-medium">CNH</label>
                <Input 
                  {...form.register("cnh")}
                  placeholder="Número da CNH"
                  type="number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Placa Cavalo <span className="text-red-500">*</span>
                </label>
                <InputMask
                  mask="aaa-9a99"
                  value={form.watch("placaCavalo")}
                  onChange={e => form.setValue("placaCavalo", e.target.value.toUpperCase())}
                  formatChars={{
                    '9': '[0-9]',
                    'a': '[A-Za-z0-9]'
                  }}
                >
                  {(inputProps: any) => (
                    <Input 
                      {...inputProps}
                      placeholder="ABC-1234 ou ABC-1A23"
                    />
                  )}
                </InputMask>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Placa Carreta</label>
                <InputMask
                  mask="aaa-9a99"
                  value={form.watch("placaCarreta")}
                  onChange={e => form.setValue("placaCarreta", e.target.value.toUpperCase())}
                  formatChars={{
                    '9': '[0-9]',
                    'a': '[A-Za-z0-9]'
                  }}
                >
                  {(inputProps: any) => (
                    <Input 
                      {...inputProps}
                      placeholder="ABC-1234 ou ABC-1A23"
                    />
                  )}
                </InputMask>
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
                    {veiculosList.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone do Motorista</label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={form.watch("telefoneMotorista")}
                  onChange={e => form.setValue("telefoneMotorista", e.target.value)}
                >
                  {(inputProps: any) => (
                    <Input 
                      {...inputProps}
                      placeholder="(00) 00000-0000"
                    />
                  )}
                </InputMask>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-blue-800 hover:bg-blue-900 mt-4"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Configurações */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen} modal={true}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurações do Sistema</DialogTitle>
            <DialogDescription>
              Gerencie docas, veículos e mensagens do sistema
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="docas" value={configTab} onValueChange={setConfigTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="docas">Docas</TabsTrigger>
              <TabsTrigger value="veiculos">Veículos</TabsTrigger>
              <TabsTrigger value="tiposMov">Tipos Movimentação</TabsTrigger>
              <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
            </TabsList>
            
            <TabsContent value="docas" className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nome da nova doca"
                  value={novaDoca}
                  onChange={e => setNovaDoca(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddDoca}>Adicionar</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Docas Disponíveis</h3>
                <div className="space-y-2">
                  {docasList.map(doca => (
                    <div key={doca} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="font-medium ml-2">{doca}</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleEditItem('doca', doca)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                          onClick={() => handleDeleteItem('doca', doca)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="veiculos" className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nome do novo tipo de veículo"
                  value={novoVeiculo}
                  onChange={e => setNovoVeiculo(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddVeiculo}>Adicionar</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Tipos de Veículos</h3>
                <div className="space-y-2">
                  {veiculosList.map(veiculo => (
                    <div key={veiculo} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="font-medium ml-2">{veiculo}</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleEditItem('veiculo', veiculo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                          onClick={() => handleDeleteItem('veiculo', veiculo)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tiposMov" className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nome do novo tipo de movimentação"
                  value={novoTipoMov}
                  onChange={e => setNovoTipoMov(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddTipoMov}>Adicionar</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-4">Tipos de Movimentação</h3>
                <div className="space-y-2">
                  {tiposMovList.map(tipoMov => (
                    <div key={tipoMov} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="font-medium ml-2">{tipoMov}</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleEditItem('tipoMov', tipoMov)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700" 
                          onClick={() => handleDeleteItem('tipoMov', tipoMov)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mensagens" className="space-y-4">
              <Button 
                onClick={() => setMsgDialogOpen(true)}
                className="w-full"
              >
                Configurar Mensagens
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dialog de Configuração de Mensagens */}
      <Dialog open={msgDialogOpen} onOpenChange={setMsgDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuração de Mensagens</DialogTitle>
            <DialogDescription>
              Defina as mensagens que serão utilizadas para integração com API de disparo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem Inicial</label>
              <Textarea 
                value={mensagens.mensagemInicial}
                onChange={e => setMensagens({...mensagens, mensagemInicial: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Acionamento do Motorista</label>
              <Textarea 
                value={mensagens.acionamentoMotorista}
                onChange={e => setMensagens({...mensagens, acionamentoMotorista: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Estorno</label>
              <Textarea 
                value={mensagens.estorno}
                onChange={e => setMensagens({...mensagens, estorno: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Troca de Doca</label>
              <Textarea 
                value={mensagens.trocaDoca}
                onChange={e => setMensagens({...mensagens, trocaDoca: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Conclusão</label>
              <Textarea 
                value={mensagens.conclusao}
                onChange={e => setMensagens({...mensagens, conclusao: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Desocupar a Doca</label>
              <Textarea 
                value={mensagens.desocuparDoca}
                onChange={e => setMensagens({...mensagens, desocuparDoca: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Finalizar Processo</label>
              <Textarea 
                value={mensagens.finalizarProcesso}
                onChange={e => setMensagens({...mensagens, finalizarProcesso: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Retorno de Finalizados</label>
              <Textarea 
                value={mensagens.retornoFinalizados}
                onChange={e => setMensagens({...mensagens, retornoFinalizados: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Finalizar Processo (Insucesso)</label>
              <Textarea 
                value={mensagens.finalizarInsucesso}
                onChange={e => setMensagens({...mensagens, finalizarInsucesso: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmação de Cadastro de Motorista</label>
              <Textarea 
                value={mensagens.confirmacaoCadastro}
                onChange={e => setMensagens({...mensagens, confirmacaoCadastro: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSaveMensagens} className="bg-blue-800 hover:bg-blue-900">
              Salvar Mensagens
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação para Excluir Item */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para Editar Item */}
      <Dialog open={editItemDialog} onOpenChange={setEditItemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar {itemToEdit?.type === 'doca' ? 'Doca' : 
                                   itemToEdit?.type === 'veiculo' ? 'Veículo' :
                                   'Tipo de Movimentação'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={itemToEdit.newValue}
              onChange={e => setItemToEdit({...itemToEdit, newValue: e.target.value})}
              className="mb-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setEditItemDialog(false)} variant="outline">Cancelar</Button>
            <Button onClick={handleSaveEdit} className="bg-blue-800 hover:bg-blue-900">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para detalhes do processo com Timeline */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalhes do Processo #{selectedProcessDetails?.romaneio || ''}
            </DialogTitle>
            <DialogDescription>
              Registrado em {selectedProcessDetails?.dataHora || ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Motorista</h3>
              <p className="text-lg">{selectedProcessDetails?.motorista || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">CPF</h3>
              <p className="text-lg">{selectedProcessDetails?.cpfMotorista || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Placa</h3>
              <p className="text-lg">{selectedProcessDetails?.placa || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Placa Carreta</h3>
              <p className="text-lg">{selectedProcessDetails?.placaCarreta || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Veículo</h3>
              <p className="text-lg">{selectedProcessDetails?.veiculo || ''}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tipo Movimentação</h3>
              <p className="text-lg">{selectedProcessDetails?.tipoMov || ''}</p>
            </div>
          </div>
          
          {/* Linha do Tempo */}
          <div className="border-t pt-4">
            <Timeline events={timelineEvents} />
          </div>
          
          <DialogFooter>
            <Button onClick={() => setDetailDialogOpen(false)} variant="outline">
              Fechar
            </Button>
            <Button 
              onClick={() => {
                setSendMessageDialogOpen(true);
                setDetailDialogOpen(false);
              }} 
              className="bg-blue-800 hover:bg-blue-900"
            >
              Enviar Mensagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Enviar Mensagem Personalizada */}
      <Dialog open={sendMessageDialogOpen} onOpenChange={setSendMessageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Enviar Mensagem</DialogTitle>
            <DialogDescription>
              Envie uma mensagem personalizada para {selectedProcessDetails?.motorista}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagens Predefinidas</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={predefinedMessage === "mensagemInicial" ? "default" : "outline"} 
                  onClick={() => handleSelectPredefinedMessage("mensagemInicial")} 
                  className="text-xs h-auto py-2 justify-start"
                >
                  Mensagem Inicial
                </Button>
                <Button 
                  variant={predefinedMessage === "acionamentoMotorista" ? "default" : "outline"} 
                  onClick={() => handleSelectPredefinedMessage("acionamentoMotorista")} 
                  className="text-xs h-auto py-2 justify-start"
                >
                  Acionamento
                </Button>
                <Button 
                  variant={predefinedMessage === "trocaDoca" ? "default" : "outline"} 
                  onClick={() => handleSelectPredefinedMessage("trocaDoca")} 
                  className="text-xs h-auto py-2 justify-start"
                >
                  Troca de Doca
                </Button>
                <Button 
                  variant={predefinedMessage === "conclusao" ? "default" : "outline"} 
                  onClick={() => handleSelectPredefinedMessage("conclusao")} 
                  className="text-xs h-auto py-2 justify-start"
                >
                  Conclusão
                </Button>
                <Button 
                  variant={predefinedMessage === "desocuparDoca" ? "default" : "outline"} 
                  onClick={() => handleSelectPredefinedMessage("desocuparDoca")} 
                  className="text-xs h-auto py-2 justify-start"
                >
                  Desocupar Doca
                </Button>
                <Button 
                  variant={predefinedMessage === "finalizarProcesso" ? "default" : "outline"} 
                  onClick={() => handleSelectPredefinedMessage("finalizarProcesso")} 
                  className="text-xs h-auto py-2 justify-start"
                >
                  Finalizar Processo
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem Personalizada</label>
              <Textarea 
                value={messageToSend}
                onChange={(e) => {
                  setMessageToSend(e.target.value);
                  if (predefinedMessage && e.target.value !== mensagens[predefinedMessage]) {
                    setPredefinedMessage("");
                  }
                }}
                placeholder="Digite sua mensagem aqui..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                setSendMessageDialogOpen(false);
                setMessageToSend("");
                setPredefinedMessage("");
              }} 
              variant="outline"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSendMessage}
              className="bg-blue-800 hover:bg-blue-900"
              disabled={!messageToSend}
            >
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Portaria;
