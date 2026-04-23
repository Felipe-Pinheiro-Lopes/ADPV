# ADPV Frontend

Frontend do sistema de gestão ADPV, desenvolvido com Next.js 16 e React 19.

## Tecnologias

- Next.js 16.1.6
- React 19.2.3
- TypeScript
- Tailwind CSS 4
- Recharts (gráficos)
- React Grid Layout
- Lucide React (ícones)
- Sonner (notificações)

## Instalação

```bash
npm install
```

## Executar

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura

```
src/
├── app/              # Páginas Next.js App Router
│   ├── (auth)/       # Rotas autenticadas
│   └── (painel)/     # Rotas públicas
└── components/       # Componentes React
    └── charts/       # Gráficos
```

## Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```