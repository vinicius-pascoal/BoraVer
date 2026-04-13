# 📋 Guia de Desenvolvimento - BoraVer

## Estrutura do Projeto

Este documento descreve a estrutura do projeto BoraVer e como as diferentes partes trabalham juntas.

### Arquitetura

```
┌─────────────────────────────────────────┐
│         Frontend (Next.js)              │
│  page.tsx → Home Component              │
└────────────────────┬────────────────────┘
                     │ Chamadas HTTP
┌────────────────────▼────────────────────┐
│    API Route (Next.js Backend)          │
│    /api/random-content                  │
└────────────────────┬────────────────────┘
                     │ Requisições
┌────────────────────▼────────────────────┐
│      TMDB API                           │
│  Filmes, Séries, Plataformas            │
└─────────────────────────────────────────┘
```

## Componentes Principais

### 1. **Header** (`src/components/Header.tsx`)
- Logo e branding
- Navegação fixa no topo
- Responsivo em mobile

### 2. **FilterPanel** (`src/components/FilterPanel.tsx`)
Gerencia todos os filtros:
- Tipo de conteúdo (filme, série, ambos)
- Gêneros (até 10 opções)
- Plataformas de streaming (6 opções)
- Duração (apenas para filmes)

### 3. **ContentCard** (`src/components/ContentCard.tsx`)
Exibe o conteúdo sorteado com:
- Pôster em alta qualidade
- Informações completas
- Plataformas disponíveis
- Botão para sortear novamente

### 4. **Footer** (`src/components/Footer.tsx`)
- Créditos
- Link para TMDB API
- Link para GitHub

## Fluxo de Dados

```
1. Usuário seleciona filtros → FilterPanel atualiza estado
2. Clica em "SORTEAR" → fetchRandomContent é chamado
3. Requisição GET para /api/random-content com parâmetros
4. API route processafilters e chama funções em lib/tmdb.ts
5. TMDB API retorna conteúdo aleatório
6. Dados exibidos em ContentCard
7. Usuário pode sortear novamente ou ajustar filtros
```

## API Interna

### GET `/api/random-content`

**Parâmetros Query:**
```typescript
{
  type: "movie" | "tv" | "both"
  genres: JSON.stringify([28, 35, ...])    // IDs dos gêneros
  platforms: JSON.stringify([...])         // Nomes das plataformas
  region: "BR"                              // Código do país (padrão: BR)
  duration?: "short" | "medium" | "long"   // Opcional, só para filmes
}
```

**Response (200 OK):**
```json
{
  "id": 550,
  "title": "Fight Club",
  "media_type": "movie",
  "year": 1999,
  "poster_path": "/...",
  "overview": "...",
  "genres": [{"id": 28, "name": "Ação"}],
  "runtime": 139,
  "providers": [
    {"provider_id": 8, "provider_name": "Netflix"}
  ]
}
```

## Integrações Externas

### TMDB API
- **Autenticação:** Chave API
- **Endpoint Principal:** `https://api.themoviedb.org/3`
- **Recursos Usados:**
  - `GET /discover/movie`
  - `GET /discover/tv`
  - `GET /movie/{id}` / `GET /tv/{id}`
  - `GET /movie/{id}/watch/providers`
  - `GET /tv/{id}/watch/providers`

### Mapeamentos Importantes

**Gêneros (TMDB):**
```typescript
28   → Ação
35   → Comédia
18   → Drama
27   → Terror
878  → Ficção Científica
10749→ Romance
53   → Suspense
16   → Animação
12   → Aventura
80   → Criminal
```

**Plataformas (TMDB Provider IDs):**
```
8    → Netflix
119  → Prime Video
337  → Disney+
445  → Max
350  → Apple TV+
74   → Globoplay
105  → Crunchyroll
15   → Hulu
```

## Desenvolvimento Futuro

### Melhorias Planejadas
- [ ] Adicionar autenticação de usuários
- [ ] Sistema de favoritos
- [ ] Histórico de sorteios
- [ ] Sistema de avaliações
- [ ] Busca textual avançada
- [ ] Painel administrativo
- [ ] Banco de dados (Prisma + PostgreSQL)
- [ ] Cache de resultados
- [ ] Filtro por ano de lançamento
- [ ] Filtro por idioma
- [ ] Dark mode / Light mode toggle

### Como Adicionar Nova Feature

1. **Criar componente** em `src/components/`
2. **Adicionar tipos** em `src/types/index.ts`
3. **Criar funções auxiliares** em `src/lib/`
4. **Integrar na página** principal ou criar rota API
5. **Testar** localmente
6. **Commit** com mensagem clara

## Padrões de Código

### Componentes
- Todos são "use client" (Client Components)
- Props tipadas com TypeScript
- Nomes descritivos e sugestivos
- Uma responsabilidade por componente

### Funcionalidades TMDB
- Agrupadas em `src/lib/tmdb.ts`
- Sempre fazer tratamento de erro
- Cache desabilitado para resultados aleatórios
- Requisições com `fetch` nativo

### Variáveis de Ambiente
- Prefixo `NEXT_PUBLIC_` para variáveis acessíveis no frontend
- Documentadas em `.env.local`
- Nunca fazer commit de `.env.local`

## Deploy

### Vercel (Recomendado)
```bash
vercel deploy
```

### Outros Hosts
- Certifique-se de que o Node.js 18+ está instalado
- Variáveis de ambiente configuradas
- Build com `npm run build`
- Start com `npm run start`

## Troubleshooting

### "API Key inválida"
- Verifique se a chave está em `.env.local`
- Confirme que está usando a chave correta do TMDB
- Reinicie o servidor de desenvolvimento

### "Nenhum conteúdo encontrado"
- Ajuste os filtros (muito restritivos)
- Tente com filtros menos específicos
- Verifique a conexão com TMDB API

### Imagens não carregam
- Confirme em `next.config.js` que `image.tmdb.org` está na whitelist
- Verifique o path da imagem
- Imagens podem não estar disponíveis para todos os títulos

## Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [TMDB API Docs](https://developer.themoviedb.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

---

**Última atualização:** 2026-04-13
