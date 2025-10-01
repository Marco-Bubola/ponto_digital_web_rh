import React, { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';

const RelatoriosPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const handleExportPDF = () => {
    alert('Exportando relatório em PDF...');
  };

  const handleExportExcel = () => {
    alert('Exportando relatório em Excel...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-gray-600 mt-2">Gerar e exportar relatórios de ponto</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              Período
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline mr-2" size={16} />
              Funcionário
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos os funcionários</option>
              <option value="1">João Silva</option>
              <option value="2">Maria Santos</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={handleExportPDF} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Download size={16} />
              PDF
            </button>
            <button onClick={handleExportExcel} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Prévia do Relatório</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total de Horas</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">176h 30m</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Dias Trabalhados</p>
            <p className="text-2xl font-bold text-green-900 mt-1">22</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Atrasos</p>
            <p className="text-2xl font-bold text-yellow-900 mt-1">3</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Faltas</p>
            <p className="text-2xl font-bold text-red-900 mt-1">1</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entrada</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saída</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {new Date(2025, 0, i + 1).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">08:00</td>
                  <td className="px-4 py-3 text-sm text-gray-600">17:00</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">8h 00m</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Normal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;
