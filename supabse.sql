
-- =========================================
-- 🔐 EXTENSIONS
-- =========================================
create extension if not exists "uuid-ossp";
create extension if not exists btree_gist;

-- =========================================
-- 👤 PROFILES
-- =========================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,

  role text not null default 'patient',
  -- patient | therapist | admin | staff

  is_active boolean default true,

  created_at timestamp default now()
);

-- =========================================
-- 🧠 THERAPIST PROFILE
-- =========================================
create table if not exists therapist_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references profiles(id) on delete cascade,

  specialty text,
  bio text,
  years_experience int default 0,

  session_price numeric default 0,

  created_at timestamp default now()
);

-- =========================================
-- 👤 PATIENT MEDICAL FILE
-- =========================================
create table if not exists patient_records (
  id uuid primary key default uuid_generate_v4(),

  patient_id uuid references profiles(id) on delete cascade,
  therapist_id uuid references profiles(id),

  diagnosis text,
  notes text,

  risk_level text default 'low',
  -- low | medium | high

  created_at timestamp default now()
);

-- =========================================
-- 📅 APPOINTMENTS (CORE BOOKING)
-- =========================================
create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),

  patient_id uuid not null references profiles(id) on delete cascade,
  therapist_id uuid not null references profiles(id) on delete cascade,

  start_time timestamp not null,
  end_time timestamp not null,

  status text default 'pending',
  -- pending | confirmed | cancelled | completed | no_show

  meeting_type text default 'in_person',
  -- in_person | online

  notes text,

  created_at timestamp default now(),

  constraint valid_time check (end_time > start_time)
);

-- =========================================
-- 🚨 ANTI OVERLAP (CRITICAL)
-- =========================================
alter table appointments
add constraint no_overlap
exclude using gist (
  therapist_id with =,
  tstzrange(start_time, end_time) with &&
);

-- =========================================
-- 📅 AVAILABILITY
-- =========================================
create table if not exists availability (
  id uuid primary key default uuid_generate_v4(),

  therapist_id uuid references profiles(id) on delete cascade,

  day_of_week int check (day_of_week between 0 and 6),

  start_time time not null,
  end_time time not null,

  is_active boolean default true
);

-- =========================================
-- 🔔 NOTIFICATIONS SYSTEM
-- =========================================
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),

  user_id uuid references profiles(id) on delete cascade,

  type text,
  -- appointment_created | reminder | cancellation | payment

  channel text default 'email',
  -- email | whatsapp | sms

  title text,
  message text,

  read boolean default false,

  created_at timestamp default now()
);

-- =========================================
-- 💳 PAYMENTS
-- =========================================
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),

  user_id uuid references profiles(id),
  appointment_id uuid references appointments(id),

  amount numeric not null,
  currency text default 'USD',

  status text default 'pending',
  -- pending | paid | failed | refunded

  provider text default 'stripe',

  created_at timestamp default now()
);

-- =========================================
-- 🧾 SESSION NOTES (CLINICAL)
-- =========================================
create table if not exists session_notes (
  id uuid primary key default uuid_generate_v4(),

  appointment_id uuid references appointments(id) on delete cascade,

  therapist_id uuid references profiles(id),
  patient_id uuid references profiles(id),

  content text,
  mood text,
  risk_assessment text,

  created_at timestamp default now()
);

-- =========================================
-- 🔐 ENABLE RLS
-- =========================================
alter table profiles enable row level security;
alter table therapist_profiles enable row level security;
alter table patient_records enable row level security;
alter table appointments enable row level security;
alter table availability enable row level security;
alter table notifications enable row level security;
alter table payments enable row level security;
alter table session_notes enable row level security;

-- =========================================
-- 🧠 ROLE FUNCTIONS
-- =========================================
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

create or replace function is_therapist()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid() and role = 'therapist'
  );
end;
$$ language plpgsql security definer;

-- =========================================
-- 📅 OVERLAP TRIGGER SAFETY (backup logic)
-- =========================================
create or replace function check_overlap()
returns trigger as $$
begin
  if exists (
    select 1
    from appointments a
    where a.therapist_id = new.therapist_id
      and a.status != 'cancelled'
      and new.start_time < a.end_time
      and new.end_time > a.start_time
  ) then
    raise exception 'Therapist already booked';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_overlap on appointments;

create trigger trg_overlap
before insert or update on appointments
for each row
execute function check_overlap();

-- =========================================
-- 🔐 RLS POLICIES (CORE SECURITY)
-- =========================================

-- PROFILES
create policy "profiles_access"
on profiles for select
using (auth.uid() = id OR is_admin());

-- APPOINTMENTS
create policy "appointments_access"
on appointments for select
using (
  auth.uid() = patient_id
  OR auth.uid() = therapist_id
  OR is_admin()
);

create policy "appointments_insert"
on appointments for insert
with check (auth.uid() = patient_id OR is_admin());

-- NOTES (STRICT MEDICAL)
create policy "notes_access"
on session_notes for select
using (
  auth.uid() = therapist_id
  OR auth.uid() = patient_id
  OR is_admin()
);

create policy "notes_write"
on session_notes for insert
with check (is_therapist() OR is_admin());

-- PAYMENTS
create policy "payments_access"
on payments for select
using (auth.uid() = user_id OR is_admin());

-- NOTIFICATIONS
create policy "notifications_access"
on notifications for select
using (auth.uid() = user_id OR is_admin());

-- AVAILABILITY
create policy "availability_public_read"
on availability for select
using (true);

-- =========================================
-- ⚡ INDEXES
-- =========================================
create index if not exists idx_appt_patient on appointments(patient_id);
create index if not exists idx_appt_therapist on appointments(therapist_id);
create index if not exists idx_appt_time on appointments(start_time);
create index if not exists idx_notes_patient on session_notes(patient_id);

-- =========================================
-- 🧠 ADMIN DASHBOARD VIEW
-- =========================================
create or replace view admin_dashboard as
select
  a.id,
  a.start_time,
  a.end_time,
  a.status,
  p1.full_name as patient,
  p2.full_name as therapist
from appointments a
left join profiles p1 on p1.id = a.patient_id
left join profiles p2 on p2.id = a.therapist_id;