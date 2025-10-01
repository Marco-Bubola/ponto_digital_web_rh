import React from 'react';
import { Users, FileText, Calendar, TrendingUp } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const stats = [
    {
      icon: Users,
      label: 'Total de Funcionários',
      value: '248',
      change: '+12 este mês',
      color: 'bg-blue-500',
    },
    {
      icon: Calendar,
      label: 'Faltas Pendentes',
      value: '8',
      change: '3 aguardando análise',
      color: 'bg-yellow-500',
    },
    {
      icon: FileText,
      label: 'Reports Abertos',
      value: '15',
      change: '5 alta prioridade',
      color: 'bg-red-500',
    },
    {
      icon: TrendingUp,
      label: 'Taxa de Presença',
      value: '94.5%',
      change: '+2.3% vs mês anterior',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema de ponto</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Atividades Recentes</h3>
          <div className="space-y-4">
            {[
              {
                user: 'João Silva',
                action: 'registrou ponto de entrada',
                time: 'há 5 minutos',
              },
              {
                user: 'Maria Santos',
                action: 'solicitou justificativa de falta',
                time: 'há 15 minutos',
              },
              {
                user: 'Pedro Oliveira',
                action: 'abriu um report',
                time: 'há 1 hora',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.user} <span className="font-normal text-gray-600">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Alertas do Sistema</h3>
          <div className="space-y-3">
            {[
              {
                type: 'warning',
                message: '8 funcionários com mais de 3 faltas não justificadas',
              },
              {
                type: 'info',
                message: '12 relatórios mensais prontos para download',
              },
              {
                type: 'success',
                message: 'Sistema atualizado com sucesso',
              },
            ].map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  alert.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-800'
                    : alert.type === 'info'
                    ? 'bg-blue-50 text-blue-800'
                    : 'bg-green-50 text-green-800'
                }`}
              >
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
