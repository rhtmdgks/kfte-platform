-- Audience live polling

create type public.poll_status as enum ('draft', 'open', 'closed');

create table public.polls (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  status public.poll_status not null default 'draft',
  -- questions: [{ id, title, allowMultiple, maxSelections?, options: [{ id, label }] }]
  questions jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  voter_token text not null,
  -- answers: { [questionId]: string[] }
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  -- ponytail: device-token dedup — bypassable via private browsing, sufficient for live events
  constraint poll_votes_unique_voter unique (poll_id, voter_token)
);

create index poll_votes_poll_id_idx on public.poll_votes(poll_id);

alter table public.polls enable row level security;
alter table public.poll_votes enable row level security;

-- Admins: full access
create policy "admins manage polls"
  on public.polls for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins manage poll_votes"
  on public.poll_votes for all
  using (public.is_admin());

-- Public: read non-draft polls
create policy "public read open polls"
  on public.polls for select
  using (status <> 'draft');

-- Public: vote only when poll is open (individual rows never readable by anon)
create policy "public insert vote for open poll"
  on public.poll_votes for insert
  with check (
    exists (
      select 1 from public.polls p
      where p.id = poll_id and p.status = 'open'
    )
  );

-- Aggregate RPC — SECURITY DEFINER so anon can read counts without row-level access
create or replace function public.get_poll_results(p_poll_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total integer;
  v_questions jsonb;
  v_poll record;
  v_question jsonb;
  v_options jsonb;
  v_option jsonb;
  v_option_id text;
  v_counts jsonb;
  v_question_result jsonb;
  v_results jsonb := '[]'::jsonb;
begin
  select id, questions, status
  into v_poll
  from public.polls
  where id = p_poll_id;

  if not found then
    return null;
  end if;

  select count(distinct voter_token)::integer
  into v_total
  from public.poll_votes
  where poll_id = p_poll_id;

  v_questions := v_poll.questions;

  for i in 0 .. jsonb_array_length(v_questions) - 1 loop
    v_question := v_questions -> i;
    v_options := v_question -> 'options';
    v_counts := '{}'::jsonb;

    for j in 0 .. jsonb_array_length(v_options) - 1 loop
      v_option := v_options -> j;
      v_option_id := v_option ->> 'id';

      select count(*)::integer
      into v_counts
      from public.poll_votes pv
      where pv.poll_id = p_poll_id
        and pv.answers @> jsonb_build_object(
          v_question ->> 'id',
          jsonb_build_array(v_option_id)
        );

      -- build option count inline
      v_question_result := coalesce(v_question_result, '{}'::jsonb);
    end loop;

    -- Build per-question counts properly
    v_question_result := jsonb_build_object(
      'questionId', v_question ->> 'id',
      'optionCounts', (
        select jsonb_object_agg(opt_id, cnt)
        from (
          select
            o.value ->> 'id' as opt_id,
            (
              select count(*)::integer
              from public.poll_votes pv2
              where pv2.poll_id = p_poll_id
                and (pv2.answers -> (v_question ->> 'id')) @> jsonb_build_array(o.value ->> 'id')
            ) as cnt
          from jsonb_array_elements(v_options) as o(value)
        ) counts
      )
    );

    v_results := v_results || jsonb_build_array(v_question_result);
  end loop;

  return jsonb_build_object(
    'pollId', p_poll_id,
    'status', v_poll.status,
    'totalVoters', v_total,
    'questions', v_results
  );
end;
$$;

-- Grant execute to anon and authenticated
grant execute on function public.get_poll_results(uuid) to anon, authenticated;
