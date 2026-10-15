-- ==============================================================================
-- UNIQUE FOCUS ASSOCIATION (UFA) - SUPABASE SECURITY & PRODUCTION SCHEMA
-- ==============================================================================
-- This script configures all database tables, Row Level Security (RLS) policies,
-- and Supabase Storage bucket access controls for the visitor portal and admin dashboard.
-- Run this in the Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/_/sql).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. UPCOMING EVENTS TABLE & POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.upcoming_events (
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
  image_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;

-- Public can only view published events
DROP POLICY IF EXISTS "Public select published events" ON public.upcoming_events;
CREATE POLICY "Public select published events"
ON public.upcoming_events
FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Authenticated administrators can perform all actions (Insert, Update, Delete, Select drafts)
DROP POLICY IF EXISTS "Admin manage upcoming events" ON public.upcoming_events;
CREATE POLICY "Admin manage upcoming events"
ON public.upcoming_events
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 2. MERCHANDISE TABLE & POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.merchandise (
  id TEXT PRIMARY KEY DEFAULT ('merch-' || extract(epoch from now())::text),
  name TEXT NOT NULL,
  desc TEXT NOT NULL,
  badge TEXT DEFAULT 'Official Gear',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.merchandise ENABLE ROW LEVEL SECURITY;

-- Public can view active merchandise
DROP POLICY IF EXISTS "Public select active merchandise" ON public.merchandise;
CREATE POLICY "Public select active merchandise"
ON public.merchandise
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Authenticated administrators can manage merchandise catalogue
DROP POLICY IF EXISTS "Admin manage merchandise" ON public.merchandise;
CREATE POLICY "Admin manage merchandise"
ON public.merchandise
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 3. LEADERSHIP & OFFICIALS TABLE & POLICIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.officials (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.officials ENABLE ROW LEVEL SECURITY;

-- Public can view active officials
DROP POLICY IF EXISTS "Public select active officials" ON public.officials;
CREATE POLICY "Public select active officials"
ON public.officials
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Authenticated administrators can manage leadership entries
DROP POLICY IF EXISTS "Admin manage officials" ON public.officials;
CREATE POLICY "Admin manage officials"
ON public.officials
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. MEMBERSHIP APPLICATIONS (Confidential Visitor Submissions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.membership_applications (
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

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- Public visitors can submit applications (INSERT only)
DROP POLICY IF EXISTS "Public insert membership applications" ON public.membership_applications;
CREATE POLICY "Public insert membership applications"
ON public.membership_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated administrators can read or update submitted applications
DROP POLICY IF EXISTS "Admin read membership applications" ON public.membership_applications;
CREATE POLICY "Admin read membership applications"
ON public.membership_applications
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admin update membership applications" ON public.membership_applications;
CREATE POLICY "Admin update membership applications"
ON public.membership_applications
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 5. CONTACT INQUIRIES & MERCHANDISE INQUIRIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert contact messages" ON public.contact_messages;
CREATE POLICY "Public insert contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage contact messages" ON public.contact_messages;
CREATE POLICY "Admin manage contact messages"
ON public.contact_messages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Merchandise Inquiries
CREATE TABLE IF NOT EXISTS public.merchandise_inquiries (
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

DROP POLICY IF EXISTS "Public insert merchandise inquiries" ON public.merchandise_inquiries;
CREATE POLICY "Public insert merchandise inquiries"
ON public.merchandise_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin manage merchandise inquiries" ON public.merchandise_inquiries;
CREATE POLICY "Admin manage merchandise inquiries"
ON public.merchandise_inquiries
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 6. SUPABASE STORAGE BUCKET CONFIGURATION (ufa-media)
-- ------------------------------------------------------------------------------
-- Create bucket for uploaded event banners, merchandise photos, and officials portraits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ufa-media',
  'ufa-media',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage RLS: Public read for assets
DROP POLICY IF EXISTS "Public read ufa media" ON storage.objects;
CREATE POLICY "Public read ufa media"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'ufa-media');

-- Storage RLS: Authenticated admin upload, update, delete
DROP POLICY IF EXISTS "Admin upload ufa media" ON storage.objects;
CREATE POLICY "Admin upload ufa media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ufa-media');

DROP POLICY IF EXISTS "Admin update ufa media" ON storage.objects;
CREATE POLICY "Admin update ufa media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'ufa-media')
WITH CHECK (bucket_id = 'ufa-media');

DROP POLICY IF EXISTS "Admin delete ufa media" ON storage.objects;
CREATE POLICY "Admin delete ufa media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'ufa-media');

-- ------------------------------------------------------------------------------
-- 7. PERMISSION GRANTS FOR EXPOSED SCHEMA
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Revoke sensitive tables SELECT from anon
REVOKE SELECT ON TABLE public.membership_applications FROM anon;
REVOKE SELECT ON TABLE public.contact_messages FROM anon;
REVOKE SELECT ON TABLE public.merchandise_inquiries FROM anon;

-- Allow anon INSERT on submission tables
GRANT INSERT ON TABLE public.membership_applications TO anon;
GRANT INSERT ON TABLE public.contact_messages TO anon;
GRANT INSERT ON TABLE public.merchandise_inquiries TO anon;

