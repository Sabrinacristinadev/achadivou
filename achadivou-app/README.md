# Achadivou

Plataforma de achadinhos/promoções de afiliados. Site público + painel administrativo
com banco de dados real e login seguro (senha com hash, sessão em cookie httpOnly).

Configurado para hospedar no **Netlify**.

## Stack

- **Next.js 14** (App Router)
- **Prisma** + **Postgres** (recomendado: [Neon](https://neon.tech), grátis)
- **Netlify Blobs** para upload de imagens (nativo do Netlify, sem conta extra)
- **bcryptjs** para hash de senha, **jsonwebtoken** para sessão

## Passo a passo para publicar no Netlify

### 1. Criar o banco de dados (Neon, grátis)
1. Crie uma conta em https://neon.tech
2. Crie um novo projeto/banco
3. Copie a **Connection string** (algo como `postgresql://usuario:senha@host/banco?sslmode=require`)

### 2. Subir o projeto para o GitHub
1. Crie uma conta em https://github.com se ainda não tiver
2. Crie um novo repositório (ex: `achadivou`)
3. Use a opção "uploading an existing file" na página do repositório para arrastar
   e soltar todos os arquivos deste projeto (não precisa usar linha de comando)

### 3. Conectar no Netlify
1. Crie uma conta em https://app.netlify.com (dá para entrar direto com o GitHub)
2. Clique em **Add new site → Import an existing project**
3. Escolha o repositório que você acabou de criar
4. O Netlify já detecta que é um projeto Next.js e usa o `netlify.toml` deste
   repositório automaticamente

### 4. Configurar as variáveis de ambiente
Em **Site configuration → Environment variables**, adicione:

| Nome | Valor |
|---|---|
| `DATABASE_URL` | a connection string do Neon (passo 1) |
| `JWT_SECRET` | qualquer texto longo e aleatório |
| `ADMIN_USERNAME` | o usuário que você quer usar para logar no painel |
| `ADMIN_PASSWORD` | a senha que você quer usar para logar no painel |

### 5. Publicar
Clique em **Deploy site**. O Netlify instala tudo, cria as tabelas no banco
(`prisma db push`) e cadastra o usuário admin (`db:seed`) automaticamente, seguindo o
comando de build definido em `netlify.toml`. Isso tudo roda nos servidores do Netlify —
seu computador não faz nada disso.

Quando terminar, acesse o link que o Netlify te der (ex: `seusite.netlify.app`) e depois
`/admin/login` para entrar no painel com o usuário/senha que você configurou.

## Rodando localmente (opcional)

Só é necessário se você quiser mexer no código antes de publicar.

```bash
npm install
cp .env.example .env      # edite DATABASE_URL, ADMIN_USERNAME e ADMIN_PASSWORD
npm run db:push
npm run db:seed
npm run dev
```

⚠️ O upload de imagem por arquivo usa o Netlify Blobs, que só funciona quando o site
está rodando no Netlify (ou via `netlify dev`, usando a Netlify CLI). Rodando só com
`next dev`, use o campo "Cole a URL da imagem" no formulário em vez do botão de upload.

## Como funciona o login do admin

- O usuário admin fica salvo no banco de dados com a senha **criptografada** (bcrypt),
  nunca em texto puro.
- Ao fazer login, a API cria um token assinado (JWT) e grava em um cookie **httpOnly**
  (não pode ser lido por JavaScript no navegador, o que protege contra roubo via XSS).
- O `middleware.js` bloqueia o acesso a qualquer página `/admin/*` sem esse cookie,
  redirecionando para `/admin/login`.
- Todas as rotas de API que criam, editam ou excluem ofertas (`/api/offers`,
  `/api/offers/[id]`, `/api/upload`) verificam o token antes de executar qualquer ação —
  mesmo que alguém tente chamar a API diretamente, sem estar logado nada funciona.

## Estrutura do projeto

```
app/
  page.js                     → site público (home)
  admin/
    login/page.js             → tela de login
    page.js                   → dashboard (lista de ofertas)
    offers/new/page.js        → formulário de nova oferta
    offers/[id]/edit/page.js  → formulário de edição
  api/
    auth/login/route.js       → login (valida senha, cria cookie)
    auth/logout/route.js      → logout (limpa cookie)
    offers/route.js           → listar (GET) e criar (POST) ofertas
    offers/[id]/route.js      → editar (PATCH) e excluir (DELETE) oferta
    offers/[id]/click/route.js → contabiliza clique no link de afiliado
    upload/route.js           → upload de imagem (Netlify Blobs)
    uploads/[filename]/route.js → serve as imagens enviadas
components/                   → componentes visuais reutilizáveis (Logo, cards, formulário)
lib/                          → prisma client, autenticação, constantes (cores/categorias/lojas)
prisma/schema.prisma          → modelos do banco de dados (Admin, Offer)
prisma/seed.js                → cria o admin inicial e ofertas de exemplo
middleware.js                 → protege as rotas /admin
netlify.toml                  → configuração de build do Netlify
```

## Personalização

- Cores, categorias e lojas ficam centralizadas em `lib/constants.js`.
- O logo é um SVG dentro de `components/Logo.js` — fácil de trocar por um arquivo de
  imagem próprio se preferir.
