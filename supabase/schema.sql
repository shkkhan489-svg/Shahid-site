create extension if not exists pgcrypto;
create table posts(id uuid primary key default gen_random_uuid(),kind text default 'post',title text,body text,media jsonb default '[]',created_at timestamptz default now());
create table comments(id uuid primary key default gen_random_uuid(),post_id text,name text,body text,approved boolean default false,created_at timestamptz default now());
create table likes(id uuid primary key default gen_random_uuid(),post_id text,approved boolean default false,created_at timestamptz default now());
create table inbox(id uuid primary key default gen_random_uuid(),kind text,name text,email text,phone text,title text,message text,file_url text,replied boolean default false,created_at timestamptz default now());
insert into storage.buckets(id,name,public) values('uploads','uploads',true) on conflict do nothing;
alter table posts enable row level security;alter table comments enable row level security;alter table likes enable row level security;alter table inbox enable row level security;
