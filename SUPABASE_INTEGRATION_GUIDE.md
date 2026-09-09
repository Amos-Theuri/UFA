# Supabase Integration & Hosting Guide - UFA Website

This guide outlines the step-by-step roadmap for connecting **Supabase** (PostgreSQL Database, Authentication, and Storage) to the **Unique Focus Association (UFA)** Vite/React front-end, followed by production hosting recommendations.

---

## 🧭 Phase 1: Supabase Project Setup

### 1. Create Supabase Project
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**, select your organization, give it a name (e.g., `ufa-kenya`), and select a region close to your target audience (e.g., `af-south-1` Johannesburg or `eu-central-1` Frankfurt).
3. Set a strong database password and copy your **Project URL** and **Anon / Public API Key**.

---

## 🗄️ Phase 2: Database Schema & Tables

Execute the following SQL schemas in the Supabase **SQL Editor**:

### 1. Contact Messages (`contact_messages`)
Stores submissions from the interactive form on [`/Contact`](file:///c:/Users/User/webdev/ufa/src/Pages/Contact.jsx).
```sql
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- 'unread', 'in_progress', 'resolved'
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous users to insert new messages
CREATE POLICY "Allow public inserts" ON public.contact_messages
  FOR INSERT WITH CHECK (true);
```

### 2. Membership Applications (`membership_applications`)
Captures data when users click "Join UFA".
```sql
CREATE TABLE public.membership_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  county TEXT NOT NULL,
  area_of_interest TEXT, -- 'leadership', 'mentorship', 'environment', 'innovation'
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'declined'
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public member registration" ON public.membership_applications
  FOR INSERT WITH CHECK (true);
```

### 3. Dynamic Leadership Team (`officials`)
Enables dynamic updates to leadership members without editing `officials.json`.
```sql
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

ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active officials
CREATE POLICY "Allow public read of officials" ON public.officials
  FOR SELECT USING (is_active = true);
```

### 4. Merchandise Inquiries / Orders (`merchandise_inquiries`)
```sql
CREATE TABLE public.merchandise_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  quantity INT DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.merchandise_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public order inquiries" ON public.merchandise_inquiries
  FOR INSERT WITH CHECK (true);
```

---

## ⚙️ Phase 3: Front-end Configuration

### 1. Install Supabase Client
Run the following in your project terminal:
```powershell
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables
Create a `.env` file in your root folder:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
> [!IMPORTANT]
> Ensure `.env` is listed in your `.gitignore` to avoid committing keys to public repositories. Create a `.env.example` file for team reference.

### 3. Initialize Client Helper
Create `src/lib/supabaseClient.js`:
```javascript
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🔌 Phase 4: Connecting React Components

### 1. Connecting `Contact.jsx`
Update `handleSubmit` in [`src/Pages/Contact.jsx`](file:///c:/Users/User/webdev/ufa/src/Pages/Contact.jsx):
```javascript
import { supabase } from "../lib/supabaseClient";

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const { error } = await supabase
    .from('contact_messages')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      },
    ]);

  setIsLoading(false);
  if (!error) {
    setIsSubmitted(true);
  } else {
    console.error("Error sending message:", error.message);
  }
};
```

### 2. Connecting `Officials.jsx` (Dynamic Data with Fallback)
Update [`src/components/Officials.jsx`](file:///c:/Users/User/webdev/ufa/src/components/Officials.jsx):
```javascript
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import fallbackOfficials from "../data/officials.json";

export default function Officials() {
  const [officials, setOfficials] = useState(fallbackOfficials);

  useEffect(() => {
    async function fetchOfficials() {
      const { data, error } = await supabase
        .from('officials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setOfficials(data);
      }
    }
    fetchOfficials();
  }, []);

  // Render using `officials` state...
}
```

---

## 🌐 Phase 5: Hosting Recommendations

When deploying the frontend with Supabase backend, consider the following hosting options:

| Provider | Best For | Free Tier Features | Setup Complexity |
| :--- | :--- | :--- | :--- |
| **Vercel** *(Recommended)* | Vite / React SPAs | Unlimited deployments, fast global edge CDN, automatic preview branches, SSL | 🟢 1-Click (Connects directly to GitHub) |
| **Netlify** | Static + Form SPAs | Global CDN, continuous Git deployments, built-in forms | 🟢 1-Click |
| **Cloudflare Pages** | High traffic & speed | Unlimited bandwidth, 500 builds/month, ultra-low latency worldwide | 🟢 Very Simple |
| **GitHub Pages** | Open source / simple hosting | Free static hosting with `gh-pages` | 🟡 Needs `404.html` SPA routing rewrite |

---

### Recommended Choice: **Vercel**

#### Why Vercel?
1. **Zero-Configuration Vite Support**: Automatically detects Vite, sets build command to `npm run build`, and output directory to `dist`.
2. **Environment Variables**: Easily paste `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` into the Vercel Dashboard under **Project Settings > Environment Variables**.
3. **SPA Routing**: Add a simple `vercel.json` file in your root folder to ensure direct URL navigation (e.g. `/About`, `/Contact`) never returns 404:

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

#### Deployment Steps:
1. Push your repository to GitHub.
2. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository (`Amos-Theuri/UFA`).
4. Add your Supabase environment variables.
5. Click **Deploy**. Your site will be live on a secure HTTPS custom domain in under 1 minute!
