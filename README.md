# .NET 10 Full-featured Next.js Static Export Identity Auth Template

![](https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/wwwroot/img/pages/react/nextjs-static.webp)

> Browse [source code](https://github.com/NetCoreTemplates/nextjs)

A modern full-stack .NET 10.0 + Next.js 16 project template that combines the power of ServiceStack with Next.js static site generation and React 19. It provides a production-ready foundation for building scalable web applications with integrated authentication, database management, and background job processing.

## Quick Start

```bash
npx create-net nextjs MyProject
```

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

### 📝 MDX Blog

Integrated markdown blog with:

- **MDX Support** - Markdown with React components
- **Syntax Highlighting** - Prism.js code blocks
- **Static Generation** - Pre-rendered at build time
- **Frontmatter** - YAML metadata for posts

### 🗄️ Database

SQLite with dual ORM support:

- **OrmLite** - ServiceStack's fast micro-ORM for services
- **Entity Framework Core** - For Identity and complex queries
- **Code-First Migrations** - EF Core migrations in `/Migrations`
- **Database Admin UI** - Browse data at `/admin-ui/database`

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

## Admin UIs

Access built-in admin dashboards at:

- `/admin-ui` - Admin dashboard home
- `/admin-ui/users` - User management
- `/admin-ui/database` - Database browser
- `/admin-ui/logging` - Request logs
- `/admin-ui/jobs` - Background jobs
- `/admin-ui/apikeys` - API key management
- `/admin-ui/chat` - AI chat analytics

## Testing

### .NET Tests

```bash
cd MyApp.Tests
dotnet test
```

### Frontend Tests

```bash
cd MyApp.Client
npm test           # Watch mode
npm run test:run   # Single run
npm run test:ui    # Vitest UI
```

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


## AutoQuery CRUD Dev Workflow

For Rapid Development simple [TypeScript Data Models](https://docs.servicestack.net/autoquery/okai-models) can be used to generate C# AutoQuery APIs and DB Migrations.

### Cheat Sheet

Create a new Table use `init <Table>`, e.g:

```bash
npx okai init Table
```

This will generate an empty `MyApp.ServiceModel/<Table>.d.ts` file along with stub AutoQuery APIs and DB Migration implementations. 

#### Regenerate AutoQuery APIs and DB Migrations

After modifying the TypeScript Data Model to include the desired fields, re-run the `okai` tool to re-generate the AutoQuery APIs and DB Migrations:

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

## Learn More

- [ServiceStack Documentation](https://docs.servicestack.net)
- [Next.js Documentation](https://nextjs.org/docs)
- [ServiceStack React Components](https://docs.servicestack.net/react)
- [AutoQuery CRUD](https://docs.servicestack.net/autoquery-crud)
- [Background Jobs](https://docs.servicestack.net/background-jobs)
- [AI Chat API](https://docs.servicestack.net/ai-chat-api)