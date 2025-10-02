import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, Save, X } from 'lucide-react';
import api from '@/services/api';

interface Employee {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  cpf: string;
  isActive: boolean;
  role?: string;
  company?: {
    name: string;
    emailDomain: string;
  };
}

const FuncionariosPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // Formulário
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    department: '',
    position: '',
    phone: '',
  });
  const [tempPassword, setTempPassword] = useState('');

  // Carregar funcionários
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      alert('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        cpf: employee.cpf,
        department: employee.department,
        position: employee.position,
        phone: employee.phone || '',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        cpf: '',
        department: '',
        position: '',
        phone: '',
      });
    }
    setTempPassword('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingEmployee) {
        // Atualizar
        await api.put(`/employees/${editingEmployee._id || editingEmployee.id}`, formData);
        alert('Funcionário atualizado com sucesso!');
      } else {
        // Criar
        const response = await api.post('/employees', formData);
        setTempPassword(response.data.temporaryPassword);
        alert(`Funcionário criado!\n\nEmail: ${response.data.employee.email}\nSenha temporária: ${response.data.temporaryPassword}\n\nInforme estas credenciais ao funcionário.`);
      }
      
      await loadEmployees();
      
      if (!tempPassword) {
        setShowModal(false);
      }
    } catch (error: any) {
      console.error('Erro ao salvar funcionário:', error);
      alert(error.response?.data?.error || 'Erro ao salvar funcionário');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente desativar este funcionário?')) return;
    
    try {
      await api.delete(`/employees/${id}`);
      alert('Funcionário desativado com sucesso');
      loadEmployees();
    } catch (error) {
      console.error('Erro ao desativar funcionário:', error);
      alert('Erro ao desativar funcionário');
    }
  };

  return (
    <div className="space-y-6 bg-gray-100 dark:bg-gray-900 min-h-screen p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Funcionários</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Gerenciar cadastro de funcionários</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Novo Funcionário
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, email ou departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => (
                <tr key={employee._id || employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{employee.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Mail size={14} /> {employee.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{employee.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{employee.position}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <Phone size={14} /> {employee.phone}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.isActive
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {employee.isActive ? 'ativo' : 'inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(employee)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(employee._id || employee.id!)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal com formulário completo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h2>
            
            {tempPassword && (
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 p-4 rounded-lg mb-4">
                <p className="font-bold text-green-800 dark:text-green-200">✅ Funcionário criado com sucesso!</p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                  <strong>Email:</strong> {employees[employees.length - 1]?.email}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Senha temporária:</strong> <code className="bg-green-100 dark:bg-green-800 px-2 py-1 rounded">{tempPassword}</code>
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ⚠️ Informe estas credenciais ao funcionário
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="00000000000"
                    maxLength={11}
                    required
                    disabled={!!editingEmployee}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Departamento * 
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Marketing">Marketing</option>
                    <option value="TI">TI / Tecnologia</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">Recursos Humanos</option>
                    <option value="Operações">Operações</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    O email será gerado automaticamente: departamento@empresa.com
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Ex: Analista, Gerente..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : editingEmployee ? 'Atualizar' : 'Criar Funcionário'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)} 
                  className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuncionariosPage;
