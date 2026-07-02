# MedWell — Premium Medical Wellness Platform

Full-stack Node.js/Express + PostgreSQL application for a luxury medical wellness brand with multi-language support, WhatsApp AI automation via n8n, legacy data migration, and a WellnessCoin loyalty system.

## Architecture Overview

```
medwell-platform/
├── server.js                          # Entry point with auto-migration
├── package.json
├── src/
│   ├── app.js                         # Express app setup (middleware, routes)
│   ├── config/
│   │   ├── database.js                # PostgreSQL connection pool
│   │   ├── i18n.js                    # i18next with fs backend (4 active + 4 future langs)
│   │   └── whatsapp.js                # WhatsApp URL builder
│   ├── middleware/
│   │   ├── auth.js                    # JWT authentication (Bearer)
│   │   ├── admin.js                   # Admin role guard
│   │   ├── i18n.js                    # Language detection + RTL detection
│   │   ├── upload.js                  # Multer CSV/Excel upload handler
│   │   └── validate.js                # Request body validation
│   ├── models/                        # Data access layer (raw SQL queries)
│   │   ├── User.js                    # Auth, profile, legacy linking
│   │   ├── LegacyClient.js            # Imported legacy records
│   │   ├── Service.js                 # Wellness programs (JSONB translations)
│   │   ├── Subscription.js            # User-service subscriptions
│   │   ├── Transaction.js             # Financial ledger
│   │   ├── Appointment.js             # n8n-booked appointments
│   │   └── WellnessCoinLedger.js      # Coin audit trail
│   ├── controllers/                   # Business logic
│   │   ├── authController.js          # Register (with legacy auto-link), login
│   │   ├── serviceController.js       # Service CRUD + localized output
│   │   ├── subscriptionController.js  # Create/cancel/renew + coin rewards
│   │   ├── adminController.js         # Dashboard, clients, coin adjustment
│   │   ├── legacyController.js        # CSV/Excel import + stats
│   │   ├── n8nController.js           # Webhook receiver from n8n AI workflow
│   │   ├── whatsappController.js      # Dynamic WhatsApp link generation
│   │   └── wellnessCoinController.js  # Balance, ledger, leaderboard
│   ├── routes/                        # Express route definitions
│   ├── database/
│   │   ├── migrations/                # 7 SQL migration files
│   │   ├── migrate.js                 # Migration runner
│   │   └── seeds/                     # Admin user seeder
│   └── locales/                       # Translation files (JSON)
│       ├── en/ fr/ ar/ es/            # Active languages
│       └── _future/                   # de/ it/ ru/ zh (ready to activate)
├── n8n/workflows/                     # Pre-built n8n workflow for AI appointment handling
└── uploads/                           # CSV/Excel uploads (auto-cleaned)
```

## Key Features Implemented

### 1. Multi-Language (i18n)
- **4 active languages**: English, French, Arabic (RTL-ready), Spanish
- **4 future languages**: German, Italian, Russian, Chinese (translation files ready, just add to `SUPPORTED_LANGS`)
- All translatable content stored as JSONB in DB (`title`, `description`)
- WhatsApp CTA text dynamically changes per active language

### 2. WhatsApp + n8n AI Automation
- Each service returns a localized WhatsApp URL (`wa.me`) with prefilled template text
- n8n workflow (`n8n/workflows/appointment-confirmation.json`) processes inquiries:
  1. Receives webhook from WhatsApp
  2. AI agent (GPT-4o-mini) extracts prospect data
  3. Sends confirmation message
  4. POSTs data back to MedWell API (`/api/n8n/webhook`)

### 3. Legacy Data Migration
- Admin uploads CSV/Excel via `/api/admin/legacy/import` (Multer middleware)
- Flexible column name mapping (`full_name`, `name`, `FullName`, etc.)
- When a user registers with a phone matching legacy data:
  - Account auto-linked to historical records
  - 5% loyalty bonus credited as WellnessCoins
  - Digital membership card activated with unique ID (`MW-XXXXXX`)

### 4. WellnessCoin & Financial Tracking
- Users have `wellness_coin_balance`, `subscription_status`, `total_paid`, `amount_remaining`
- Subscriptions earn 2% cashback as WellnessCoins on renewal
- Full audit trail via `wellness_coin_ledger` table
- Admin can manually adjust coins with reason
- Leaderboard endpoint for gamification

### 5. Client Self-Management
- Clients can view their subscriptions, financial overview
- Cancel subscription (with reason) and renew subscription endpoints
- Digital membership card with unique ID
- Transaction history and coin ledger

### 6. Admin Dashboard
- Stats: total clients, active subscriptions, revenue, total coins
- Client listing with search + subscription status filter
- Per-client detail with full financial view
- Legacy import UI endpoint

## Database Schema (7 migrations)

| Table | Purpose |
|-------|---------|
| `users` | Clients + admins, financial fields, legacy FK |
| `legacy_clients` | Imported historical records |
| `services` | Programs with JSONB translations |
| `subscriptions` | Active/cancelled/expired subscriptions |
| `transactions` | Payments, refunds, coin credits |
| `appointments` | n8n-booked rendezvous |
| `wellness_coin_ledger` | Coin operation audit trail |

## API Routes

| Route | Auth | Description |
|-------|------|-------------|
| `POST /api/auth/register` | — | Register with legacy auto-link |
| `POST /api/auth/login` | — | Phone + password login |
| `GET /api/auth/check-phone/:phone` | — | Check existence + legacy status |
| `GET /api/auth/profile` | User | Get profile |
| `GET /api/services` | — | List services (localized) |
| `GET /api/services/:id` | — | Service detail (localized) |
| `GET /api/subscriptions` | User | My subscriptions |
| `POST /api/subscriptions` | User | Create subscription |
| `POST /api/subscriptions/:id/cancel` | User | Cancel subscription |
| `POST /api/subscriptions/:id/renew` | User | Renew subscription |
| `GET /api/subscriptions/financial-overview` | User | Full financial summary |
| `GET /api/admin/dashboard` | Admin | Dashboard stats |
| `GET /api/admin/clients` | Admin | List clients |
| `GET /api/admin/clients/:id` | Admin | Client detail |
| `POST /api/admin/clients/:id/wellness-coins` | Admin | Adjust coins |
| `POST /api/admin/legacy/import` | Admin | Upload CSV/Excel |
| `GET /api/admin/legacy/stats` | Admin | Legacy import stats |
| `GET /api/admin/appointments` | Admin | List appointments |
| `GET /api/whatsapp/link/:service_id?` | — | Generate WhatsApp link |
| `POST /api/whatsapp/inquiry` | — | Custom inquiry link |
| `POST /api/n8n/webhook` | Key | n8n AI workflow callback |
| `GET /api/wellness-coins/my-balance` | User | My coins + ledger |
| `GET /api/wellness-coins/leaderboard` | — | Top coin holders |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials and secrets

# 3. Create PostgreSQL database
createdb medwell

# 4. Run migrations
npm run migrate

# 5. Seed admin user
npm run seed

# 6. Start development server
npm run dev
```

## Deployment to Heberjahiz

1. Push code to your repository
2. Set up PostgreSQL database on Heberjahiz cPanel
3. Configure environment variables in Heberjahiz hosting panel
4. Set `NODE_ENV=production` and `RUN_MIGRATIONS=true` on first deploy
5. Point your domain to the Node.js app (Heberjahiz supports Node.js via cPanel)
