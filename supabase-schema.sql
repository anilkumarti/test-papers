-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query → paste → Run

create extension if not exists "pgcrypto";

create table if not exists users (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text unique not null,
  password text not null,
  role text not null default 'USER',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists subjects (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  name_hi text not null,
  code text unique not null,
  sort_order int not null default 0,
  color text not null default '#3B82F6'
);

create table if not exists topics (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  name_hi text not null,
  subject_id text not null references subjects(id)
);

create table if not exists questions (
  id text primary key default gen_random_uuid()::text,
  text_hi text not null,
  text_en text,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct text not null,
  explanation text not null,
  explan_hi text,
  subject_id text not null references subjects(id),
  topic_id text not null references topics(id),
  difficulty text not null default 'MEDIUM',
  source text,
  tags text,
  is_active boolean not null default true,
  needs_review boolean not null default false,
  flag_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists mock_tests (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  title_hi text not null,
  description text,
  type text not null default 'FULL',
  total_questions int not null,
  total_marks int not null,
  duration int not null,
  negative_marks float not null default 0.0,
  is_published boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  subject_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists test_questions (
  id text primary key default gen_random_uuid()::text,
  test_id text not null references mock_tests(id) on delete cascade,
  question_id text not null references questions(id),
  sort_order int not null default 0
);

create table if not exists test_attempts (
  id text primary key default gen_random_uuid()::text,
  user_id text not null references users(id),
  test_id text not null references mock_tests(id),
  started_at timestamptz default now(),
  submitted_at timestamptz,
  score float,
  total_marks int,
  percentage float,
  time_taken int,
  is_completed boolean not null default false
);

create table if not exists question_attempts (
  id text primary key default gen_random_uuid()::text,
  attempt_id text not null references test_attempts(id) on delete cascade,
  question_id text not null references questions(id),
  selected_option text,
  is_correct boolean,
  is_marked boolean not null default false,
  time_taken int
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger users_updated_at before update on users for each row execute function update_updated_at();
create trigger questions_updated_at before update on questions for each row execute function update_updated_at();
create trigger mock_tests_updated_at before update on mock_tests for each row execute function update_updated_at();

-- Disable RLS (we use service role key server-side)
alter table users disable row level security;
alter table subjects disable row level security;
alter table topics disable row level security;
alter table questions disable row level security;
alter table mock_tests disable row level security;
alter table test_questions disable row level security;
alter table test_attempts disable row level security;
alter table question_attempts disable row level security;
