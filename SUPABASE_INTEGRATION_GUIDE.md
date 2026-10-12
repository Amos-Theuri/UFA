# Supabase Integration & Deployment Guide - UFA Website

This comprehensive guide details how to integrate **Supabase** (PostgreSQL Database & Storage) into the **Unique Focus Association (UFA)** website, reflecting the current state of the codebase.

---

## 🏛️ Project Architecture: Visitor-Only Website

The UFA website is structured as a **visitor-first, public portal**:
- **No Sign-In / Authentication Required**: Visitors and general members do not need to register accounts, manage passwords, or log in.
- **Client-Side Form Submissions**: Visitors can submit applications through the interactive **Join UFA Modal** (`src/components/JoinModal.jsx`), submit general and regional inquiries through the **Contact Form** (`src/Pages/Contact.jsx`), or inquire about merchandise.
- **Supabase Role**: Serves as a secure, serverless backend database to capture submissions and optionally serve dynamic content (such as leadership profiles) without managing a custom server.
- **Row-Level Security (RLS)**: Enforces strict database permissions allowing anonymous visitors to submit (`INSERT`) applications and view (`SELECT`) active public content, while administrative actions (reading private submissions, editing records) remain restricted to authorized UFA staff in the Supabase Dashboard.

---

## 🧭 Phase 1: Supabase Project Setup

### Step 1: Create a Supabase Project
1. Navigate to the [Supabase Dashboard](https://supabase.com/dashboard) and sign in.
2. Click **New Project** and choose your organization.
3. Configure project details:
   - **Name**: `ufa-kenya` (or your preferred name)
   - **Database Password**: Generate and securely save a strong password.
   - **Region**: Choose a region with low latency to Kenya:
     - `af-south-1` (Johannesburg, South Africa) *(Recommended)*
     - `eu-central-1` (Frankfurt, Europe)
   - **Pricing Plan**: Free tier is sufficient for standard traffic and storage.
4. Click **Create new project** and wait ~2 minutes for provisioning to finish.

### Step 2: Retrieve API Credentials
1. In your project dashboard, navigate to **Project Settings** (gear icon in the sidebar) > **API**.
2. Under **Project API keys**, locate:
   - **Project URL**: Starts with `https://<project-ref>.supabase.co`
   - **anon / public key**: The public key safe to use in frontend code.
3. Keep these handy for Phase 3.

---

## 🗄️ Phase 2: Database Schema & Row-Level Security (SQL)

In the Supabase Dashboard, open the **SQL Editor** from the left navigation, click **New query**, paste the following SQL blocks, and click **Run**.

### 1. Membership Applications (`membership_applications`)
Captures all submissions from the **Join UFA** modal (`src/components/JoinModal.jsx`):

```sql
-- 1. Create table for Join UFA applications
CREATE TABLE public.membership_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact TEXT NOT NULL,
  county TEXT NOT NULL,
  area_of_interest TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row-Level Security
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow visitors to submit their membership application
CREATE POLICY "Allow public insert of membership applications" 
ON public.membership_applications
FOR INSERT 
WITH CHECK (true);

-- 4. Policy: Restrict reading to authenticated service role / dashboard users only
-- (Visitors cannot read other applicants' data)
```

### 2. Contact Inquiries (`contact_messages`)
Captures inquiries submitted via the form on the Contact page (`src/Pages/Contact.jsx`):

```sql
-- 1. Create table for Contact inquiries
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row-Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow visitors to send inquiries
CREATE POLICY "Allow public insert of contact messages" 
ON public.contact_messages
FOR INSERT 
WITH CHECK (true);
```

### 3. Dynamic Leadership Team (`officials`)
Enables updating UFA leadership profiles dynamically without redeploying code.

```sql
-- 1. Create table for Leadership Profiles
CREATE TABLE public.officials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row-Level Security
ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public to view active officials
CREATE POLICY "Allow public select of active officials" 
ON public.officials
FOR SELECT 
USING (is_active = true);
```

#### Seed Initial Officials Data (Matching Current Project State)
Run this query to seed the 11 national leaders currently in `src/data/officials.json`:

```sql
INSERT INTO public.officials (id, name, title, bio, image_url, display_order, is_active)
VALUES
  (1, 'Joshua Omondi', 'Chief Executive Officer / National Chairperson', 'Leading strategic vision and organizational growth across all national operations.', '/officials/official_1.jpeg', 1, true),
  (2, 'Subira Ethel', 'National Vice Chair 1', 'Principal assistant to the CEO driving regional leadership alignment.', '/officials/official_5.jpeg', 2, true),
  (3, 'Dennis Okumu', 'Administrative S.G', 'Oversees governance, protocol, and daily administrative operations of the association.', '/officials/official_4.jpeg', 3, true),
  (4, 'Angela Nabwire', 'Chief Finance Officer', 'Guiding fiscal policy, sustainable budget allocation, and partner resource management.', '/officials/official_3.jpeg', 4, true),
  (5, 'Samuel Ogutu', 'National Youth Leader', 'Directing nationwide youth engagement programs and grassroots initiatives.', '/officials/official_6.jpeg', 5, true),
  (6, 'Winfred Shem', 'Chief Community Engagement Officer', 'Overseeing community outreach programs and coordinating county chapter activities.', '/officials/official_2.jpeg', 6, true),
  (7, 'Derrick Wanjala', 'Director Communications and Advocacy', 'Handles media relations, public advocacy, and corporate communications for UFA.', '/officials/official_7.jpg', 7, true),
  (8, 'Dericks Ogola', 'National Vice Chair 2', 'Coordinates national membership recruitment and retention strategies.', '/officials/official_8.jpeg', 8, true),
  (9, 'Marian Magio', 'National Woman Representative', 'Leads national women empowerment and affirmative development programs.', '/officials/official_9.jpeg', 9, true),
  (10, 'Tancliff Jones', 'Director of Programmes', 'Designs and executes high-impact national youth training and innovation programs.', '/officials/official_7.jpg', 10, true),
  (11, 'Demtilla Otete', 'National Organizing Secretary', 'Plans and coordinates national conferences, regional summits, and youth campaigns.', '/officials/official_11.jpeg', 11, true)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    title = EXCLUDED.title, 
    bio = EXCLUDED.bio, 
    image_url = EXCLUDED.image_url,
    display_order = EXCLUDED.display_order;
```

### 4. Merchandise Inquiries (`merchandise_inquiries`)
```sql
CREATE TABLE public.merchandise_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  quantity INT DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.merchandise_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert of merchandise orders" 
ON public.merchandise_inquiries
FOR INSERT 
WITH CHECK (true);
```

### 5. Upcoming Events & Programmes (`upcoming_events`)
Allows UFA administrators to add, edit, toggle visibility, and delete upcoming events dynamically without needing a developer to deploy code updates.

```sql
-- 1. Create table for Upcoming Events
CREATE TABLE public.upcoming_events (
  id TEXT PRIMARY KEY DEFAULT ('event-' || extract(epoch from now())::text),
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL DEFAULT 'Leadership Summit',
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  platform TEXT,
  speakers TEXT[] DEFAULT '{}',
  registration_link TEXT,
  badge TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row-Level Security
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public visitors can view only published events
CREATE POLICY "Allow public select of published events" 
ON public.upcoming_events
FOR SELECT 
USING (is_published = true);

-- 4. Policy: Authenticated users / Service Role can manage all events (Insert, Update, Delete)
CREATE POLICY "Allow admin full access to events"
ON public.upcoming_events
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

#### Seed Initial Upcoming Events Data (Matching Current Project State)
Run this query in SQL Editor to populate initial flagship events:

```sql
INSERT INTO public.upcoming_events (
  id, title, subtitle, category, date, time, location, platform, speakers, registration_link, badge, description, is_published
)
VALUES
  (
    'event-summit-2026',
    'National Youth Leadership & Governance Summit 2026',
    'Empowering Kenya''s Next Generation of Civic Leaders & Innovators',
    'Leadership Summit',
    'April 24, 2026',
    '09:00 AM - 04:30 PM EAT',
    'KICC, Tsavo Ballroom, Nairobi',
    'In-Person (Live Stream available on YouTube)',
    ARRAY['Joshua Omondi', 'Marian Magio', 'Dennis Okumu', 'Guest Civic Leaders'],
    'https://forms.gle/ufa-summit-2026',
    'Flagship 2026',
    'Join over 500 youth delegates from across all 47 counties for an immersive full-day summit. Key topics include ethical civic governance, economic resilience, youth-led grassroots policy advocacy, and technology in community transformation. Lunch, certificates, and networking materials provided.',
    true
  ),
  (
    'event-mental-health-apr26',
    'Mindset & Mental Health: Thriving in High-Stress Realities',
    'A Virtual Dialogue on Burnout, Resilience & Navigating Career Ambiguity',
    'Webinar',
    'May 9, 2026',
    '07:00 PM - 08:30 PM EAT',
    'Virtual (Google Meet & Zoom)',
    'Online Webinar',
    ARRAY['Angela Nabwire', 'Dr. Faith Mwende (Clinical Psychologist)', 'UFA Wellness Leads'],
    'https://forms.gle/ufa-mental-health-2026',
    'Free Entry',
    'An interactive, stigma-free virtual clinic focusing on emotional intelligence, coping mechanisms for youth unemployment anxiety, and practical tools to protect your mental health while building your ambition. Q&A session with registered mental health specialists.',
    true
  )
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    category = EXCLUDED.category,
    date = EXCLUDED.date,
    time = EXCLUDED.time,
    location = EXCLUDED.location,
    platform = EXCLUDED.platform,
    speakers = EXCLUDED.speakers,
    registration_link = EXCLUDED.registration_link,
    badge = EXCLUDED.badge,
    description = EXCLUDED.description,
    is_published = EXCLUDED.is_published;
```

---

## ⚙️ Phase 3: Frontend Client Configuration

### Step 1: Install Supabase JS Library
Inside your local project directory (`/home/scorpion/projects/web/ufa`), install `@supabase/supabase-js`:

```bash
npm install @supabase/supabase-js
```

### Step 2: Set Up Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

Create a corresponding `.env.example` file for version control:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> [!IMPORTANT]
> Confirm that `.env` is listed in your `.gitignore` file so that your API credentials are not committed to GitHub.

### Step 3: Create the Supabase Client Module
Create `src/lib/supabaseClient.js`:

```javascript
// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide a graceful fallback to prevent frontend crashes if keys are not configured yet
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
```

---

## 🔌 Phase 4: Connecting Project Components

### 1. Connecting the Join UFA Modal (`src/components/JoinModal.jsx`)
Update the submission handler in `src/components/JoinModal.jsx` so it saves applications to Supabase while retaining fallback to local storage:

```javascript
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

// Inside JoinModalDialog component:
const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validateAll();
  const errorKeys = Object.keys(validationErrors);

  if (errorKeys.length > 0) {
    setErrors(validationErrors);
    setFormAlert("Please complete all required fields correctly before submitting.");
    const firstErrorField = errorKeys[0];
    const element = document.getElementById(`join-${firstErrorField}`);
    if (element) element.focus();
    return;
  }

  setErrors({});
  setFormAlert("");
  setIsSubmitting(true);

  try {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("membership_applications")
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            contact: formData.contact.trim(),
            county: formData.county,
            area_of_interest: formData.areaOfInterest,
          },
        ]);

      if (error) {
        throw error;
      }
    } else {
      // Offline / LocalStorage fallback
      const stored = JSON.parse(localStorage.getItem("ufa_join_applications") || "[]");
      stored.push({
        ...formData,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem("ufa_join_applications", JSON.stringify(stored));
    }

    setIsSuccess(true);
  } catch (err) {
    console.error("Membership application error:", err);
    setFormAlert("Could not submit application. Please check your internet connection or try again.");
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### 2. Connecting the Contact Form (`src/Pages/Contact.jsx`)
Update `handleSubmit` in `src/Pages/Contact.jsx`:

```javascript
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

// Inside Contact component:
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            phone: formData.phone.trim(),
            subject: formData.subject,
            message: formData.message.trim(),
          },
        ]);

      if (error) throw error;
    }

    setIsSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "general",
      message: ""
    });
  } catch (err) {
    console.error("Error submitting contact inquiry:", err);
    alert("Unable to send inquiry right now. Please try calling or messaging via WhatsApp.");
  } finally {
    setIsLoading(false);
  }
};
```

---

### 3. Optional: Dynamic Officials (`src/components/Officials.jsx`)
If you want leadership updates made in the Supabase Dashboard to automatically reflect on the website, update `src/components/Officials.jsx`:

```javascript
import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import localOfficials from "../data/officials.json";

export default function Officials() {
  const [officialsList, setOfficialsList] = useState(localOfficials);

  useEffect(() => {
    async function fetchOfficials() {
      if (!isSupabaseConfigured || !supabase) return;

      const { data, error } = await supabase
        .from("officials")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        setOfficialsList(data);
      }
    }

    fetchOfficials();
  }, []);

  // Use officialsList.map(...) in the JSX render
}
```

### 4. Connecting Upcoming Events (`src/services/upcomingEventsService.js`)
Currently, upcoming events use local storage with broadcast reactivity so admins can manage events immediately without a backend. When Supabase is configured, you can enable persistent cloud synchronization across all visitor devices:

```javascript
// src/services/upcomingEventsService.js
import { defaultUpcomingEvents } from "../data/upcomingEvents";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const STORAGE_KEY = "ufa_upcoming_events";
const EVENT_CHANGE_KEY = "ufa_events_updated";

export async function fetchUpcomingEventsFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return getUpcomingEvents();

  try {
    const { data, error } = await supabase
      .from("upcoming_events")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      saveUpcomingEvents(data);
      return data;
    }
  } catch (err) {
    console.warn("Could not fetch remote events, using local cache:", err);
  }
  return getUpcomingEvents();
}
```

---

## 🔐 Phase 5: Hidden Admin Portal & Passcode Security

To allow UFA administrators to add, edit, and toggle upcoming events **without a developer** and without exposing management tools to visitors:

### 1. Hidden Route & Absence of Visitor Navigation
- **Routes**: `/admin/events` and `/portal/events-manager`
- **Zero Public Links**: The navbar, footer, and visitor pages do not contain any links or clues to the admin portal. Only UFA team members who know the direct URL can open it.

### 2. Client-Side Cryptographic Passcode Protection
- **Pre-configured Passcode**: `ufa_secure_admin_2026`
- **Web Crypto SHA-256**: The passcode is checked client-side using `crypto.subtle.digest("SHA-256")`. The plaintext passcode is never stored in plain text.
- **Brute Force Protection**: 5 consecutive incorrect attempts trigger a **2-minute lockout** timer.
- **Session Expiry**: Sessions are stored in `sessionStorage` and automatically invalidate after **4 hours** of inactivity or when clicking **Log Out**.
- **Custom Passcode (Optional)**: To customize the admin passcode without changing code, generate a SHA-256 hash of your chosen passcode and set `VITE_ADMIN_HASH` in `.env`:
  ```env
  VITE_ADMIN_HASH=your_sha256_hash_here
  ```

---

## 📬 Phase 6: Notifications & Admin Alerts

To alert UFA staff whenever a new member applies or sends an inquiry:

### Option A: Supabase Webhooks + Slack / WhatsApp
1. In Supabase Dashboard, navigate to **Database** > **Webhooks**.
2. Click **Create Webhook**:
   - Table: `membership_applications`
   - Events: `INSERT`
   - URL: Your webhook endpoint (e.g. Zapier, Make.com, or Slack Incoming Webhook).
3. Payload forwards the applicant's name, phone, county, and area of interest straight to your team's WhatsApp group or Slack channel.

### Option B: Supabase Database Email Trigger (Edge Function / Resend)
Using Supabase Edge Functions with [Resend](https://resend.com):
- Send an automatic welcome email to the applicant ("Welcome to Unique Focus Association!").
- Send a summary notification to `info@uniquefocusassociation.org`.

---

## 🚀 Phase 7: Production Deployment

### 1. Deploying to GitHub Pages (Current Setup)
GitHub Pages serves the static bundle built by Vite. When building for GitHub Pages, environment variables must be injected during build time:
1. Go to your GitHub repository: `https://github.com/Amos-Theuri/UFA`.
2. Navigate to **Settings** > **Secrets and variables** > **Actions**.
3. Add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_HASH` *(Optional, if custom admin passcode hash is used)*
4. If building locally before deploying with `npm run deploy`, ensure your local `.env` file contains the values.

### 2. Deploying to Vercel (Alternative / Custom Domain)
Vercel offers automatic edge deployment with zero configuration for Vite:
1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import `Amos-Theuri/UFA`.
3. In **Environment Variables**, paste:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_HASH` *(Optional)*
4. Add a `vercel.json` file in your root folder for client-side routing support:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
5. Click **Deploy**.

---

## ✅ Integration Checklist

- [ ] Supabase project created in South Africa (`af-south-1`) or Frankfurt (`eu-central-1`).
- [ ] SQL scripts executed for `membership_applications`, `contact_messages`, `officials`, `merchandise_inquiries`, and `upcoming_events`.
- [ ] Row-Level Security (RLS) enabled on all tables with appropriate public/authenticated policies.
- [ ] Seed data populated for officials and upcoming events.
- [ ] `@supabase/supabase-js` installed in project.
- [ ] `.env` and `.env.example` created with project URL and Anon key.
- [ ] `src/lib/supabaseClient.js` helper created.
- [ ] `JoinModal.jsx` connected with live submission test.
- [ ] `Contact.jsx` connected with live inquiry test.
- [ ] Upcoming Events admin portal tested at `/admin/events` with default passcode (`ufa_secure_admin_2026`).
- [ ] Verified build passes cleanly (`npm run lint && npm run build`).
- [ ] Environment variables configured in hosting provider settings.

