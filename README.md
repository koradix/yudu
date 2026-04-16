# YUDU — Aprenda Fazendo. Com Experts Reais.

Marketplace de aprendizagem prática que conecta 3 perfis:

- **Aprendiz** — aprende fazendo, ao lado de experts reais, pagando pouco
- **Expert** — ensina e presta serviço ao mesmo tempo, ganha mais
- **Cliente** — contrata serviço com preço competitivo e qualidade verificada

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS + shadcn/ui
- **Banco de dados:** Supabase (PostgreSQL + Auth + Storage)
- **Pagamento:** Mercado Pago (Pix)
- **Deploy:** Vercel

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/koradix/yudu.git
cd yudu

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha os valores no .env.local

# 4. Rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role do Supabase |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token do Mercado Pago |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Public key do Mercado Pago |
| `NEXT_PUBLIC_APP_URL` | URL da aplicação (ex: https://yudu-navy.vercel.app) |

## Deploy

O deploy é feito automaticamente na Vercel a cada push na branch `main`.

**Produção:** [https://yudu-navy.vercel.app](https://yudu-navy.vercel.app)
