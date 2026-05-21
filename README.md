# BoardGame Vault

O **BoardGame Vault** é uma aplicação web fullstack desenvolvida para colecionadores e entusiastas de jogos de tabuleiro. Ele permite o gerenciamento completo de uma ludoteca pessoal, oferecendo um painel interativo com estatísticas de jogo e controle de status de cada título.

<img width="1902" height="939" alt="image" src="https://github.com/user-attachments/assets/398c38ee-a5b5-49ae-b314-e7663c5e8c40" />

## Funcionalidades

- **Autenticação Segura:** Sistema de Login e Cadastro utilizando tokens JWT (JSON Web Tokens).
- **Dashboard Interativo:** Painel de estatísticas em tempo real (Total de jogos, Jogando, Finalizados, Lista de Desejos).
- **Gestão Completa (CRUD):** - Adicione novos jogos com informações detalhadas (categoria, número de jogadores, tempo de partida, notas).
  - Edite informações de jogos existentes.
  - Exclua jogos do seu cofre.
- **Status Dinâmico:** Altere o status de um jogo (Quero jogar, Jogando, Zerado, Vendido, Emprestado) com um único clique direto no card.
- **Design Premium Dark:** Interface moderna e responsiva, com foco em usabilidade (UI/UX), utilizando CSS puro para animações fluidas e efeito *glassmorphism*.

## Tecnologias Utilizadas

O projeto foi construído separando as responsabilidades entre Front-end e Back-end.

**Front-end:**
- HTML5 & CSS3
- JavaScript Vanilla (ES6 Modules, Fetch API)
- Bootstrap 5 & Bootstrap Icons (Sistema de grids e ícones)

**Back-end:**
- Node.js
- Express.js (Roteamento e Middlewares)
- JSON (Persistência de dados em arquivos - *Storage local*)
- JsonWebToken (Segurança de rotas)
- Cors & Dotenv

## Como executar o projeto localmente

### Pré-requisitos
Antes de começar, você precisará ter o [Node.js](https://nodejs.org/) instalado em sua máquina e um editor de código como o [VS Code](https://code.visualstudio.com/).

### 1. Configurando a API (Back-end)
```bash
# Clone este repositório
$ git clone [https://github.com/daviimelo/BoardGameVault.git](https://github.com/daviimelo/BoardGameVault.git)

# Acesse a pasta do projeto (Back-end)
$ cd BoardGameVault/boardAPI

# Instale as dependências
$ npm install

# Crie um arquivo .env na raiz do boardAPI com o seguinte conteúdo:
# PORT=3003
# JWT_SECRET=sua_senha_secreta_aqui

# Inicie o servidor
$ npm start
