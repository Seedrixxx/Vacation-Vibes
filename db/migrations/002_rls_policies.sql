-- RLS Policies for Vacation Vibes
-- Public read for published content; admin write; public insert for inquiries; deposits write via service role only

-- Destinations: public read all
CREATE POLICY "Public read destinations" ON public.destinations
  FOR SELECT USING (true);

CREATE POLICY "Admin all destinations" ON public.destinations
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin')
  )
  WITH CHECK (
    auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin')
  );

-- Simpler: use service role for admin in app; anon can only read. So we only need SELECT for anon.
-- Admin mutations will use service role client. So policies:
-- 1) anon/key: SELECT only on destinations, experiences, packages (published), itinerary_days (via package), blog_posts (published)
-- 2) anon: INSERT on inquiries
-- 3) deposits: no anon insert; only service role insert/update

DROP POLICY IF EXISTS "Admin all destinations" ON public.destinations;

-- Destinations: anon read
CREATE POLICY "destinations_select" ON public.destinations FOR SELECT USING (true);

-- Experiences: anon read
CREATE POLICY "experiences_select" ON public.experiences FOR SELECT USING (true);

-- Packages: anon read published only
CREATE POLICY "packages_select" ON public.packages FOR SELECT USING (is_published = true);

-- Itinerary_days: anon read where package is published
CREATE POLICY "itinerary_days_select" ON public.itinerary_days FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.packages p WHERE p.id = itinerary_days.package_id AND p.is_published = true)
);

-- Blog: anon read published only
CREATE POLICY "blog_posts_select" ON public.blog_posts FOR SELECT USING (is_published = true);

-- Inquiries: anon insert only; no public read
CREATE POLICY "inquiries_insert" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Deposits: no direct anon access; service role used by API
CREATE POLICY "deposits_select_none" ON public.deposits FOR SELECT USING (false);
CREATE POLICY "deposits_insert_none" ON public.deposits FOR INSERT WITH CHECK (false);

-- Allow service role to do everything (service role bypasses RLS by default in Supabase)
-- So we're done. Admin app will use SUPABASE_SERVICE_ROLE_KEY for all CMS writes and for reading inquiries/deposits.
