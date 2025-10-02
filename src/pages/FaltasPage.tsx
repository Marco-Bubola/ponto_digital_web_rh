import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import api from '@/services/api';

interface Absence {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
  date: string;
  reason: string;
  type: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  attachment?: {
    url: string;
    filename: string;
  };
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
}

const FaltasPage: React.FC = () => {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [absencesRes, statsRes] = await Promise.all([
        api.get('/absences'),
        api.get('/absences/stats')
      ]);
      
      setAbsences(absencesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/absences/${id}`, {
        status: 'aprovado',
        reviewNotes: 'Aprovado pelo RH'
      });
      loadData();
    } catch (error) {
      console.error('Erro ao aprovar falta:', error);
      alert('Erro ao aprovar falta');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.put(`/absences/${id}`, {
        status: 'rejeitado',
        reviewNotes: 'Rejeitado pelo RH'
      });
      loadData();
    } catch (error) {
      console.error('Erro ao rejeitar falta:', error);
      alert('Erro ao rejeitar falta');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestão de Faltas</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Revisar e aprovar justificativas de ausências</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-600 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pendentes</p>
              <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-300 mt-1">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-500 dark:text-yellow-400" size={32} />
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-600 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Aprovadas</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-300 mt-1">{stats.approved}</p>
            </div>
            <CheckCircle className="text-green-500 dark:text-green-400" size={32} />
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Rejeitadas</p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-300 mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="text-red-500 dark:text-red-400" size={32} />
          </div>
        </div>
      </div>

      {/* Absences List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Carregando ausências...</p>
          </div>
        ) : absences.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Nenhuma ausência encontrada</p>
          </div>
        ) : (
          absences.map((absence) => (
            <div key={absence._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{absence.userId.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        absence.status === 'pendente'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                          : absence.status === 'aprovado'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}
                    >
                      {absence.status.charAt(0).toUpperCase() + absence.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Departamento:</strong> {absence.userId.department}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <strong>Data:</strong> {new Date(absence.date).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Motivo:</strong> {absence.reason}
                  </p>
                  {absence.attachment && (
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      <FileText size={14} />
                      Ver anexo ({absence.attachment.filename})
                    </button>
                  )}
                </div>
                {absence.status === 'pendente' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(absence._id)}
                      className="px-4 py-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700 flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle size={16} />
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleReject(absence._id)}
                      className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 flex items-center gap-2 transition-colors"
                    >
                      <XCircle size={16} />
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FaltasPage;
