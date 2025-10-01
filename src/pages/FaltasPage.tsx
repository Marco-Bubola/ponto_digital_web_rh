import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface Absence {
  id: string;
  employeeName: string;
  date: string;
  reason: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  attachment?: string;
}

const FaltasPage: React.FC = () => {
  const [absences] = useState<Absence[]>([
    {
      id: '1',
      employeeName: 'João Silva',
      date: '2025-01-15',
      reason: 'Consulta médica',
      status: 'pendente',
      attachment: 'atestado.pdf',
    },
    {
      id: '2',
      employeeName: 'Maria Santos',
      date: '2025-01-12',
      reason: 'Acompanhamento familiar',
      status: 'aprovado',
    },
  ]);

  const handleApprove = (id: string) => {
    alert(`Falta ${id} aprovada`);
  };

  const handleReject = (id: string) => {
    alert(`Falta ${id} rejeitada`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Gestão de Faltas</h1>
        <p className="text-gray-600 mt-2">Revisar e aprovar justificativas de ausências</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pendentes</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">8</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>
        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Aprovadas</p>
              <p className="text-3xl font-bold text-green-900 mt-1">45</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="card bg-red-50 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Rejeitadas</p>
              <p className="text-3xl font-bold text-red-900 mt-1">3</p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </div>
      </div>

      {/* Absences List */}
      <div className="space-y-4">
        {absences.map((absence) => (
          <div key={absence.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{absence.employeeName}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      absence.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : absence.status === 'aprovado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {absence.status.charAt(0).toUpperCase() + absence.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Data:</strong> {new Date(absence.date).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Motivo:</strong> {absence.reason}
                </p>
                {absence.attachment && (
                  <button className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                    <FileText size={14} />
                    Ver anexo ({absence.attachment})
                  </button>
                )}
              </div>
              {absence.status === 'pendente' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(absence.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleReject(absence.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaltasPage;
