import React, { useState } from 'react';
import { MessageSquare, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface Report {
  id: string;
  employeeName: string;
  subject: string;
  description: string;
  priority: 'baixa' | 'média' | 'alta';
  status: 'aberto' | 'em_analise' | 'resolvido';
  createdAt: string;
}

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports] = useState<Report[]>([
    {
      id: '1',
      employeeName: 'João Silva',
      subject: 'Erro no registro de ponto',
      description: 'O sistema não está registrando minha saída corretamente.',
      priority: 'alta',
      status: 'aberto',
      createdAt: '2025-01-15T10:30:00',
    },
    {
      id: '2',
      employeeName: 'Maria Santos',
      subject: 'Dúvida sobre banco de horas',
      description: 'Gostaria de saber como consultar meu saldo de horas.',
      priority: 'baixa',
      status: 'resolvido',
      createdAt: '2025-01-12T14:20:00',
    },
  ]);

  const handleResolve = (id: string) => {
    alert(`Report ${id} marcado como resolvido`);
    setSelectedReport(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'média':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aberto':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'em_analise':
        return <Clock className="text-yellow-500" size={20} />;
      case 'resolvido':
        return <CheckCircle2 className="text-green-500" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reports e Tickets</h1>
        <p className="text-gray-600 mt-2">Gerenciar solicitações e problemas reportados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Todos os Reports</h3>
          {reports.map((report) => (
            <div
              key={report.id}
              className={`card cursor-pointer hover:shadow-lg transition-shadow ${
                selectedReport?.id === report.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(report.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{report.subject}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.employeeName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Details */}
        <div className="card">
          {selectedReport ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Detalhes do Report</h3>
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
                  <label className="text-sm font-medium text-gray-700">Funcionário</label>
                  <p className="text-gray-900">{selectedReport.employeeName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Assunto</label>
                  <p className="text-gray-900">{selectedReport.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Descrição</label>
                  <p className="text-gray-900">{selectedReport.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Data de abertura</label>
                  <p className="text-gray-900">
                    {new Date(selectedReport.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className="text-gray-900 capitalize">{selectedReport.status.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <label className="text-sm font-medium text-gray-700">Responder</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={4}
                  placeholder="Digite sua resposta..."
                />
                <div className="flex gap-2">
                  <button className="btn-primary flex-1">Enviar Resposta</button>
                  {selectedReport.status !== 'resolvido' && (
                    <button
                      onClick={() => handleResolve(selectedReport.id)}
                      className="btn-secondary"
                    >
                      Marcar como Resolvido
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
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
