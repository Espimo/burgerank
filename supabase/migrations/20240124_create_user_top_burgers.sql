-- Create user_top_burgers table for storing user's top 5 ranked burgers
create table if not exists public.user_top_burgers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ordered_burger_ids uuid[] not null,
  is_manual boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id)
);

-- Create index for faster lookups
create index if not exists idx_user_top_burgers_user_id on public.user_top_burgers(user_id);

-- Add RLS policies
alter table public.user_top_burgers enable row level security;

create policy "Users can view their own top burgers"
  on public.user_top_burgers
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own top burgers"
  on public.user_top_burgers
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own top burgers"
  on public.user_top_burgers
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own top burgers"
  on public.user_top_burgers
  for delete
  using (auth.uid() = user_id);

-- Create trigger to auto-update updated_at
create or replace function public.update_user_top_burgers_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_user_top_burgers_updated_at_trigger
  before update on public.user_top_burgers
  for each row
  execute function public.update_user_top_burgers_updated_at();
