
import React from 'react';
import { Check, ArrowRight, RotateCcw, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  type: 'validacao' | 'acionamento' | 'troca-doca' | 'em-doca' | 'conclusao' | 'saida' | 'retrocesso' | 'insucesso';
  timestamp: string;
  details?: string;
  isActive: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline = ({ events }: TimelineProps) => {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'validacao':
        return <Check className="h-5 w-5" />;
      case 'acionamento':
      case 'troca-doca':
        return <ArrowRight className="h-5 w-5" />;
      case 'em-doca':
        return <Check className="h-5 w-5" />;
      case 'conclusao':
        return <Check className="h-5 w-5" />;
      case 'saida':
        return <Check className="h-5 w-5" />;
      case 'retrocesso':
        return <RotateCcw className="h-5 w-5" />;
      case 'insucesso':
        return <X className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getEventTitle = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'validacao':
        return 'Validação';
      case 'acionamento':
        return 'Acionamento de Doca';
      case 'troca-doca':
        return 'Troca de Doca';
      case 'em-doca':
        return 'Em Doca';
      case 'conclusao':
        return 'Conclusão';
      case 'saida':
        return 'Finalização';
      case 'retrocesso':
        return 'Retrocesso';
      case 'insucesso':
        return 'Finalizado com Insucesso';
      default:
        return 'Evento';
    }
  };

  const getEventColor = (type: TimelineEvent['type'], isActive: boolean) => {
    if (!isActive) return 'bg-gray-200 text-gray-500';
    
    switch (type) {
      case 'validacao':
      case 'acionamento':
      case 'em-doca':
      case 'conclusao':
      case 'saida':
        return 'bg-green-500 text-white';
      case 'troca-doca':
        return 'bg-blue-500 text-white';
      case 'retrocesso':
        return 'bg-orange-500 text-white';
      case 'insucesso':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-4 py-4">
      <h3 className="text-lg font-medium">Linha do Tempo</h3>
      <div className="relative border-l border-gray-200 pl-6 ml-4">
        {events.map((event, index) => (
          <div key={index} className="mb-8 relative">
            <div className={cn(
              "absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full z-10",
              getEventColor(event.type, event.isActive)
            )}>
              {getEventIcon(event.type)}
            </div>
            <div className="ml-2">
              <h3 className="text-lg font-semibold">{getEventTitle(event.type)}</h3>
              <time className="mb-1 text-sm font-normal leading-none text-gray-500">
                {event.timestamp}
              </time>
              {event.details && (
                <p className="text-base font-normal text-gray-600">
                  {event.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
