# BoraVer 🎬

Descubra rapidamente um filme ou série para assistir com base em seus filtros preferidos!

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/vinicius-pascoal/BoraVer.git
cd BoraVer
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave da API TMDB:

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

Para obter sua chave da API TMDB:
1. Crie uma conta em [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Vá para [Settings > API](https://www.themoviedb.org/settings/api)
3. Copie sua chave de API

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 📋 Funcionalidades

- ✅ Sortear filmes, séries ou ambos
- ✅ Filtros por gênero
- ✅ Filtros por plataforma de streaming
- ✅ Filtros por duração (para filmes)
- ✅ Exibição de pôster, título, sinopse
- ✅ Design responsivo
- ✅ Interface intuitiva e rápida

## 🛠️ Stack

- **Next.js** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TMDB API** - Dados de filmes e séries
- **Vercel** - Deploy

## 📁 Estrutura do Projeto

```
BoraVer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── random-content/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ContentCard.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   ├── lib/
│   │   └── tmdb.ts
│   └── types/
│       └── index.ts
├── public/
├── .env.local (não versionado)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Deploy na Vercel

1. Faça push do seu código para GitHub
2. Conecte seu repositório na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático!

## 📝 Desenvolvimento

### Comandos disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Linting
npm run lint
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🙏 Agradecimentos

- [The Movie Database (TMDB)](https://www.themoviedb.org/) pelos dados
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Contato

Dúvidas? Abra uma [issue](https://github.com/vinicius-pascoal/BoraVer/issues)!

---

Desenvolvido com ❤️ por [Vinicius Pascoal](https://github.com/vinicius-pascoal)
