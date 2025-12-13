# .NET 10 Full-featured Next.js Static Export Identity Auth Template

![](https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/wwwroot/img/pages/react/nextjs-static.webp)

> Browse [source code](https://github.com/NetCoreTemplates/nextjs)

A modern full-stack .NET 10.0 + Next.js 16 project template that combines the power of ServiceStack with Next.js static site generation and React 19. It provides a production-ready foundation for building scalable web applications with integrated authentication, database management, and background job processing.

## Quick Start

```bash
npx create-net nextjs MyProject
```

## Jumpstart with Copilot

Instantly [scaffold a new App with this template](https://github.com/new?template_name=nextjs&template_owner=NetCoreTemplates) using GitHub Copilot, just describe the features you want and watch Copilot build it!

## [react-templates.net](https://react-templates.net)

[![](https://github.com/ServiceStack/servicestack.net/blob/main/MyApp/wwwroot/img/posts/vibecode-react-templates/bg.webp?raw=true)](https://react-templates.net)

## Getting Started

Run Server .NET Project (automatically starts both .NET and Next.js dev servers):

```bash
cd MyProject
dotnet watch
```

## Architecture

### Hybrid Development Approach

**Development Mode:**

![](https://raw.githubusercontent.com/ServiceStack/docs.servicestack.net/refs/heads/main/MyApp/wwwroot/img/pages/react/info/next-static-dev.svg)

- ASP.NET Core proxies requests to Next.js dev server (running on port 3000)
- Hot Module Replacement (HMR) support for instant UI updates
- WebSocket proxying for Next.js HMR functionality

**Production Mode:**

![](https://raw.githubusercontent.com/ServiceStack/docs.servicestack.net/refs/heads/main/MyApp/wwwroot/img/pages/react/info/next-static-prod.svg)

- Next.js app is statically exported to `/dist`
- Static files served directly from ASP.NET Core's `/wwwroot`
- No separate Node.js server required in production

### Project Structure

```
MyApp/                       # Main ASP.NET Core host
├── Configure.*.cs           # Modular startup configuration
├── Program.cs               # Application entry point
└── wwwroot/                 # Static files (production)

MyApp.Client/                # Next.js frontend application
├── app/                     # Next.js App Router pages
├── components/              # React components
├── lib/                     # Utilities and helpers
├── public/                  # Static assets
├── dist/                    # Build output (production)
└── styles/                  # Tailwind CSS styles

MyApp.ServiceInterface/      # Service implementations
├── MyServices.cs            # Example services
└── Data/                    # EF Core DbContext

MyApp.ServiceModel/          # DTOs and service contracts
├── Bookings.cs              # AutoQuery CRUD example
└── Hello.cs                 # Example service contract

MyApp.Tests/                 # Integration and unit tests

config/                      # Deployment configuration
└── deploy.yml               # Kamal deployment settings

.github/                     # GitHub Actions workflows
└── workflows/
    ├── build.yml            # CI build and test
    ├── build-container.yml  # Container image build
    └── release.yml          # Production deployment with Kamal
```

## Features

### 🔐 Identity Authentication

Full ASP.NET Core Identity integration with ServiceStack's Auth features:

- **Credentials Authentication** - Email/password sign-in with secure cookie sessions
- **User Registration** - With email confirmation support
- **Role-based Authorization** - Admin, Manager, Employee roles with `[ValidateHasRole]`
- **Admin Users UI** - Built-in user management at `/admin-ui/users`
- **API Keys** - Generate and manage API keys for programmatic access

### 📊 AutoQuery CRUD

Declarative APIs with automatic query and CRUD functionality:

- **AutoQuery** - Queryable APIs with filtering, sorting, and pagination
- **AutoQueryData** - In-memory queryable data sources
- **Audit History** - Automatic tracking of data changes
- **Bookings Example** - Complete CRUD example with role-based permissions

### 🎨 React 19 + shadcn/ui Components

Modern UI built with:

- **React 19** with Server Components support
- **shadcn/ui** - Beautiful, accessible component library
- **Tailwind CSS 4** - Utility-first styling with dark mode support
- **@servicestack/react** - Pre-built form components and AutoQueryGrid
- **SWR** - React Hooks for data fetching with caching

### 🤖 AI Chat Integration

Built-in AI chat capabilities:

- **ChatFeature** - Multi-provider AI chat API
- **Configurable Providers** - ServiceStack, OpenAI, Anthropic, Google, Groq, and more
- **Chat History** - Persistent storage with `DbChatStore`
- **Admin Analytics** - Chat usage insights at `/admin-ui/chat`

### ⚙️ Background Jobs

Durable job processing with ServiceStack's Background Jobs:

- **Command Pattern** - Type-safe job definitions
- **Email Queue** - SMTP email sending via background jobs
- **Recurring Jobs** - Scheduled task execution
- **Job Dashboard** - Monitor jobs at `/admin-ui/jobs`
- Uses monthly rolling Sqlite databases by default - [Upgrade to PostgreSQL/SQL Server/MySQL](#upgrading-to-enterprise-database)

### 📝 MDX Blog

Integrated markdown blog with:

- **MDX Support** - Markdown with React components
- **Syntax Highlighting** - Prism.js code blocks
- **Static Generation** - Pre-rendered at build time
- **Frontmatter** - YAML metadata for posts
- **YouTube Embeds** - Custom remark plugin for YouTube videos
- **Typography Styling** - Beautiful prose with `@tailwindcss/typography`

### 🗄️ Database

SQLite with dual ORM support:

- **OrmLite** - ServiceStack's fast micro-ORM for services
- **Entity Framework Core** - For Identity and complex queries
- **Code-First Migrations** - EF Core migrations in `/Migrations`
- **Database Admin UI** - Browse data at `/admin-ui/database`
- **SQLite** - Default database - [Upgrade to PostgreSQL/SQL Server/MySQL](#upgrading-to-enterprise-database)

### 📡 Request Logging

Comprehensive API logging:

- **SqliteRequestLogger** - Persistent request logging to SQLite
- **Request Body Tracking** - Full request payload capture
- **Error Tracking** - Automatic error logging
- **Admin Dashboard** - View logs at `/admin-ui/logging`

### 🏥 Health Checks

Production-ready health monitoring:

- **Health Endpoint** - `/up` for load balancer checks
- **Custom Health Checks** - Extensible health check framework

### 🔄 TypeScript DTOs

Automatic TypeScript type generation:

- **Type-Safe API Calls** - Generated from C# DTOs
- **Sync Command** - `npm run dtos` to update types
- **ServiceStack Client** - Full-featured TypeScript client

### 📖 OpenAPI & Scalar

API documentation with modern tooling:

- **OpenAPI 3.0** - Auto-generated API specifications
- **Scalar API Reference** - Interactive API documentation at `/scalar/v1`
- **Development Mode** - API docs available in development

### 🧪 Testing

Comprehensive test coverage:

- **Vitest** - Fast unit testing for React components
- **React Testing Library** - Component testing utilities
- **jsdom** - Browser environment simulation
- **Integration Tests** - .NET integration tests in `MyApp.Tests`

### 🐳 Docker Deployment

Production-ready containerization:

- **Kamal Deployment** - Zero-downtime deploys with Kamal
- **GitHub Container Registry** - Automatic container builds
- **SSL Auto-Certification** - Let's Encrypt integration
- **Volume Persistence** - `App_Data` volume mounting for SQLite

### 🌙 Dark Mode

Built-in theme support:

- **System Preference** - Respects OS dark mode setting
- **Tailwind CSS 4** - Native dark mode utilities
- **Consistent Theming** - All components support dark mode

## Example Pages

| Page | Description |
|------|-------------|
| `/` | Home page with getting started guide |
| `/todomvc` | TodoMVC example with ServiceStack APIs |
| `/bookings-auto` | AutoQueryGrid with automatic columns |
| `/bookings-custom` | Custom booking form with validation |
| `/admin` | Protected admin page (requires Admin role) |
| `/profile` | User profile management |
| `/posts` | MDX blog listing |
| `/shadcn-ui` | shadcn/ui component showcase |
| `/about` | About page (MDX) |
| `/features` | Template features overview (MDX) |
| `/privacy` | Privacy policy page (MDX) |

## Admin UIs

Access built-in admin dashboards at:

- `/admin-ui` - Admin dashboard home
- `/admin-ui/users` - User management
- `/admin-ui/database` - Database browser
- `/admin-ui/logging` - Request logs
- `/admin-ui/jobs` - Background jobs
- `/admin-ui/apikeys` - API key management
- `/admin-ui/chat` - AI chat analytics

## Configuration

### Key Configuration Files

- **MyApp/appsettings.json** - Application configuration
- **MyApp.Client/next.config.mjs** - Next.js configuration
- **MyApp.Client/styles/index.css** - Tailwind CSS configuration
- **config/deploy.yml** - Kamal deployment settings

### App Settings

Configure in `appsettings.json` or environment:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "DataSource=App_Data/app.db;Cache=Shared"
  },
  "SmtpConfig": {
    "Host": "smtp.example.com",
    "Port": 587,
    "FromEmail": "noreply@example.com",
    "FromName": "MyApp"
  },
  "AppConfig": {
    "BaseUrl": "https://myapp.example.com"
  }
}
```

### App Settings Secrets

Instead of polluting each GitHub Reposity with multiple App-specific GitHub Action Secrets, you can save all your secrets in a single `APPSETTINGS_PATCH` GitHub Action Secret to patch `appsettings.json` with environment-specific configuration using [JSON Patch](https://jsonpatch.com). E.g:

```json
[
    {
        "op":"replace",
        "path":"/ConnectionStrings/DefaultConnection",
        "value":"Server=service-postgres;Port=5432;User Id=dbuser;Password=dbpass;Database=dbname;Pooling=true;"
    },
    { "op":"add", "path":"/SmtpConfig", "value":{
        "UserName": "SmptUser",
        "Password": "SmptPass",
        "Host": "email-smtp.us-east-1.amazonaws.com",
        "Port": 587,
        "From": "noreply@example.org",
        "FromName": "MyApp",
        "Bcc": "copy@example.org"
      } 
    },
    { "op":"add", "path":"/Admins", "value": ["admin1@email.com","admin2@email.com"] },
    { "op":"add", "path":"/CorsFeature/allowOriginWhitelist/-", "value":"https://servicestack.net" }
]
```

### SMTP Email

Enable email sending by uncommenting in `Program.cs`:

```csharp
services.AddSingleton<IEmailSender<ApplicationUser>, EmailSender>();
```

## Upgrading to Enterprise Database

To switch from SQLite to PostgreSQL/SQL Server/MySQL:

1. Install preferred RDBMS (ef-postgres, ef-mysql, ef-sqlserver), e.g:

```bash
npx add-in ef-postgres
```

2. Install `db-identity` to use RDBMS `DatabaseJobsFeature` for background jobs and `DbRequestLogger` for Request Logs:

```bash
npx add-in db-identity
```

## AutoQuery CRUD Dev Workflow

For Rapid Development simple [TypeScript Data Models](https://docs.servicestack.net/autoquery/okai-models) can be used to generate C# AutoQuery APIs and DB Migrations.

### Cheat Sheet

### Create a new Table

Create a new Table use `init <Table>`, e.g:

```bash
npx okai init Table
```

This will generate an empty `MyApp.ServiceModel/<Table>.d.ts` file along with stub AutoQuery APIs and DB Migration implementations. 

### Use AI to generate the TypeScript Data Model

Or to get you started quickly you can also use AI to generate the initial TypeScript Data Model with:

```bash
npx okai "Table to store Customer Stripe Subscriptions"
```

This launches a TUI that invokes ServiceStack's okai API to fire multiple concurrent requests to frontier cloud 
and OSS models to generate the TypeScript Data Models required to implement this feature. 
You'll be able to browse and choose which of the AI Models you prefer which you can accept by pressing `a` 
to `(a) accept`. These are the data models [Claude Sonnet 4.5 generated](https://servicestack.net/text-to-blazor?id=1764337230546) for this prompt.

#### Regenerate AutoQuery APIs and DB Migrations

After modifying the `Table.d.ts` TypeScript Data Model to include the desired fields, re-run the `okai` tool to re-generate the AutoQuery APIs and DB Migrations:

```bash
npx okai Table.d.ts
```

> Command can be run anywhere within your Solution

After you're happy with your Data Model you can run DB Migrations to run the DB Migration and create your RDBMS Table:

```bash
npm run migrate
```

#### Making changes after first migration

If you want to make further changes to your Data Model, you can re-run the `okai` tool to update the AutoQuery APIs and DB Migrations, then run the `rerun:last` npm script to drop and re-run the last migration:

```bash
npm run rerun:last
```

#### Removing a Data Model and all generated code

If you changed your mind and want to get rid of the RDBMS Table you can revert the last migration:

```bash
npm run revert:last
```

Which will drop the table and then you can get rid of the AutoQuery APIs, DB Migrations and TypeScript Data model with:

```bash
npx okai rm Transaction.d.ts
```

## Deployment

### Docker + Kamal

This project includes GitHub Actions for CI/CD with automatic Docker image builds and production [deployment with Kamal](https://docs.servicestack.net/kamal-deploy). The `/config/deploy.yml` configuration is designed to be reusable across projects—it dynamically derives service names, image paths, and volume mounts from environment variables, so you only need to configure your server's IP and hostname using GitHub Action secrets.

### GitHub Action Secrets

**Required - App Specific*:

The only secret needed to be configured per Repository.

| Variable | Example | Description |
|----------|---------|-------------|
| `KAMAL_DEPLOY_HOST` | `example.org` | Hostname used for SSL certificate and Kamal proxy |

**Required** (Organization Secrets):

Other Required variables can be globally configured in your GitHub Organization or User secrets which will
enable deploying all your Repositories to the same server.

| Variable | Example  | Description |
|----------|----------|-------------|
| `KAMAL_DEPLOY_IP`   | `100.100.100.100` | IP address of the server to deploy to |
| `SSH_PRIVATE_KEY`   | `ssh-rsa ...`     | SSH private key to access the server |
| `LETSENCRYPT_EMAIL` | `me@example.org`  | Email for Let's Encrypt SSL certificate |

**Optional**:

| Variable | Example | Description |
|----------|---------|-------------|
| `SERVICESTACK_LICENSE` | `...` | ServiceStack license key |

**Inferred** (from GitHub Action context):

These are inferred from the GitHub Action context and don't need to be configured.

| Variable | Source | Description |
|----------|--------|-------------|
| `GITHUB_REPOSITORY` | `${{ github.repository }}` | e.g. `acme/example.org` - used for service name and image |
| `KAMAL_REGISTRY_USERNAME` | `${{ github.actor }}` | GitHub username for container registry |
| `KAMAL_REGISTRY_PASSWORD` | `${{ secrets.GITHUB_TOKEN }}` | GitHub token for container registry auth |

#### Features

- **Docker containerization** with optimized .NET images
- **SSL auto-certification** via Let's Encrypt
- **GitHub Container Registry** integration
- **Volume persistence** for App_Data including any SQLite database

## AI-Assisted Development with CLAUDE.md

As part of our objectives of improving developer experience and embracing modern AI-assisted development workflows - all new .NET SPA templates include a comprehensive `AGENTS.md` file designed to optimize AI-assisted development workflows.

### What is CLAUDE.md?

`CLAUDE.md` and [AGENTS.md](https://agents.md) onboards Claude (and other AI assistants) to your codebase by using a structured documentation file that provides it with complete context about your project's architecture, conventions, and technology choices. This enables more accurate code generation, better suggestions, and faster problem-solving.

### What's Included

Each template's `AGENTS.md` contains:

- **Project Architecture Overview** - Technology stack, design patterns, and key architectural decisions
- **Project Structure** - Gives Claude a map of the codebase
- **ServiceStack Conventions** - DTO patterns, Service implementation, AutoQuery, Authentication, and Validation
- **API Integration** - TypeScript DTO generation, API client usage, component patterns, and form handling
- **Database Patterns** - OrmLite setup, migrations, and data access patterns
- **Common Development Tasks** - Step-by-step guides for adding APIs, implementing features, and extending functionality
- **Testing & Deployment** - Test patterns and deployment workflows

### Extending with Project-Specific Details

The existing `CLAUDE.md` serves as a solid foundation, but for best results, you should extend it with project-specific details like the purpose of the project, key parts and features of the project and any unique conventions you've adopted.

### Benefits

- **Faster Onboarding** - New developers (and AI assistants) understand project conventions immediately
- **Consistent Code Generation** - AI tools generate code following your project's patterns
- **Better Context** - AI assistants can reference specific ServiceStack patterns and conventions
- **Reduced Errors** - Clear documentation of framework-specific conventions
- **Living Documentation** - Keep it updated as your project evolves

### How to Use

Claude Code and most AI Assistants already support automatically referencing `CLAUDE.md` and `AGENTS.md` files, for others you can just include it in your prompt context when asking for help, e.g:

> Using my project's AGENTS.md, can you help me add a new AutoQuery API for managing Products?

The AI will understand your App's ServiceStack conventions, React setup, and project structure, providing more accurate and contextual assistance.

## Learn More

- [react-templates.net](https://react-templates.net)
- [ServiceStack React Components](https://react.servicestack.net)
- [ServiceStack Documentation](https://docs.servicestack.net)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [AutoQuery CRUD](https://react-templates.net/docs/autoquery/crud)
- [Background Jobs](https://docs.servicestack.net/background-jobs)
- [AI Chat API](https://docs.servicestack.net/ai-chat-api)

