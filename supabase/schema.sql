create table if not exists public.advent_calendar (
  id text primary key default 'main' check (id = 'main'),
  config jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.advent_calendar enable row level security;

create table if not exists public.memory_book_entries (
  day integer primary key check (day between 1 and 25),
  answers jsonb not null default '{}'::jsonb,
  photo_urls jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

alter table public.memory_book_entries enable row level security;

create table if not exists public.storage_migrations (
  id text primary key,
  completed_at timestamptz not null default now()
);

alter table public.storage_migrations enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'advent-assets',
  'advent-assets',
  true,
  10485760,
  array['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
