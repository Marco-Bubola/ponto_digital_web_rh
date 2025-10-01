# 🚀 Guia Rápido - Painel Web RH

## ✅ Sistema criado e funcionando!

O painel web para RH está rodando em: **http://localhost:3001**

---

## 📋 O que foi criado

### 1. **Sistema Completo de Interface**
- ✅ Painel de login moderno
- ✅ Layout responsivo com sidebar
- ✅ 5 páginas principais funcionais

### 2. **Páginas Implementadas**

#### 🏠 Dashboard (`/`)
- Estatísticas gerais (total de funcionários, faltas pendentes, reports, etc.)
- Atividades recentes
- Alertas do sistema
- Cards informativos

#### 👥 Funcionários (`/funcionarios`)
- Listagem de todos os funcionários
- Busca por nome, email ou departamento
- Botão para adicionar novo funcionário
- Ações de editar e excluir
- Informações: nome, email, cargo, departamento, telefone, status

#### 📊 Relatórios (`/relatorios`)
- Filtros por período (mês/ano)
- Seleção de funcionário específico ou todos
- Prévia do relatório com estatísticas
- Botões para exportar em PDF e Excel
- Tabela com registros de ponto

#### 📅 Faltas (`/faltas`)
- Cards com estatísticas (pendentes, aprovadas, rejeitadas)
- Listagem de todas as justificativas
- Visualização de anexos (atestados)
- Botões para aprovar ou rejeitar
- Status visual com cores

#### 💬 Reports/Tickets (`/reports`)
- Listagem de todos os tickets
- Sistema de prioridades (baixa, média, alta)
- Status (aberto, em análise, resolvido)
- Painel de detalhes ao clicar
- Campo para responder
- Botão para marcar como resolvido

---

## 🎯 Como usar agora

### 1. **Acessar o sistema**
1. Abra o navegador em: http://localhost:3001
2. Você verá a tela de login

### 2. **Fazer login**
- Por enquanto, aceita **qualquer email e senha** (é um mock para desenvolvimento)
- Exemplo:
  - Email: `rh@empresa.com`
  - Senha: `123456`

### 3. **Navegar pelo sistema**
- Use o menu lateral para acessar as diferentes seções
- Clique nos ícones ou nos nomes das páginas

### 4. **Testar funcionalidades**
- **Dashboard**: Veja as estatísticas gerais
- **Funcionários**: Busque e visualize a lista
- **Relatórios**: Selecione períodos e teste os botões de exportação
- **Faltas**: Veja justificativas e teste aprovar/rejeitar
- **Reports**: Clique em um ticket para ver detalhes

---

## 🔧 Próximos passos para produção

### 1. **Integrar com o backend**

Você precisará criar endpoints no backend Node.js (`ponto_digital_backend`):

```javascript
// Exemplo de rotas necessárias no backend

// Autenticação
router.post('/api/auth/login', ...);

// Funcionários
router.get('/api/employees', ...);
router.post('/api/employees', ...);
router.put('/api/employees/:id', ...);
router.delete('/api/employees/:id', ...);

// Relatórios
router.get('/api/reports/timecard', ...);
router.get('/api/reports/export/pdf', ...);
router.get('/api/reports/export/excel', ...);

// Faltas
router.get('/api/absences', ...);
router.put('/api/absences/:id/approve', ...);
router.put('/api/absences/:id/reject', ...);

// Tickets
router.get('/api/tickets', ...);
router.post('/api/tickets/:id/reply', ...);
router.put('/api/tickets/:id/resolve', ...);
```

### 2. **Substituir dados mockados por dados reais**

Edite os arquivos em `src/pages/`:
- Remova os arrays de dados mockados
- Use o serviço `api.ts` para fazer requisições
- Exemplo:

```typescript
// Antes (mock)
const [employees] = useState([...dados mockados...]);

// Depois (real)
const [employees, setEmployees] = useState([]);

useEffect(() => {
  api.get('/employees').then(res => {
    setEmployees(res.data);
  });
}, []);
```

### 3. **Implementar formulários completos**

O modal de "Novo Funcionário" está simplificado. Você precisa:
- Criar formulário completo com todos os campos
- Adicionar validações
- Implementar upload de foto/documentos
- Conectar com a API

### 4. **Implementar exportação real**

Para PDF e Excel, você precisa:

```typescript
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// PDF
const handleExportPDF = () => {
  const doc = new jsPDF();
  doc.text('Relatório de Ponto', 20, 20);
  // ... adicionar dados
  doc.save('relatorio.pdf');
};

// Excel
const handleExportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  XLSX.writeFile(wb, 'relatorio.xlsx');
};
```

---

## 🎨 Personalização

### Mudar cores
Edite `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#SUA_COR',
    600: '#SUA_COR_ESCURA',
  }
}
```

### Mudar logo/nome
Edite:
- `src/components/Layout.tsx` (sidebar)
- `src/pages/LoginPage.tsx` (tela de login)

---

## 📦 Comandos úteis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Parar servidor
Ctrl + C no terminal
```

---

## 🐛 Solução de problemas

### Porta 3001 já em uso
```bash
# No vite.config.ts, mude:
server: {
  port: 3002, // ou outra porta
}
```

### Erro de CORS
Configure o backend para aceitar requisições de `http://localhost:3001`

### Erro 404 ao acessar rotas diretas
Configure o servidor web para sempre retornar `index.html` (SPA)

---

## ✨ Recursos prontos para uso

- ✅ Interface moderna e responsiva
- ✅ Tailwind CSS configurado
- ✅ TypeScript
- ✅ Roteamento (React Router)
- ✅ Gerenciamento de estado (Zustand)
- ✅ Ícones (Lucide React)
- ✅ Requisições HTTP (Axios)
- ✅ Layout com sidebar retrátil
- ✅ Tema claro profissional
- ✅ Componentes reutilizáveis

---

## 📞 Estrutura de arquivos importantes

```
src/
├── App.tsx              # Rotas e proteção
├── main.tsx             # Entry point
├── components/
│   └── Layout.tsx       # Sidebar e estrutura
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── FuncionariosPage.tsx
│   ├── RelatoriosPage.tsx
│   ├── FaltasPage.tsx
│   └── ReportsPage.tsx
├── services/
│   └── api.ts           # Config Axios
└── stores/
    └── authStore.ts     # Estado de autenticação
```

---

## 🎯 Resumo

**O que está pronto:**
- ✅ Interface completa e funcional
- ✅ 5 módulos principais
- ✅ Design moderno e profissional
- ✅ Estrutura escalável

**O que falta (próximos passos):**
- ⏳ Conectar com backend real
- ⏳ Implementar formulários completos
- ⏳ Adicionar exportação real de PDF/Excel
- ⏳ Adicionar mais validações e tratamento de erros

**Acesse agora:** http://localhost:3001

Teste o sistema e me avise se precisar de ajustes ou novas funcionalidades!
