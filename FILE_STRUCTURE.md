# ARIA-X: Complete File Structure Guide

## Project Organization

```
aria-x/
├── 📄 Documentation
│   ├── BUSINESS_BLUEPRINT.md          # Complete system architecture
│   ├── BUSINESS_PITCH.md              # Investor pitch document
│   ├── PRESENTATION_READY.md          # Tonight's presentation guide
│   ├── FILE_STRUCTURE.md              # This file
│   ├── PRODUCTION_SETUP.md            # Deployment instructions
│   ├── INTEGRATIONS_SETUP.md          # Gmail, Calendar, CSV setup
│   ├── SUPABASE_SETUP.md              # Database configuration
│   ├── STRIPE_SETUP.md                # Payment setup
│   └── DEPLOYMENT.md                  # Vercel deployment
│
├── 📁 Frontend (React 19 + Tailwind 4)
│   └── client/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Home.tsx                    # Landing page
│       │   │   ├── Login.tsx                   # Login page
│       │   │   ├── Signup.tsx                  # Signup page
│       │   │   ├── Dashboard.tsx               # Main dashboard
│       │   │   ├── AdminDashboard.tsx          # Admin control panel
│       │   │   ├── OnboardBusiness.tsx         # Business setup
│       │   │   ├── Integrations.tsx            # Integration manager
│       │   │   ├── Upgrade.tsx                 # Subscription page
│       │   │   └── NotFound.tsx                # 404 page
│       │   │
│       │   ├── components/
│       │   │   ├── ProtectedRoute.tsx          # Route protection
│       │   │   ├── DashboardLayout.tsx         # Layout wrapper
│       │   │   ├── AIChatBox.tsx               # AI chat interface
│       │   │   ├── ErrorBoundary.tsx           # Error handling
│       │   │   └── ui/                         # shadcn/ui components
│       │   │
│       │   ├── contexts/
│       │   │   ├── AuthContext.tsx             # Auth state
│       │   │   └── ThemeContext.tsx            # Theme state
│       │   │
│       │   ├── lib/
│       │   │   ├── trpc.ts                     # tRPC client
│       │   │   └── supabase-client.ts          # Supabase client
│       │   │
│       │   ├── App.tsx                         # Main app component
│       │   ├── main.tsx                        # Entry point
│       │   └── index.css                       # Global styles
│       │
│       ├── public/
│       │   ├── favicon.ico                     # Favicon
│       │   ├── manifest.json                   # PWA manifest
│       │   └── robots.txt                      # SEO
│       │
│       ├── index.html                          # HTML template
│       ├── vite.config.ts                      # Vite config
│       └── tsconfig.json                       # TypeScript config
│
├── 📁 Backend (Node.js + Express + tRPC)
│   └── server/
│       ├── routers.ts                          # tRPC API endpoints
│       ├── db.ts                               # Database queries
│       ├── agent-loop.ts                       # Revenue recovery engine
│       ├── mock-data.ts                        # Demo data generator
│       ├── gmail-service.ts                    # Gmail integration
│       ├── calendar-service.ts                 # Calendar integration
│       ├── invoice-parser.ts                   # CSV parser
│       ├── findings-generator.ts               # Opportunity detection
│       ├── stripe-service.ts                   # Payment processing
│       ├── business-service.ts                 # Business data
│       ├── supabase.ts                         # Auth service
│       │
│       ├── _core/
│       │   ├── index.ts                        # Server entry point
│       │   ├── context.ts                      # Request context
│       │   ├── trpc.ts                         # tRPC setup
│       │   ├── llm.ts                          # Claude integration
│       │   ├── env.ts                          # Environment variables
│       │   ├── oauth.ts                        # OAuth flow
│       │   ├── cookies.ts                      # Cookie handling
│       │   ├── notification.ts                 # Notifications
│       │   ├── map.ts                          # Maps integration
│       │   └── voiceTranscription.ts           # Voice API
│       │
│       ├── Tests
│       │   ├── agent-loop.test.ts              # Agent loop tests
│       │   ├── integrations.test.ts            # Integration tests
│       │   └── auth.logout.test.ts             # Auth tests
│       │
│       └── storage/
│           └── storage.ts                      # S3 file storage
│
├── 📁 Database (PostgreSQL via Supabase)
│   └── drizzle/
│       ├── schema.ts                           # Database schema
│       ├── 0001_*.sql                          # Migration 1
│       ├── 0002_*.sql                          # Migration 2
│       └── migrations.lock                     # Migration lock
│
├── 📁 Shared Code
│   └── shared/
│       ├── const.ts                            # Constants
│       └── types.ts                            # Shared types
│
├── 📁 Configuration Files
│   ├── package.json                            # Dependencies
│   ├── pnpm-lock.yaml                          # Lock file
│   ├── tsconfig.json                           # TypeScript config
│   ├── tailwind.config.js                      # Tailwind config
│   ├── postcss.config.js                       # PostCSS config
│   ├── vite.config.ts                          # Vite config
│   ├── .env.example                            # Env template
│   ├── .gitignore                              # Git ignore
│   └── .prettierrc                              # Prettier config
│
├── 📁 Build Output
│   ├── dist/                                   # Production build
│   └── .manus-logs/                            # Development logs
│
└── 📁 Root Files
    ├── README.md                               # Project overview
    ├── todo.md                                 # Task tracking
    └── CHANGELOG.md                            # Version history
```

---

## Key Files Explained

### Frontend Pages

| File | Purpose | Route |
|------|---------|-------|
| Home.tsx | Landing page | `/` |
| Login.tsx | Login form | `/login` |
| Signup.tsx | Registration | `/signup` |
| Dashboard.tsx | Main dashboard | `/dashboard` |
| AdminDashboard.tsx | Admin control | `/admin` |
| OnboardBusiness.tsx | Setup wizard | `/onboard` |
| Integrations.tsx | Integration manager | `/integrations` |
| Upgrade.tsx | Subscription | `/upgrade` |

### Backend Services

| File | Purpose |
|------|---------|
| routers.ts | All tRPC API endpoints |
| db.ts | Database query helpers |
| agent-loop.ts | Revenue recovery engine |
| gmail-service.ts | Email analysis |
| calendar-service.ts | Calendar analysis |
| invoice-parser.ts | CSV parsing |
| findings-generator.ts | Opportunity detection |
| stripe-service.ts | Payment processing |

### Database Tables

| Table | Purpose |
|-------|---------|
| users | User accounts |
| businesses | Business profiles |
| invoices | Invoice data |
| leads | Lead tracking |
| emails | Email analysis |
| calendar_events | Calendar data |
| findings | Detected opportunities |
| executions | Action tracking |
| knowledge_nodes | Learning memory |

### Configuration Files

| File | Purpose |
|------|---------|
| package.json | Dependencies & scripts |
| tsconfig.json | TypeScript settings |
| tailwind.config.js | Tailwind theming |
| vite.config.ts | Build settings |
| .env.example | Environment template |

---

## Development Workflow

### 1. Frontend Development
```bash
cd client
pnpm install
pnpm dev
# Open http://localhost:5173
```

### 2. Backend Development
```bash
cd server
pnpm install
pnpm dev
# Server runs on http://localhost:3000
```

### 3. Database Changes
```bash
# Update drizzle/schema.ts
pnpm drizzle-kit generate
# Review migration SQL
pnpm drizzle-kit migrate
```

### 4. Testing
```bash
pnpm test
# Runs all vitest tests
```

### 5. Building for Production
```bash
pnpm build
# Creates dist/ folder
```

---

## File Naming Conventions

### React Components
- **PascalCase** for component files: `Dashboard.tsx`, `AdminDashboard.tsx`
- **camelCase** for utility files: `supabase-client.ts`, `invoice-parser.ts`

### Services
- **Suffix with -service**: `gmail-service.ts`, `stripe-service.ts`
- **Suffix with -parser**: `invoice-parser.ts`
- **Suffix with -generator**: `findings-generator.ts`

### Tests
- **Suffix with .test.ts**: `agent-loop.test.ts`, `integrations.test.ts`
- **Same directory as source**: `server/agent-loop.test.ts` next to `server/agent-loop.ts`

### Database
- **Schema file**: `drizzle/schema.ts`
- **Migrations**: `drizzle/0001_*.sql`, `drizzle/0002_*.sql`

---

## Important Directories

### `/client/src/pages/`
All page components that map to routes. Each page is a top-level route.

### `/server/`
All backend logic, services, and API endpoints. Entry point is `server/_core/index.ts`.

### `/drizzle/`
Database schema and migrations. Update schema.ts, then run migrations.

### `/shared/`
Shared types and constants used by both frontend and backend.

### `/dist/`
Production build output. Generated by `pnpm build`.

### `/.manus-logs/`
Development logs. Check here if debugging issues.

---

## Security Files

### Credentials (Never Commit)
- `.env` - Environment variables
- `SUPABASE_KEY` - Database credentials
- `STRIPE_SECRET_KEY` - Payment credentials
- `GOOGLE_CLIENT_SECRET` - OAuth secret

### Always in .gitignore
```
.env
.env.local
node_modules/
dist/
.manus-logs/
```

---

## Deployment Files

### Vercel Deployment
- `vercel.json` - Deployment config
- `package.json` - Build scripts
- Environment variables in Vercel dashboard

### Database Migrations
- All migrations in `drizzle/` directory
- Applied automatically on deployment
- Rollback available via Supabase dashboard

---

## Documentation Files

| File | Content |
|------|---------|
| BUSINESS_BLUEPRINT.md | Complete architecture |
| BUSINESS_PITCH.md | Investor pitch |
| PRESENTATION_READY.md | Tonight's guide |
| PRODUCTION_SETUP.md | Deployment steps |
| INTEGRATIONS_SETUP.md | Integration guides |
| SUPABASE_SETUP.md | Database setup |
| STRIPE_SETUP.md | Payment setup |
| FILE_STRUCTURE.md | This file |

---

## Quick File Lookup

### "I need to add a new page"
1. Create `client/src/pages/NewPage.tsx`
2. Add route to `client/src/App.tsx`
3. Create API endpoint in `server/routers.ts`

### "I need to add a new database table"
1. Update `drizzle/schema.ts`
2. Run `pnpm drizzle-kit generate`
3. Run `pnpm drizzle-kit migrate`
4. Add query helper to `server/db.ts`

### "I need to add a new integration"
1. Create `server/[service]-service.ts`
2. Add findings generator in `server/findings-generator.ts`
3. Create UI in `client/src/pages/Integrations.tsx`
4. Add tRPC endpoint in `server/routers.ts`

### "I need to fix a bug"
1. Check error in `.manus-logs/`
2. Find relevant file using File Lookup table
3. Add test case to appropriate `.test.ts` file
4. Fix the bug
5. Run `pnpm test` to verify

---

## Version Control

### Main Branches
- `main` - Production code
- `develop` - Development code

### Commit Messages
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
test: Add tests
refactor: Refactor code
```

### Before Committing
```bash
pnpm format          # Format code
pnpm check           # Type check
pnpm test            # Run tests
git status           # Check changes
```

---

## Performance Tips

### Frontend
- Keep components small (< 200 lines)
- Use React.memo for expensive components
- Lazy load pages with React.lazy()

### Backend
- Cache frequently accessed data
- Use database indexes
- Batch database queries

### Database
- Add indexes to frequently queried columns
- Archive old data regularly
- Monitor query performance

---

## Scaling Checklist

- [ ] Add caching layer (Redis)
- [ ] Set up CDN for static assets
- [ ] Add database read replicas
- [ ] Implement rate limiting
- [ ] Add monitoring & alerting
- [ ] Set up automated backups
- [ ] Add load balancing
- [ ] Implement API versioning

---

*Last Updated: March 31, 2026*
*Status: Production Ready*
