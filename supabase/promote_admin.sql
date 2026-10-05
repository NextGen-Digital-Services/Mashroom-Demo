-- Promote a signed-up user to admin.
-- 1. In Supabase Dashboard -> Authentication -> Users, create the user
--    (demo: admin@brand.com / Admin@123) — or sign up from the site first.
-- 2. Run this in the SQL Editor, adjusting the email if needed.
update public.user_profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@brand.com')
returning id, name, role;
