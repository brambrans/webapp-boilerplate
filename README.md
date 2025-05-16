# Next.js Enterprise Boilerplate

A production-ready Next.js boilerplate with Supabase Auth, Prisma ORM, and Stripe integration for SaaS applications.

<p align="center">
 Enterprise-grade boilerplate for building modern web applications
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#getting-started"><strong>Getting Started</strong></a> ·
  <a href="#environment-setup"><strong>Environment Setup</strong></a> ·
  <a href="#development"><strong>Development</strong></a>
</p>
<br/>

## Features

- 🔐 **Authentication & Authorization** with Supabase Auth
  - Email/Password login
  - Protected API routes and middleware
  - Role-based access control (RBAC)
  
- 💳 **Stripe Integration**
  - Stripe Connect for marketplace/platform payments
  - Embedded onboarding flow
  
- 🗃️ **Database & ORM**
  - Prisma ORM for type-safe database access
  - Database migrations and seeding
  - Automatic type generation
  
- 🎨 **Frontend**
  - Modern UI with Tailwind CSS
  - Shadcn/ui components
  - Responsive layouts
  - Dark mode support



## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Authentication:** [Supabase Auth](https://supabase.com/auth)
- **Database:** [Supabase](https://www.supabase.com)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Payments:** [Stripe Connect](https://stripe.com/connect)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env.local
```

## Environment Setup

Update your `.env.local` with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Database
DATABASE_URL=your_database_url

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

1. Initialize your database with Prisma:

```bash
npx prisma generate
npx prisma db push
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Setting up Stripe Connect

1. Create a Stripe account and enable Connect
2. Configure your Connect settings in the Stripe Dashboard
3. Update your platform settings and branding
4. Set up webhook endpoints for Connect events

## Database Migrations

To create a new migration after modifying your Prisma schema:

```bash
npx prisma migrate dev --name your_migration_name
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a Pull Request to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
