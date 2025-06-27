# Brain Agriculture API 🌾

Uma API REST completa para gerenciamento de produtores rurais, fazendas, safras e culturas, desenvolvida com NestJS, TypeScript e PostgreSQL.

## 📋 Índice

- [Características](#características)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
- [Documentação da API](#documentação-da-api)
- [Exemplos de Uso](#exemplos-de-uso)
- [Testes](#testes)
- [Monitoramento](#monitoramento)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## ✨ Características

- **Autenticação JWT** com refresh tokens
- **Autorização baseada em roles** (Admin, Gestor, Funcionário)
- **CRUD completo** para todas as entidades
- **Validação de dados** com class-validator
- **Documentação automática** com Swagger
- **Logs estruturados** com Winston
- **Métricas** com Prometheus
- **Health checks** para monitoramento
- **Testes unitários e E2E** com Jest
- **Docker** para containerização
- **Validação de CPF/CNPJ**

## 🛠 Tecnologias Utilizadas

- **Backend**: NestJS, TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT (jsonwebtoken)
- **Validação**: class-validator, class-transformer
- **Documentação**: Swagger/OpenAPI
- **Logs**: Winston
- **Métricas**: Prometheus
- **Monitoramento**: Grafana
- **Testes**: Jest, Supertest
- **Containerização**: Docker, Docker Compose

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **Git**

## 🚀 Instalação

### 1. Clone o repositório

git clone https://github.com/seu-usuario/brain-agriculture.git
cd brain-agriculture

### 2. Instale as dependências

npm install

### 3. Configure as variáveis de ambiente

Copie os arquivos de exemplo e configure as variáveis:

## ⚙️ Configuração de Ambiente

### Variáveis de Ambiente

Siga o exemplo do env.example e crie pelo menos o seguinte arquivo na pasta `env/`:

#### `env/.env.dev` (Desenvolvimento)

### Configuração do Docker

O projeto inclui arquivos Docker para facilitar o desenvolvimento:

- `docker-compose.yml` - Configuração principal
- `docker-compose.dev.yml` - Sobrescrita para desenvolvimento

Caso vá configurar para prod, apenas criar o arquivo com o comando de prod:
- `docker-compose.prod.yml` - Sobrescrita para produção

## 🏃‍♂️ Executando a Aplicação

### Opção 1: Com Docker (Recomendado)

#### Desenvolvimento
### Inicie todos os serviços (API, PostgreSQL, Prometheus, Grafana)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

### Visualize os logs
docker-compose logs -f api


### Verificando se está funcionando

Acesse: `http://localhost:3000`

Você deve ver: `Hello World!`

### OU
Acesse: `http://localhost:3000health`

Você deve ver: `{"status":"ok","info":{"database":{"status":"up"}},"error":{},"details":{"database":{"status":"up"}}}`


## 📚 Documentação da API

A documentação interativa da API está disponível via Swagger:

- **URL**: `http://localhost:3000/api`
- **Formato**: OpenAPI 3.0

### Endpoints Principais

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/login` | Login do usuário | ❌ |
| POST | `/auth/refresh-token` | Renovar token | ❌ |
| POST | `/users` | Criar usuário | ❌ |
| GET | `/users` | Listar usuários | ✅ Admin |
| POST | `/producers` | Criar produtor | ✅ Admin/Gestor |
| GET | `/producers` | Listar produtores | ✅ Admin |
| POST | `/farms` | Criar fazenda | ✅ Admin/Gestor |
| GET | `/farms` | Listar fazendas | ✅ Admin |
| POST | `/crops` | Criar cultura | ✅ Admin/Gestor |
| GET | `/crops` | Listar culturas | ✅ Admin |
| POST | `/harvests` | Criar safra | ✅ Admin/Gestor |
| GET | `/harvests` | Listar safras | ✅ Admin |
| GET | `/health` | Health check | ❌ |
| GET | `/metrics` | Métricas Prometheus | ❌ |

## 🔧 Exemplos de Uso

### 1. Criando um Usuário

```bash
curl -X POST http://localhost:3000/users 
  -H "Content-Type: application/json" 
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "MinhaSenh@123",
    "role": "admin"
  }'
```

**Resposta:**
```json
{
  "id": "uuid-gerado",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "role": "admin",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

### 2. Fazendo Login

```bash
curl -X POST http://localhost:3000/auth/login 
  -H "Content-Type: application/json" 
  -d '{
    "email": "joao@exemplo.com",
    "password": "MinhaSenh@123"
  }'
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Criando um Produtor

```bash
curl -X POST http://localhost:3000/producers 
  -H "Content-Type: application/json" 
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" 
  -d '{
    "name": "Maria Santos",
    "document": "12345678901"
  }'
```

**Resposta:**
```json
{
  "id": "uuid-gerado",
  "name": "Maria Santos",
  "document": "12345678901",
  "farms": []
}
```

### 4. Criando uma Fazenda

```bash
curl -X POST http://localhost:3000/farms 
  -H "Content-Type: application/json" 
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" 
  -d '{
    "name": "Fazenda Esperança",
    "city": "São Paulo",
    "state": "SP",
    "totalArea": 100,
    "agriculturalArea": 70,
    "vegetationArea": 30,
    "producerId": "uuid-do-produtor"
  }'
```

### 5. Criando uma Cultura

```bash
curl -X POST http://localhost:3000/crops 
  -H "Content-Type: application/json" 
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" 
  -d '{
    "name": "Soja"
  }'
```

### 6. Criando uma Safra

```bash
curl -X POST http://localhost:3000/harvests 
  -H "Content-Type: application/json" 
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" 
  -d '{
    "name": "Safra Verão 2024",
    "farmId": "uuid-da-fazenda",
    "crops": ["uuid-cultura-1", "uuid-cultura-2"]
  }'
```

### 7. Consultando Health Check

```bash
curl http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

## 🧪 Testes

### Executando Testes

```bash
# Testes unitários
npm run test

# Testes unitários com watch
npm run test:watch

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

## 📊 Monitoramento

### Métricas com Prometheus

Acesse: `http://localhost:9090`

Métricas disponíveis:
- `http_requests_total` - Total de requisições HTTP
- `http_request_duration_seconds` - Duração das requisições
- `http_requests_in_progress` - Requisições em andamento
e muito mais.. convido a explorar.

### Dashboard com Grafana

Acesse: `http://localhost:3001`

- **Usuário**: admin
- **Senha**: admin

### Logs

Os logs são salvos em:
- `logs/combined.log` - Todos os logs
- `logs/error.log` - Apenas erros

## 📁 Estrutura do Projeto

```
src/
├── common/                 # Código compartilhado
│   ├── decorators/        # Decorators customizados
│   ├── guards/           # Guards de autenticação/autorização
│   ├── interceptors/     # Interceptors
│   ├── middleware/       # Middlewares
│   └── validators/       # Validadores customizados
├── config/               # Configurações
│   ├── logger.config.ts  # Configuração do Winston
│   └── typeorm.config.ts # Configuração do TypeORM
├── modules/              # Módulos da aplicação
│   ├── auth/            # Autenticação
│   ├── user/            # Usuários
│   ├── producer/        # Produtores
│   ├── farm/            # Fazendas
│   ├── crop/            # Culturas
│   ├── harvest/         # Safras
│   ├── health/          # Health checks
│   └── metrics/         # Métricas
├── app.module.ts        # Módulo principal
└── main.ts             # Ponto de entrada
```

### Padrão dos Módulos

Cada módulo segue a estrutura:

```
module/
├── dto/                 # Data Transfer Objects
├── entities/           # Entidades do banco
├── tests/             # Testes unitários
├── module.controller.ts # Controller
├── module.service.ts   # Service
└── module.module.ts    # Module
```

## 🔐 Autenticação e Autorização

### Roles Disponíveis

- **ADMIN**: Acesso total ao sistema
- **GESTOR**: Pode gerenciar produtores, fazendas, culturas e safras
- **FUNCIONARIO**: Acesso apenas para consulta

### Fluxo de Autenticação

1. **Login**: POST `/auth/login` com email/senha
2. **Recebe**: Access token (15min) + Refresh token (7 dias)
3. **Usa**: Access token no header `Authorization: Bearer <token>`
4. **Renova**: POST `/auth/refresh-token` quando access token expira

### Exemplo de Uso com Token

```javascript
// 1. Login
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    password: 'senha123'
  })
});

const { accessToken } = await loginResponse.json();

// 2. Usar token nas requisições
const response = await fetch('/producers', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

## 🚨 Tratamento de Erros

A API retorna erros padronizados:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Códigos de Status Comuns

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Não autorizado
- **404**: Não encontrado
- **409**: Conflito (ex: email já existe)
- **500**: Erro interno do servidor

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev        # Inicia com hot reload
npm run start:debug      # Inicia com debug

# Produção
npm run build           # Compila o projeto
npm run start:prod      # Inicia versão de produção

# Testes
npm run test           # Testes unitários
npm run test:watch     # Testes com watch
npm run test:e2e       # Testes E2E
npm run test:cov       # Coverage

# Linting
npm run lint           # Executa ESLint
npm run lint:fix       # Corrige problemas automaticamente

# Formatação
npm run format         # Formata código com Prettier
```

## 🐳 Docker

### Comandos Úteis

```bash
# Construir imagens
docker-compose build

# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar serviços
docker-compose down

# Limpar volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### Portas dos Serviços

- **API**: 3000
- **PostgreSQL**: 5432
- **Prometheus**: 9090
- **Grafana**: 3001

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use **TypeScript** para tipagem forte
- Siga os padrões do **ESLint** e **Prettier**
- Escreva **testes** para novas funcionalidades
- Documente **endpoints** no Swagger
- Use **commits semânticos**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação da API](http://localhost:3000/api)
2. Consulte os [logs da aplicação](logs/)
3. Abra uma [issue](https://github.com/seu-usuario/brain-agriculture/issues)

---

**Desenvolvido com ❤️ para o agronegócio brasileiro** 🇧🇷
