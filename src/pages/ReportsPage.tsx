import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import api from '@/services/api';

interface Ticket {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
  subject: string;
  description: string;
  priority: 'baixa' | 'média' | 'alta';
  status: 'aberto' | 'em_analise' | 'resolvido';
  createdAt: string;
  responses: Array<{
    userId: {
      name: string;
    };
    message: string;
    createdAt: string;
  }>;
}

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.put(`/tickets/${id}/resolve`);
      setSelectedReport(null);
      loadTickets();
    } catch (error) {
      console.error('Erro ao resolver ticket:', error);
      alert('Erro ao resolver ticket');
    }
  };

  const handleSendResponse = async () => {
    if (!selectedReport || !responseText.trim()) return;

    try {
      await api.post(`/tickets/${selectedReport._id}/responses`, {
        message: responseText
      });
      setResponseText('');
      loadTickets();
      
      // Atualizar o ticket selecionado
      const response = await api.get('/tickets');
      const updatedTicket = response.data.find((t: Ticket) => t._id === selectedReport._id);
      if (updatedTicket) {
        setSelectedReport(updatedTicket);
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      case 'média':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      default:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <AlertCircle className="text-red-500 dark:text-red-400" size={20} />;
      case 'em_analise':
        return <Clock className="text-yellow-500 dark:text-yellow-400" size={20} />;
      case 'resolvido':
        return <CheckCircle2 className="text-green-500 dark:text-green-400" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports e Tickets</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerenciar solicitações e problemas reportados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Todos os Tickets</h3>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Carregando tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">Nenhum ticket encontrado</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket._id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedReport?._id === ticket._id ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                }`}
                onClick={() => setSelectedReport(ticket)}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(ticket.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800 dark:text-white">{ticket.subject}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ticket.userId.name} - {ticket.userId.department}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Report Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {selectedReport ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Detalhes do Report</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    selectedReport.priority
                  )}`}
                >
                  Prioridade: {selectedReport.priority}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Funcionário</label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedReport.userId.name} - {selectedReport.userId.department}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Assunto</label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedReport.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedReport.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de abertura</label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(selectedReport.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">{selectedReport.status.replace('_', ' ')}</p>
                </div>

                {/* Responses */}
                {selectedReport.responses && selectedReport.responses.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Histórico de Respostas</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedReport.responses.map((response, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {response.userId.name} - {new Date(response.createdAt).toLocaleString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Responder</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Digite sua resposta..."
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleSendResponse}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Enviar Resposta
                  </button>
                  {selectedReport.status !== 'resolvido' && (
                    <button
                      onClick={() => handleResolve(selectedReport._id)}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Marcar como Resolvido
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Selecione um report para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
