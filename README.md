# Brain Agriculture API

API backend desenvolvida em NestJS para gerenciamento agrícola, incluindo módulos de produtores rurais, fazendas, safras e culturas.

## Tecnologias utilizadas

- **NestJS** (Framework Node.js)
- **TypeScript** (Linguagem de programação)
- **TypeORM** (ORM para PostgreSQL)
- **PostgreSQL** (Banco de dados relacional)
- **Jest** (Testes automatizados)
- **UUID** (Identificadores únicos para entidades)
- **Class Validator** (Validação de dados)
- **Class Transformer** (Transformação de dados)


## Funcionalidades

### Módulo Producer (Produtores)
- ✅ Criar, listar, buscar, atualizar e remover produtores
- ✅ Validação de CPF/CNPJ
- ✅ Relacionamento com fazendas

### Módulo Farm (Fazendas)
- ✅ Gerenciamento completo de fazendas
- ✅ Validação de áreas (total, agrícola, vegetação)
- ✅ Relacionamento com produtores e safras

### Módulo Harvest (Safras)
- ✅ Controle de safras por fazenda
- ✅ Prevenção de duplicação de nomes por fazenda
- ✅ Relacionamento com culturas

### Módulo Crop (Culturas)
- ✅ Gerenciamento de culturas por safra
- ✅ Relacionamento com safras

## Como rodar o projeto

### Requisitos
- Node.js >= 18.x
- PostgreSQL >= 12.x
- npm ou yarn

### Passos

1. **Clone o repositório:**
\`\`\`bash
git clone <repo-url>
cd brain-agriculture-api
\`\`\`

2. **Instale as dependências:**
\`\`\`bash
npm install
\`\`\`

3. **Configure variáveis de ambiente:**
Copie e edite o `.env.example` para `.env`:


4. **Configure o banco de dados:**
Certifique-se de que o PostgreSQL está rodando e funcionando.


6. **Rode a aplicação:**
\`\`\`bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
\`\`\`

A API estará disponível em `http://localhost:3000`

## Testes

### Executar testes
\`\`\`bash
# Todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:cov


### Estrutura dos testes
- **Testes unitários**: Cada service possui seus testes em `src/modules/*/tests/`
- **Configuração**: Arquivo `test/setup.ts` com configurações globais
- **Mocks**: Repositórios mockados para isolamento dos testes

### Configuração do Jest
O projeto utiliza uma configuração customizada do Jest:
- **Timeout**: 30 segundos para testes assíncronos
- **Mocks**: Limpeza automática entre testes
- **TypeScript**: Suporte completo via ts-jest
- **Módulos**: Mapeamento de paths para imports absolutos

## Endpoints da API

### Produtores (`/producers`)
- `GET /producers` - Listar todos os produtores
- `GET /producers/:id` - Buscar produtor por ID
- `POST /producers` - Criar novo produtor
- `PATCH /producers/:id` - Atualizar produtor
- `DELETE /producers/:id` - Remover produtor

### Fazendas (`/farms`)
- `GET /farms` - Listar todas as fazendas
- `GET /farms/:id` - Buscar fazenda por ID
- `POST /farms` - Criar nova fazenda
- `PATCH /farms/:id` - Atualizar fazenda
- `DELETE /farms/:id` - Remover fazenda

### Safras (`/harvests`)
- `GET /harvests` - Listar todas as safras
- `GET /harvests/:id` - Buscar safra por ID
- `POST /harvests` - Criar nova safra
- `PATCH /harvests/:id` - Atualizar safra
- `DELETE /harvests/:id` - Remover safra

### Culturas (`/crops`)
- `GET /crops` - Listar todas as culturas
- `GET /crops/:id` - Buscar cultura por ID
- `GET /crops/harvest/:harvestId` - Listar culturas por safra
- `POST /crops` - Criar nova cultura
- `PATCH /crops/:id` - Atualizar cultura
- `DELETE /crops/:id` - Remover cultura

## Validações implementadas

- **CPF/CNPJ**: Validação de formato e dígitos verificadores
- **Áreas**: Soma das áreas agrícola e vegetação não pode exceder área total
- **Relacionamentos**: Validação de existência de entidades relacionadas
- **Duplicação**: Prevenção de nomes duplicados onde aplicável

## Arquitetura

### Padrões utilizados
- **Repository Pattern**: Abstração da camada de dados
- **DTO Pattern**: Validação e transformação de dados
- **Dependency Injection**: Inversão de controle via NestJS
- **Modular Architecture**: Separação por domínios de negócio

### Relacionamentos
\`\`\`
Producer (1) ←→ (N) Farm (1) ←→ (N) Harvest (N) ←→ (N) Crop
\`\`\`

## Troubleshooting

### Problemas comuns

1. **Erro de conexão com banco:**
   - Verifique se o PostgreSQL está rodando
   - Confirme as credenciais no arquivo `.env`

2. **Falhas nos testes:**
   - Execute `npm run test:clearCache`
   - Verifique se não há processos Jest em execução

3. **Imports não encontrados:**
   - Verifique o `tsconfig.json` e `jest.config.js`
   - Confirme os paths de módulos

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Considerações finais

- **Arquitetura modular**: Facilita manutenção e escalabilidade
- **UUIDs**: Identificadores únicos evitam conflitos
- **Validações robustas**: Garantem integridade dos dados
- **Testes abrangentes**: Cobertura dos cenários principais
- **TypeScript**: Type safety em todo o projeto
- **Documentação inline**: Código autodocumentado

## Contato

Em caso de dúvidas ou sugestões, entre em contato: mrcloabf@gmail.com

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
