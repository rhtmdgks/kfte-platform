-- Internal application forms (Google Forms-like)

create type public.application_form_status as enum ('draft', 'published', 'closed');

create table public.application_forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  status public.application_form_status not null default 'draft',
  schema jsonb not null default '{"sections":[{"id":"s1","title":"","description":"","items":[]}]}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.application_form_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.application_forms(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  respondent_email text,
  edit_token text unique,
  score numeric,
  submitted_at timestamptz not null default now()
);

create index application_form_responses_form_id_idx
  on public.application_form_responses(form_id);
create index application_form_responses_submitted_at_idx
  on public.application_form_responses(submitted_at desc);

alter table public.application_forms enable row level security;
alter table public.application_form_responses enable row level security;

create policy "admins manage application_forms"
  on public.application_forms for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "public read published application_forms"
  on public.application_forms for select
  using (status = 'published');

create policy "admins read application_form_responses"
  on public.application_form_responses for select
  using (public.is_admin());

create policy "admins delete application_form_responses"
  on public.application_form_responses for delete
  using (public.is_admin());

create policy "public insert responses for published forms"
  on public.application_form_responses for insert
  with check (
    exists (
      select 1 from public.application_forms f
      where f.id = form_id and f.status = 'published'
    )
  );

create policy "public update own response by edit_token"
  on public.application_form_responses for update
  using (edit_token is not null)
  with check (edit_token is not null);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'form-uploads',
  'form-uploads',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

create policy "public upload form files"
  on storage.objects for insert
  with check (bucket_id = 'form-uploads');

create policy "public read form files"
  on storage.objects for select
  using (bucket_id = 'form-uploads');

create policy "admins delete form files"
  on storage.objects for delete
  using (bucket_id = 'form-uploads' and public.is_admin());
