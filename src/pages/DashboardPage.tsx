import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar, TrendingUp, Clock, Coffee, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface DashboardStats {
  totalEmployees: number;
  activeToday: number;
  workingNow: number;
  onBreak: number;
  monthRecords: number;
  byDepartment: { _id: string; count: number }[];
  recordsByDay: { _id: string; count: number }[];
  companies?: { _id: string; name: string; employeeCount: number; activeToday: number }[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stats/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  const mainStats = [
    {
      icon: Users,
      label: 'Total de Funcionários',
      value: stats?.totalEmployees || 0,
      change: `${stats?.activeToday || 0} ativos hoje`,
      color: 'bg-blue-500',
    },
    {
      icon: Clock,
      label: 'Trabalhando Agora',
      value: stats?.workingNow || 0,
      change: 'Funcionários em horário',
      color: 'bg-green-500',
    },
    {
      icon: Coffee,
      label: 'Em Pausa',
      value: stats?.onBreak || 0,
      change: 'Intervalo/Almoço',
      color: 'bg-yellow-500',
    },
    {
      icon: FileText,
      label: 'Registros do Mês',
      value: stats?.monthRecords || 0,
      change: 'Total de pontos',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8 bg-gray-100 dark:bg-gray-900 min-h-screen p-6 transition-colors">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {user?.role === 'admin' 
            ? 'Visão geral de todas as empresas' 
            : `Visão geral - ${user?.company?.name || 'Sua empresa'}`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin: Companies Stats */}
      {user?.role === 'admin' && stats?.companies && stats.companies.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Empresas no Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.companies.map((company) => (
              <div 
                key={company._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{company.name}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {company.employeeCount} funcionários
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {company.activeToday} ativos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Funcionários por Departamento
          </h3>
          <div className="space-y-3">
            {stats?.byDepartment && stats.byDepartment.length > 0 ? (
              stats.byDepartment.map((dept, index) => {
                const maxCount = Math.max(...stats.byDepartment.map(d => d.count));
                const percentage = (dept.count / maxCount) * 100;
                
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">{dept._id || 'Sem departamento'}</span>
                      <span className="text-gray-600 dark:text-gray-400">{dept.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Nenhum dado disponível
              </p>
            )}
          </div>
        </div>

        {/* Weekly Records */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Registros dos Últimos 7 Dias
          </h3>
          <div className="space-y-3">
            {stats?.recordsByDay && stats.recordsByDay.length > 0 ? (
              stats.recordsByDay.map((day, index) => {
                const maxCount = Math.max(...stats.recordsByDay.map(d => d.count));
                const percentage = (day.count / maxCount) * 100;
                const date = new Date(day._id);
                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
                
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{dayName}</span>
                      <span className="text-gray-600 dark:text-gray-400">{day.count} registros</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Nenhum dado disponível
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/funcionarios')}
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Users className="w-8 h-8 text-blue-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Novo Funcionário</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cadastrar funcionário</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/relatorios')}
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FileText className="w-8 h-8 text-green-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Gerar Relatório</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Relatórios de ponto</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/faltas')}
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Calendar className="w-8 h-8 text-yellow-500" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Ver Faltas</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ausências pendentes</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

