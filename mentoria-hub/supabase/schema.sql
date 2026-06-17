-- Mentoria Hub — Supabase schema + Row Level Security
-- Idempotent: safe to re-run. Apply in Supabase SQL editor or via Management API.

-- ========================= TABLES =========================

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  email       text,
  grade       text,
  interests   text[]      not null default '{}',
  goal        text,
  streak      int         not null default 0,
  role        text        not null default 'student' check (role in ('student','admin')),
  created_at  timestamptz not null default now()
);

create table if not exists public.courses (
  id          text primary key,
  category    text        not null,
  title       text        not null,
  level       text,
  language    text,
  students    int         not null default 0,
  rating      numeric(2,1) not null default 5.0,
  hours       int         not null default 0,
  tags        text[]      not null default '{}',
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists public.lessons (
  course_id   text        not null references public.courses(id) on delete cascade,
  id          text        not null,
  position    int         not null default 0,
  title       text        not null,
  duration    text,
  points      text[]      not null default '{}',
  quiz        jsonb,
  primary key (course_id, id)
);

create table if not exists public.opportunities (
  id          text primary key,
  title       text        not null,
  organization text,
  category    text        not null,
  format      text,
  grades      text,
  eligibility text,
  description text,
  tags        text[]      not null default '{}',
  deadline    date,
  link        text,
  created_at  timestamptz not null default now()
);

create table if not exists public.saved_opportunities (
  user_id        uuid        not null references auth.users(id) on delete cascade,
  opportunity_id text        not null references public.opportunities(id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

create table if not exists public.lesson_progress (
  user_id      uuid        not null references auth.users(id) on delete cascade,
  course_id    text        not null,
  lesson_id    text        not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, course_id, lesson_id)
);

-- ========================= INDEXES =========================
create index if not exists idx_lessons_course   on public.lessons(course_id);
create index if not exists idx_courses_category  on public.courses(category);
create index if not exists idx_opps_category     on public.opportunities(category);
create index if not exists idx_opps_deadline     on public.opportunities(deadline);
create index if not exists idx_saved_user        on public.saved_opportunities(user_id);
create index if not exists idx_progress_user     on public.lesson_progress(user_id);

-- ========================= HELPERS =========================
-- SECURITY DEFINER so it reads profiles bypassing RLS -> no policy recursion.
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent privilege escalation: only admins may set/change the role column.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- Only restrict real authenticated clients (auth.uid() not null).
  -- Server-side/superuser context (service key, SQL editor) has a null uid and may manage roles.
  -- Anonymous clients can never reach profiles (RLS blocks insert/update without auth.uid() = id).
  if tg_op = 'INSERT' then
    if auth.uid() is not null and not public.is_admin() then new.role := 'student'; end if;
  elsif tg_op = 'UPDATE' then
    if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
      new.role := old.role;
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists trg_guard_role_ins on public.profiles;
create trigger trg_guard_role_ins before insert on public.profiles
  for each row execute function public.guard_profile_role();
drop trigger if exists trg_guard_role_upd on public.profiles;
create trigger trg_guard_role_upd before update on public.profiles
  for each row execute function public.guard_profile_role();

-- ========================= GRANTS =========================
grant usage on schema public to anon, authenticated;
grant select on public.courses, public.lessons, public.opportunities to anon, authenticated;
grant select, insert, update, delete on public.courses, public.lessons, public.opportunities to authenticated;
grant select, insert, update, delete on public.profiles, public.saved_opportunities, public.lesson_progress to authenticated;

-- ========================= RLS =========================
alter table public.profiles            enable row level security;
alter table public.courses             enable row level security;
alter table public.lessons             enable row level security;
alter table public.opportunities       enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.lesson_progress     enable row level security;

-- profiles: a user may only see/manage their own row
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- courses: public read, admin-only writes
drop policy if exists courses_select_all on public.courses;
create policy courses_select_all on public.courses for select using (true);
drop policy if exists courses_admin_write on public.courses;
create policy courses_admin_write on public.courses for all using (public.is_admin()) with check (public.is_admin());

-- lessons: public read, admin-only writes
drop policy if exists lessons_select_all on public.lessons;
create policy lessons_select_all on public.lessons for select using (true);
drop policy if exists lessons_admin_write on public.lessons;
create policy lessons_admin_write on public.lessons for all using (public.is_admin()) with check (public.is_admin());

-- opportunities: public read, admin-only writes
drop policy if exists opps_select_all on public.opportunities;
create policy opps_select_all on public.opportunities for select using (true);
drop policy if exists opps_admin_write on public.opportunities;
create policy opps_admin_write on public.opportunities for all using (public.is_admin()) with check (public.is_admin());

-- saved_opportunities: owner-only CRUD
drop policy if exists saved_all_own on public.saved_opportunities;
create policy saved_all_own on public.saved_opportunities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- lesson_progress: owner-only CRUD
drop policy if exists progress_all_own on public.lesson_progress;
create policy progress_all_own on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ========================= FEATURE ADDITIONS =========================

-- Accumulated active study time (seconds). Incremented by the activity timer.
alter table public.profiles add column if not exists study_seconds int not null default 0;

-- Per-course personal practice: free notes, saved formulas, and self-authored questions.
create table if not exists public.course_notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  course_id  text        not null references public.courses(id) on delete cascade,
  kind       text        not null default 'note' check (kind in ('note','formula','question')),
  content    text        not null,
  answer     text,
  created_at timestamptz not null default now()
);
create index if not exists idx_notes_user_course on public.course_notes(user_id, course_id);
grant select, insert, update, delete on public.course_notes to authenticated;
alter table public.course_notes enable row level security;
drop policy if exists notes_all_own on public.course_notes;
create policy notes_all_own on public.course_notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ========================= SECURITY HARDENING (post-review) =========================
-- Only http(s) links may be stored (blocks javascript:/data: URI injection at the DB layer).
alter table public.opportunities drop constraint if exists opp_link_http;
alter table public.opportunities add constraint opp_link_http check (link is null or link ~* '^https?://');
-- Length caps prevent abuse / bloat of unbounded text columns.
alter table public.opportunities drop constraint if exists opp_title_len;
alter table public.opportunities add constraint opp_title_len check (char_length(title) <= 255);
alter table public.courses drop constraint if exists course_title_len;
alter table public.courses add constraint course_title_len check (char_length(title) <= 255);
alter table public.course_notes drop constraint if exists note_content_len;
alter table public.course_notes add constraint note_content_len check (char_length(content) <= 10000);
-- Referential integrity: progress rows must point at a real course (blocks fabricated completions).
alter table public.lesson_progress drop constraint if exists fk_lp_course;
alter table public.lesson_progress add constraint fk_lp_course foreign key (course_id) references public.courses(id) on delete cascade;
