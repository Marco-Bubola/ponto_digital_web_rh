import React, { useState, useEffect } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import api from '@/services/api';

interface Employee {
  _id: string;
  name: string;
  email: string;
}

interface TimeRecord {
  _id: string;
  userId: string;
  date: string;
  entrada?: string;
  saida?: string;
  totalHours?: number;
}

const RelatoriosPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2025-01');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    daysWorked: 0,
    delays: 0,
    absences: 0
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      loadTimeRecords();
    }
  }, [selectedMonth, selectedEmployee]);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees');
      // Suporta resposta no formato { employees: [...] } ou somente [...]
      const payload = response.data && response.data.employees ? response.data.employees : response.data;
      setEmployees(Array.isArray(payload) ? payload : []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      setEmployees([]);
    }
  };

  const loadTimeRecords = async () => {
    setLoading(true);
    try {
      const [year, month] = selectedMonth.split('-');
      
      // Criar datas de início e fim do mês
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      
      const params: any = { 
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
      
      if (selectedEmployee !== 'all') {
        params.userId = selectedEmployee;
      }

      const response = await api.get('/time-records', { params });
      const records = response.data.records || [];
      setTimeRecords(records);

      // Calcular estatísticas
      let totalHours = 0;
      const daysSet = new Set();
      
      records.forEach((record: TimeRecord) => {
        if (record.totalHours) {
          totalHours += record.totalHours;
        }
        if (record.date) {
          daysSet.add(record.date);
        }
      });

      setStats({
        totalHours: Math.round(totalHours * 10) / 10,
        daysWorked: daysSet.size,
        delays: 0, // TODO: implementar lógica de atrasos
        absences: 0 // TODO: implementar lógica de faltas
      });
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      setTimeRecords([]);
      setStats({
        totalHours: 0,
        daysWorked: 0,
        delays: 0,
        absences: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text('Relatório de Ponto - Ponto Digital', 14, 22);
      
      // Informações do relatório
      doc.setFontSize(11);
      doc.text(`Período: ${selectedMonth}`, 14, 32);
      
      const selectedEmpName = selectedEmployee === 'all' 
        ? 'Todos os funcionários' 
        : employees.find(e => e._id === selectedEmployee)?.name || '';
      doc.text(`Funcionário: ${selectedEmpName}`, 14, 38);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 44);
      
      // Estatísticas
      doc.setFontSize(10);
      doc.setFillColor(240, 240, 240);
      doc.rect(14, 50, 182, 20, 'F');
      doc.text(`Total de Horas: ${formatHours(stats.totalHours)}`, 18, 58);
      doc.text(`Dias Trabalhados: ${stats.daysWorked}`, 18, 64);
      doc.text(`Atrasos: ${stats.delays}`, 100, 58);
      doc.text(`Faltas: ${stats.absences}`, 100, 64);
      
      // Tabela de registros
      const tableData = timeRecords.map(record => [
        new Date(record.date).toLocaleDateString('pt-BR'),
        record.entrada || '-',
        record.saida || '-',
        record.totalHours ? formatHours(record.totalHours) : '-',
        'Normal'
      ]);
      
      autoTable(doc, {
        startY: 75,
        head: [['Data', 'Entrada', 'Saída', 'Total Horas', 'Status']],
        body: tableData,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
      
      // Rodapé
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Salvar
      const fileName = `relatorio_ponto_${selectedMonth}_${Date.now()}.pdf`;
      doc.save(fileName);
      
      // Notificação de sucesso
      alert('✅ PDF exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('❌ Erro ao exportar PDF. Verifique o console.');
    }
  };

  const handleExportExcel = () => {
    try {
      // Preparar dados
      const excelData = timeRecords.map(record => ({
        'Data': new Date(record.date).toLocaleDateString('pt-BR'),
        'Entrada': record.entrada || '-',
        'Saída': record.saida || '-',
        'Total de Horas': record.totalHours ? formatHours(record.totalHours) : '-',
        'Status': 'Normal'
      }));
      
      // Criar worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Adicionar informações do cabeçalho
      const selectedEmpName = selectedEmployee === 'all' 
        ? 'Todos os funcionários' 
        : employees.find(e => e._id === selectedEmployee)?.name || '';
      
      XLSX.utils.sheet_add_aoa(ws, [
        ['Relatório de Ponto - Ponto Digital'],
        [`Período: ${selectedMonth}`],
        [`Funcionário: ${selectedEmpName}`],
        [`Data de geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`],
        [],
        ['Estatísticas do Período:'],
        [`Total de Horas: ${formatHours(stats.totalHours)}`],
        [`Dias Trabalhados: ${stats.daysWorked}`],
        [`Atrasos: ${stats.delays}`],
        [`Faltas: ${stats.absences}`],
        [],
        ['Registros de Ponto:']
      ], { origin: 'A1' });
      
      // Ajustar largura das colunas
      ws['!cols'] = [
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 10 }
      ];
      
      // Criar workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Relatório de Ponto');
      
      // Salvar
      const fileName = `relatorio_ponto_${selectedMonth}_${Date.now()}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      // Notificação de sucesso
      alert('✅ Excel exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('❌ Erro ao exportar Excel. Verifique o console.');
    }
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Relatórios</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Gerar e exportar relatórios de ponto</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline mr-2" size={16} />
              Período
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="inline mr-2" size={16} />
              Funcionário
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os funcionários</option>
              {Array.isArray(employees) && employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button 
              onClick={handleExportPDF} 
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Download size={16} />
              PDF
            </button>
            <button 
              onClick={handleExportExcel} 
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Download size={16} />
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Prévia do Relatório</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Carregando dados...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total de Horas</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300 mt-1">{formatHours(stats.totalHours)}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Dias Trabalhados</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300 mt-1">{stats.daysWorked}</p>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Atrasos</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-300 mt-1">{stats.delays}</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Faltas</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-300 mt-1">{stats.absences}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Entrada</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Saída</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {timeRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        Nenhum registro encontrado para o período selecionado
                      </td>
                    </tr>
                  ) : (
                    timeRecords.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                          {new Date(record.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {record.entrada || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {record.saida || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                          {record.totalHours ? formatHours(record.totalHours) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                            Normal
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RelatoriosPage;
