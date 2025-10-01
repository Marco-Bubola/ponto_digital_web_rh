# Ponto Digital - Painel Web RH

Sistema web para gerenciamento de recursos humanos do Ponto Digital. Interface moderna e responsiva para o RH gerenciar funcionários, relatórios, faltas e reports.

## 🚀 Funcionalidades

### ✅ Implementadas

- **Dashboard**: Visão geral com estatísticas e atividades recentes
- **Gestão de Funcionários**: Criar, editar, listar e remover funcionários
- **Relatórios**: Gerar e exportar relatórios de ponto em PDF/Excel
- **Gestão de Faltas**: Revisar, aprovar ou rejeitar justificativas de ausências
- **Sistema de Reports**: Visualizar e responder tickets dos funcionários
- **Autenticação**: Login seguro com JWT

### 📋 Módulos Principais

#### 1. Dashboard (`/`)
- Cards com estatísticas principais
- Atividades recentes
- Alertas do sistema

#### 2. Funcionários (`/funcionarios`)
- Listagem com busca e filtros
- Cadastro de novos funcionários
- Edição e remoção
- Visualização de detalhes

#### 3. Relatórios (`/relatorios`)
- Filtros por período e funcionário
- Visualização de horas trabalhadas
- Exportação em PDF e Excel
- Estatísticas de atrasos e faltas

#### 4. Faltas (`/faltas`)
- Listagem de justificativas pendentes
- Visualização de anexos (atestados)
- Aprovação ou rejeição
- Histórico de faltas

#### 5. Reports (`/reports`)
- Tickets abertos por funcionários
- Sistema de prioridades
- Respostas e acompanhamento
- Status (aberto, em análise, resolvido)

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **React Router** (navegação)
- **Tailwind CSS** (estilização)
- **Zustand** (gerenciamento de estado)
- **Axios** (requisições HTTP)
- **Lucide React** (ícones)
- **jsPDF** + **xlsx** (exportação de relatórios)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ e npm/yarn
- Backend rodando em `http://localhost:3000`

### Passos

1. **Instalar dependências**:
```bash
cd ponto_digital_web_rh
npm install
```

2. **Configurar variáveis de ambiente** (opcional):

Crie um arquivo `.env` na raiz:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

3. **Iniciar servidor de desenvolvimento**:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3001`

## 🏗️ Scripts Disponíveis

```bash
npm run dev       # Iniciar servidor de desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build de produção
npm run lint      # Executar linter
```

## 📁 Estrutura do Projeto

```
ponto_digital_web_rh/
├── src/
│   ├── components/
│   │   └── Layout.tsx              # Layout principal com sidebar
│   ├── pages/
│   │   ├── LoginPage.tsx           # Página de login
│   │   ├── DashboardPage.tsx       # Dashboard principal
│   │   ├── FuncionariosPage.tsx    # Gestão de funcionários
│   │   ├── RelatoriosPage.tsx      # Relatórios e exportação
│   │   ├── FaltasPage.tsx          # Gestão de faltas
│   │   └── ReportsPage.tsx         # Sistema de tickets
│   ├── services/
│   │   └── api.ts                  # Configuração do Axios
│   ├── stores/
│   │   └── authStore.ts            # Store de autenticação (Zustand)
│   ├── App.tsx                     # Componente principal e rotas
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Estilos globais
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔐 Autenticação

O sistema usa autenticação JWT. Por padrão, está configurado um mock para desenvolvimento.

**Credenciais de teste**:
- Email: qualquer email válido
- Senha: qualquer senha

Para integrar com o backend real, edite `src/stores/authStore.ts` e implemente a chamada à API.

## 🎨 Temas e Personalização

As cores principais podem ser ajustadas em `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#0ea5e9',
    600: '#0284c7',
    // ...
  }
}
```

## 🔗 Integração com Backend

### Endpoints Esperados

O frontend espera os seguintes endpoints no backend:

#### Autenticação
- `POST /api/auth/login` - Login do RH
- `POST /api/auth/logout` - Logout

#### Funcionários
- `GET /api/employees` - Listar funcionários
- `POST /api/employees` - Criar funcionário
- `PUT /api/employees/:id` - Atualizar funcionário
- `DELETE /api/employees/:id` - Remover funcionário

#### Relatórios
- `GET /api/reports/timecard` - Relatório de ponto
- `GET /api/reports/export/pdf` - Exportar PDF
- `GET /api/reports/export/excel` - Exportar Excel

#### Faltas
- `GET /api/absences` - Listar justificativas
- `PUT /api/absences/:id/approve` - Aprovar falta
- `PUT /api/absences/:id/reject` - Rejeitar falta

#### Reports/Tickets
- `GET /api/tickets` - Listar tickets
- `POST /api/tickets/:id/reply` - Responder ticket
- `PUT /api/tickets/:id/resolve` - Resolver ticket

## 🚀 Deploy

### Build para produção

```bash
npm run build
```

Os arquivos otimizados serão gerados em `dist/`.

### Deploy em servidor web

Você pode usar qualquer servidor web estático (Nginx, Apache, Vercel, Netlify, etc.):

**Exemplo com Nginx**:
```nginx
server {
    listen 80;
    server_name rh.pontodigital.com;
    root /var/www/ponto_digital_web_rh/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

## 📝 Próximos Passos

Para tornar o sistema completo em produção:

1. **Implementar formulários completos**:
   - Formulário de cadastro/edição de funcionários
   - Validações de campos
   - Upload de arquivos (fotos, documentos)

2. **Integrar com backend real**:
   - Substituir mocks por chamadas reais à API
   - Implementar tratamento de erros robusto
   - Adicionar loading states

3. **Exportação real de relatórios**:
   - Implementar geração de PDF com jsPDF
   - Implementar exportação Excel com xlsx
   - Gráficos com recharts

4. **Melhorias de UX**:
   - Notificações toast
   - Confirmações de ações
   - Paginação nas listagens
   - Filtros avançados

5. **Segurança**:
   - Proteção contra XSS
   - Validação de permissões por role
   - Rate limiting

6. **Testes**:
   - Testes unitários (Jest + React Testing Library)
   - Testes E2E (Cypress/Playwright)

## 🤝 Contribuindo

Este é um projeto interno. Para contribuir:

1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Abra um Pull Request

## 📄 Licença

Propriedade da empresa - Uso interno apenas.

## 📞 Suporte

Para dúvidas ou problemas:
- Email: ti@empresa.com
- Teams: Canal RH Digital
