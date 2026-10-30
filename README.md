# NFT Marketplace — Frontend Challenge

Aplicação frontend de um marketplace de NFTs, desenvolvida com React, TypeScript e Vite como parte de um desafio técnico de desenvolvimento frontend.

O projeto apresenta um fluxo completo de navegação, descoberta de NFTs, carrinho, checkout simulado, autenticação demonstrativa e gerenciamento de endereços públicos de carteiras digitais.

## Tecnologias utilizadas

- React e TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- TanStack Query
- Axios
- Mock Service Worker (MSW)
- Socket.IO
- Vitest e React Testing Library
- Playwright
- axe-core para auditorias automatizadas de acessibilidade

## Funcionalidades

### Catálogo de NFTs

- Exibição de NFTs com imagens e informações.
- Pesquisa por nome, coleção ou criador.
- Filtragem por categoria.
- Ordenação por preço e itens recentes.
- Paginação.
- Página individual com detalhes e disponibilidade.

### Carrinho de compras

- Adição de NFTs ao carrinho.
- Ajuste de quantidades.
- Remoção de produtos.
- Cálculo de valores em ETH.
- Persistência dos dados no navegador.

### Checkout simulado

- Finalização demonstrativa de pedidos.
- Atualização do estoque simulado.
- Geração de comprovantes.
- Consulta dos detalhes de um pedido.

### Conta e carteiras

- Cadastro e login demonstrativos.
- Perfil de usuário.
- Encerramento de sessão.
- Cadastro e remoção de endereços públicos Ethereum.
- Proteção demonstrativa de páginas.

### Atualizações em tempo real

- Conexão Socket.IO.
- Indicador de conexão.
- Notificações de alteração de estoque.
- Atualização de consultas por meio do TanStack Query.
- Reconexão automática.

## Arquitetura

O frontend utiliza React e TypeScript, com organização por funcionalidades.

O TanStack Router gerencia as rotas e o TanStack Query gerencia o estado das requisições e o cache.

As chamadas HTTP são feitas com Axios e interceptadas pelo Mock Service Worker, que fornece uma API REST simulada.

Os dados demonstrativos são armazenados no `localStorage` do navegador.

O servidor Socket.IO é executado separadamente e retransmite notificações de atualização.

## Requisitos para execução

- Node.js compatível com as dependências do projeto.
- npm.
- Navegador moderno.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/nft-marketplace-challenge.git
```

Acesse a pasta:

```bash
cd nft-marketplace-challenge
```

Instale as dependências:

```bash
npm install
```

## Configuração

Crie o arquivo `.env.local` com:

```env
VITE_ENABLE_MOCKS=true
VITE_API_URL=/api
```

O MSW deve estar habilitado para executar as funcionalidades demonstrativas.

## Executando o projeto

Inicie o servidor Socket.IO em um terminal:

```bash
npx tsx server/socket.ts
```

Em outro terminal, execute o frontend:

```bash
npm run dev
```

Abra o endereço informado pelo Vite.

O Socket.IO utiliza, por padrão, a porta `3001`. O frontend utiliza o proxy configurado no Vite.

## Testes automatizados

Testes unitários:

```bash
npx vitest run
```

Testes de ponta a ponta:

```bash
npx playwright test
```

Testes de acessibilidade:

```bash
npx playwright test e2e/accessibility.spec.ts
```

Testes de responsividade:

```bash
npx playwright test e2e/responsive.spec.ts
```

Compilação:

```bash
npm run build
```

Para executar os testes E2E, pode ser necessário instalar o Chromium e suas dependências:

```bash
npx playwright install --with-deps chromium
```

## Limitações da demonstração

Este projeto utiliza uma infraestrutura simulada para fins de avaliação técnica.

- Não realiza transações blockchain reais.
- Não movimenta criptomoedas.
- Não conecta carteiras Ethereum de verdade.
- Não valida a propriedade de endereços blockchain.
- Não utiliza um sistema de autenticação de produção.
- As senhas de demonstração não são verificadas.
- O checkout não processa pagamentos reais.
- Os dados persistidos no navegador não constituem um banco de dados compartilhado entre usuários.
- O Socket.IO transmite notificações demonstrativas, sem fornecer uma fonte central e autoritativa de estoque.

Não utilize senhas pessoais, chaves privadas ou frases de recuperação neste aplicativo.

## Referência de design

Interface desenvolvida com base no desafio visual disponibilizado no Figma:

https://www.figma.com/design/Ff0SksUi7UFtPWUO8kyNtw/Frontend-Challenge?node-id=0-1

## Objetivo

Demonstrar competências em desenvolvimento frontend, organização de código, integração com APIs simuladas, gerenciamento de estado, navegação, responsividade, acessibilidade e testes automatizados.

## Autor

Ricardo de Brito ricardobrito10antifa@gmail.com  34984431825
Desenvolvido como projeto de avaliação técnica para uma oportunidade profissional em desenvolvimento frontend.