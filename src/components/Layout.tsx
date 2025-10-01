import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Building2,
  Moon,
  Sun,
} from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Aplicar tema ao carregar
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'manager', 'hr'] },
    { icon: Building2, label: 'Empresas', path: '/empresas', roles: ['admin'] },
    { icon: Users, label: 'Funcionários', path: '/funcionarios', roles: ['admin', 'manager', 'hr'] },
    { icon: FileText, label: 'Relatórios', path: '/relatorios', roles: ['admin', 'manager', 'hr'] },
    { icon: Calendar, label: 'Faltas', path: '/faltas', roles: ['admin', 'manager', 'hr'] },
    { icon: MessageSquare, label: 'Ocorrências', path: '/reports', roles: ['admin', 'manager', 'hr'] },
  ];

  // Filtrar menu items baseado no role do usuário
  const visibleMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">Ponto Digital</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} className="dark:text-gray-300" /> : <Menu size={20} className="dark:text-gray-300" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-gray-700 space-y-2">
          {/* Toggle Dark Mode */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {sidebarOpen && <span className="font-medium">{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
          </button>

          {sidebarOpen && user && (
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">
                {user.role === 'admin' ? 'Administrador' : user.role === 'manager' ? 'Coordenador' : 'RH'}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
