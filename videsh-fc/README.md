# ⚽ Videsh FC — Personal Football Portfolio

A premium, modern football tracking web app built with **Next.js** + **Supabase**, deployable on **Vercel** in minutes.

**White & Gold** luxury design | Public portfolio | Password-protected admin panel

---

## Features

| Section | Public | Admin |
|---------|--------|-------|
| Player profile & bio | ✅ | ✅ |
| Match history & results | ✅ | ✅ Add |
| Stats dashboard (charts) | ✅ | — |
| Achievements wall | ✅ | ✅ Add |
| Training log | ✅ | ✅ Add |
| Highlights gallery | ✅ | ✅ Add |

---

## Setup (Step by Step)

### Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up → Create a new project
2. Give it a name (e.g. `videsh-fc`) and set a database password
3. Wait for the project to start (~1 min)

### Step 2 — Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase/schema.sql` from this project
3. Paste the entire contents into the SQL Editor
4. Click **Run** — this creates all tables and adds sample data

### Step 3 — Get Your API Keys

In your Supabase dashboard:
1. Go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY`

### Step 4 — Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase keys from Step 3
3. Set `ADMIN_PASSWORD` to any password you want (you'll use this to log in)
4. Set `SESSION_SECRET` to any long random string

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ADMIN_PASSWORD=yourpassword
SESSION_SECRET=anylongrandomstring123
```

### Step 5 — Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 6 — Deploy to Vercel

1. Push this project to a **GitHub repository**
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. In Vercel project settings → **Environment Variables**, add all 5 variables from Step 4
4. Click **Deploy** 🚀

---

## How to Use

### Public Site (anyone can view)
- Visit your Vercel URL — it's your live portfolio!
- All stats, matches, achievements, and highlights are visible
- Nothing can be edited or changed by visitors

### Admin Panel (only you)
- Go to `yoursite.com/admin`
- Enter your `ADMIN_PASSWORD`
- Use the sidebar to add matches, training sessions, achievements, and highlights

---

## Customizing Your Profile

1. In your Supabase dashboard → **Table Editor → profile**
2. Click the single row and edit:
   - `name` — Your name
   - `position` — Your position
   - `club` — Your team/school
   - `bio` — Your story
   - `jersey_number` — Your jersey number
   - `city` — Your city
   - `tagline` — Tagline shown on hero

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | Framework |
| **Supabase** | Database & Auth |
| **Tailwind CSS** | Styling |
| **Chart.js** | Stats charts |
| **Cormorant Garamond** | Display font |
| **DM Sans** | Body font |
| **Vercel** | Deployment |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Hero home with profile & latest matches |
| `/matches` | Full match history with filters |
| `/stats` | Charts & detailed statistics |
| `/achievements` | Trophy wall |
| `/training` | Training log |
| `/highlights` | Media gallery |
| `/admin` | Login |
| `/admin/dashboard` | Admin overview |
| `/admin/add-match` | Log a match |
| `/admin/add-training` | Log training |
| `/admin/add-achievement` | Add trophy/award |
| `/admin/add-highlight` | Add video/photo |

---

Made with ❤️ and ⚽ for Videsh FC
