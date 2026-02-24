-- Seed data for Vacation Vibes Phase 1
-- Run after migrations. Uses explicit UUIDs for stable references.

-- Destinations
INSERT INTO public.destinations (id, name, slug, country, focus_inbound, summary) VALUES
  ('d1000001-0000-4000-a000-000000000001', 'Sri Lanka', 'sri-lanka', 'Sri Lanka', true, 'An island of ancient temples, tea hills, wildlife, and golden beaches.'),
  ('d1000001-0000-4000-a000-000000000002', 'Maldives', 'maldives', 'Maldives', false, 'Overwater bungalows and crystal-clear waters.'),
  ('d1000001-0000-4000-a000-000000000003', 'Dubai', 'dubai', 'UAE', false, 'Modern luxury and desert adventures.'),
  ('d1000001-0000-4000-a000-000000000004', 'Thailand', 'thailand', 'Thailand', false, 'Temples, islands, and vibrant culture.'),
  ('d1000001-0000-4000-a000-000000000005', 'Seychelles', 'seychelles', 'Seychelles', false, 'Pristine beaches and rare wildlife.'),
  ('d1000001-0000-4000-a000-000000000006', 'Europe', 'europe', 'Various', false, 'Multi-country cultural journeys.')
ON CONFLICT (slug) DO NOTHING;

-- Experiences (Sri Lanka focus)
INSERT INTO public.experiences (id, name, slug, destination_id, tags, price_from, description) VALUES
  ('e2000001-0000-4000-a000-000000000001', 'Wildlife Safari', 'wildlife-safari', 'd1000001-0000-4000-a000-000000000001', ARRAY['wildlife','adventure'], 150, 'Yala or Udawalawe safari.'),
  ('e2000001-0000-4000-a000-000000000002', 'Scenic Train Ride', 'scenic-train', 'd1000001-0000-4000-a000-000000000001', ARRAY['scenic','culture'], 30, 'Kandy to Ella or Nuwara Eliya.'),
  ('e2000001-0000-4000-a000-000000000003', 'Tea Country Tour', 'tea-tour', 'd1000001-0000-4000-a000-000000000001', ARRAY['culture','nature'], 45, 'Tea factory and plantation visit.'),
  ('e2000001-0000-4000-a000-000000000004', 'Whale Watching', 'whale-watching', 'd1000001-0000-4000-a000-000000000001', ARRAY['wildlife','nature'], 80, 'Mirissa or Trincomalee.'),
  ('e2000001-0000-4000-a000-000000000005', 'Ayurveda Wellness', 'ayurveda-wellness', 'd1000001-0000-4000-a000-000000000001', ARRAY['wellness','luxury'], 120, 'Traditional treatments and retreats.')
ON CONFLICT (slug) DO NOTHING;

-- Packages (6+ with 3 featured)
INSERT INTO public.packages (id, title, slug, destination_id, travel_type, duration_days, budget_tier, price_from, deposit_amount, overview, route_summary, is_featured, is_published) VALUES
  ('p3000001-0000-4000-a000-000000000001', 'Essence of Ceylon', 'essence-of-ceylon', 'd1000001-0000-4000-a000-000000000001', 'cultural', 7, 'mid', 2499, 500, 'A week of temples, tea, and wildlife.', 'Colombo – Sigiriya – Kandy – Nuwara Eliya – Yala – Galle', true, true),
  ('p3000001-0000-4000-a000-000000000002', 'Tea Trails & Highlands', 'tea-trails-highlands', 'd1000001-0000-4000-a000-000000000001', 'cultural', 5, 'mid', 1899, 400, 'Train rides and tea country.', 'Kandy – Nuwara Eliya – Ella', true, true),
  ('p3000001-0000-4000-a000-000000000003', 'Coastal Serenity', 'coastal-serenity', 'd1000001-0000-4000-a000-000000000001', 'beach', 6, 'luxury', 2199, 450, 'Beaches, Galle Fort, whale watching.', 'Colombo – Galle – Mirissa', false, true),
  ('p3000001-0000-4000-a000-000000000004', 'Wildlife Expedition', 'wildlife-expedition', 'd1000001-0000-4000-a000-000000000001', 'adventure', 8, 'mid', 2899, 550, 'Yala, Udawalawe, Sinharaja.', 'Colombo – Yala – Udawalawe – Galle', true, true),
  ('p3000001-0000-4000-a000-000000000005', 'Maldives Escape', 'maldives-escape', 'd1000001-0000-4000-a000-000000000002', 'beach', 5, 'luxury', 3499, 700, 'Overwater villa and relaxation.', 'Male – Resort', false, true),
  ('p3000001-0000-4000-a000-000000000006', 'Dubai & Desert', 'dubai-desert', 'd1000001-0000-4000-a000-000000000003', 'luxury', 4, 'luxury', 1999, 400, 'City and desert safari.', 'Dubai', false, true)
ON CONFLICT (slug) DO NOTHING;

-- Itinerary days for first package
INSERT INTO public.itinerary_days (package_id, day_number, title, description, location) VALUES
  ('p3000001-0000-4000-a000-000000000001', 1, 'Arrival in Colombo', 'Airport meet and transfer to hotel. Rest or short city tour.', 'Colombo'),
  ('p3000001-0000-4000-a000-000000000001', 2, 'Sigiriya Rock', 'Visit the ancient rock fortress and palace ruins.', 'Sigiriya'),
  ('p3000001-0000-4000-a000-000000000001', 3, 'Temple of the Tooth', 'Kandy and the Temple of the Sacred Tooth Relic.', 'Kandy'),
  ('p3000001-0000-4000-a000-000000000001', 4, 'Tea Country', 'Scenic drive to Nuwara Eliya. Tea factory visit.', 'Nuwara Eliya'),
  ('p3000001-0000-4000-a000-000000000001', 5, 'Yala Safari', 'Full-day wildlife safari in Yala National Park.', 'Yala'),
  ('p3000001-0000-4000-a000-000000000001', 6, 'Galle Fort', 'Coastal drive. Explore Galle Fort and beaches.', 'Galle'),
  ('p3000001-0000-4000-a000-000000000001', 7, 'Departure', 'Transfer to airport.', 'Colombo')
ON CONFLICT (package_id, day_number) DO NOTHING;

-- Blog posts (2 published)
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, author_name, published_at, is_published) VALUES
  ('b4000001-0000-4000-a000-000000000001', 'Best Time to Visit Sri Lanka', 'best-time-visit-sri-lanka', 'When to go for wildlife, beaches, and culture.', '## Seasons\n\nSri Lanka has two monsoon seasons. The west and south are best from November to April. The east is best from April to September.\n\n## Wildlife\n\nYala is best in the dry season (Feb–Jul). Leopards and elephants are easier to spot.', 'Vacation Vibez Team', now() - interval '10 days', true),
  ('b4000001-0000-4000-a000-000000000002', '5 Must-Do Experiences in Sri Lanka', '5-must-do-sri-lanka', 'From safari to train rides.', '1. **Yala Safari** – Leopards and elephants.\n2. **Kandy–Ella Train** – Scenic highlands.\n3. **Tea Country** – Nuwara Eliya and Ella.\n4. **Galle Fort** – Colonial charm.\n5. **Whale Watching** – Mirissa.', 'Vacation Vibez Team', now() - interval '5 days', true)
ON CONFLICT (slug) DO NOTHING;
