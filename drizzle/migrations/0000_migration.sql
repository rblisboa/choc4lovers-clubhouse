
-- ROLES
create type public.app_role as enum ('admin','staff');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','staff'))
$$;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- First admin bootstrap: only works while no admin exists. Public signup is disabled, so only accounts created by the project owner can call this.
create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then return false; end if;
  insert into public.user_roles(user_id, role) values (auth.uid(), 'admin');
  return true;
end $$;
create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
revoke execute on function public.claim_first_admin() from anon;
grant execute on function public.claim_first_admin() to authenticated;
grant execute on function public.admin_exists() to anon, authenticated;

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles staff read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff(auth.uid()));
create policy "profiles own insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles own update" on public.profiles for update to authenticated using (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email, full_name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- SETTINGS
create table public.app_settings (
  key text primary key,
  value text,
  is_public boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
grant select on public.app_settings to anon;
grant select, insert, update, delete on public.app_settings to authenticated;
grant all on public.app_settings to service_role;
alter table public.app_settings enable row level security;
create policy "settings public read" on public.app_settings for select to anon, authenticated using (is_public or public.is_staff(auth.uid()));
create policy "settings staff write" on public.app_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.app_settings(key, value, is_public) values
 ('brand_name','Choc4lovers',true),
 ('whatsapp_phone','',true),
 ('contact_email','',true),
 ('instagram_url','',true),
 ('facebook_url','',true),
 ('tiktok_url','',true),
 ('about_text','',true),
 ('privacy_text','',true),
 ('terms_text','',true),
 ('timezone','America/Sao_Paulo',true),
 ('admin_notification_email','',false),
 ('email_from','',false),
 ('renewal_reminder_days','7',false),
 ('notify_admin_new_lead','true',false),
 ('notify_customer_lead_received','true',false),
 ('notify_customer_renewal','true',false),
 ('notify_admin_renewal','true',false);

-- CATALOG
create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  show_in_form boolean not null default true,
  sort_order int not null default 0,
  active boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.product_categories to anon;
grant select, insert, update, delete on public.product_categories to authenticated;
grant all on public.product_categories to service_role;
alter table public.product_categories enable row level security;
create policy "cats public read" on public.product_categories for select to anon, authenticated using ((active and show_in_form) or public.is_staff(auth.uid()));
create policy "cats staff write" on public.product_categories for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
insert into public.product_categories(name, sort_order) values
 ('Chocolate ao leite',1),('Chocolate amargo',2),('Chocolate branco',3),('Bombons e trufas',4),
 ('Barras de chocolate',5),('Recheados',6),('Chocolates especiais',7),('Surpresas do mês',8);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references public.product_categories(id) on delete set null,
  description text,
  image_url text,
  brand text,
  availability text not null default 'consultar' check (availability in ('disponivel','indisponivel','consultar')),
  ingredients_notes text,
  active boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products staff" on public.products for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.plan_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  frequency text check (frequency in ('mensal','quinzenal','pontual')),
  suggested_quantity text,
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  active boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.plan_templates to anon;
grant select, insert, update, delete on public.plan_templates to authenticated;
grant all on public.plan_templates to service_role;
alter table public.plan_templates enable row level security;
create policy "plans public read" on public.plan_templates for select to anon, authenticated using (active or public.is_staff(auth.uid()));
create policy "plans staff write" on public.plan_templates for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- CUSTOMERS
create sequence public.customer_code_seq;
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('C-' || lpad(nextval('public.customer_code_seq')::text, 5, '0')),
  full_name text not null,
  email text,
  whatsapp text,
  city text,
  state text,
  cep text,
  neighborhood text,
  address text,
  source text,
  preferences text[] not null default '{}',
  notes text,
  relationship_status text not null default 'ativo' check (relationship_status in ('ativo','inativo','arquivado')),
  consent_privacy boolean not null default false,
  consent_marketing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.customers (lower(email));
create index on public.customers (whatsapp);
grant select, insert, update, delete on public.customers to authenticated;
grant all on public.customers to service_role;
alter table public.customers enable row level security;
create policy "customers staff" on public.customers for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- LEADS
create sequence public.lead_code_seq;
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('L-' || lpad(nextval('public.lead_code_seq')::text, 5, '0')),
  submission_key uuid not null unique,
  full_name text not null,
  email text not null,
  whatsapp text not null,
  city text not null,
  state text not null,
  cep text,
  neighborhood text,
  address text,
  contact_notes text,
  preferences text[] not null default '{}',
  surprise_me boolean not null default false,
  preference_notes text,
  budget numeric(10,2),
  frequency text check (frequency in ('mensal','quinzenal','pontual')),
  quantity text,
  presentation text check (presentation in ('presenteavel','consumo_proprio')),
  plan_notes text,
  consent_privacy boolean not null,
  consent_marketing boolean not null default false,
  source text not null default 'site',
  status text not null default 'novo' check (status in ('novo','contato_pendente','contato_realizado','em_negociacao','proposta_enviada','aguardando_pagamento','convertido','perdido','sem_resposta')),
  assigned_to uuid,
  next_action text,
  next_contact_at timestamptz,
  lost_reason text,
  customer_id uuid references public.customers(id) on delete set null,
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.leads (created_at desc);
create index on public.leads (status);
create index on public.leads (lower(email));
grant select, insert, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "leads staff" on public.leads for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.lead_interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  kind text not null default 'nota' check (kind in ('nota','whatsapp','email','ligacao','status','lembrete','sistema')),
  content text not null,
  created_by uuid,
  created_at timestamptz not null default now()
);
create index on public.lead_interactions (lead_id, created_at desc);
create index on public.lead_interactions (customer_id, created_at desc);
grant select, insert, update, delete on public.lead_interactions to authenticated;
grant all on public.lead_interactions to service_role;
alter table public.lead_interactions enable row level security;
create policy "interactions staff" on public.lead_interactions for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- SUBSCRIPTIONS
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  lead_id uuid references public.leads(id) on delete set null,
  plan_template_id uuid references public.plan_templates(id) on delete set null,
  plan_name text,
  preferences text[] not null default '{}',
  frequency text check (frequency in ('mensal','quinzenal','pontual')),
  quantity text,
  agreed_amount numeric(10,2),
  start_date date,
  next_cycle_date date,
  end_date date,
  status text not null default 'aguardando_confirmacao' check (status in ('aguardando_confirmacao','aguardando_pagamento','ativa','pausada','cancelada','encerrada')),
  status_reason text,
  commercial_notes text,
  delivery_terms text,
  activated_at timestamptz,
  activated_by uuid,
  external_payment_ref text, -- reserved for future payment gateway
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.subscriptions (status, next_cycle_date);
grant select, insert, update, delete on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
alter table public.subscriptions enable row level security;
create policy "subs staff" on public.subscriptions for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ORDERS
create sequence public.order_code_seq;
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default ('P-' || lpad(nextval('public.order_code_seq')::text, 5, '0')),
  customer_id uuid not null references public.customers(id) on delete restrict,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  order_date date not null default (now() at time zone 'America/Sao_Paulo')::date,
  products_amount numeric(10,2) not null default 0,
  shipping_amount numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) generated always as (products_amount + shipping_amount - discount_amount) stored,
  payment_method text,
  payment_status text not null default 'nao_informado' check (payment_status in ('nao_informado','pendente','parcial','pago','reembolsado')),
  paid_at timestamptz,
  status text not null default 'em_negociacao' check (status in ('em_negociacao','aguardando_pagamento','confirmado','em_preparacao','pronto_envio','enviado','entregue','cancelado')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.orders (status);
create index on public.orders (order_date);
grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
alter table public.orders enable row level security;
create policy "orders staff" on public.orders for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  description text not null,
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;
create policy "items staff" on public.order_items for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  amount numeric(10,2) not null check (amount <> 0),
  method text,
  paid_at timestamptz not null default now(),
  notes text,
  created_by uuid,
  external_ref text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "payments staff" on public.payments for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- DELIVERIES
create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete restrict,
  address text,
  expected_date date,
  delivered_at timestamptz,
  prepared_by text,
  delivered_by text,
  method text,
  tracking_code text,
  status text not null default 'aguardando_preparacao' check (status in ('aguardando_preparacao','em_preparacao','pronto_envio','em_transito','entregue','tentativa_sem_sucesso','reagendada','ocorrencia')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.deliveries to authenticated;
grant all on public.deliveries to service_role;
alter table public.deliveries enable row level security;
create policy "deliveries staff" on public.deliveries for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.delivery_events (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references public.deliveries(id) on delete cascade,
  kind text not null default 'status' check (kind in ('status','ocorrencia','nota')),
  status text,
  content text,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.delivery_events to authenticated;
grant all on public.delivery_events to service_role;
alter table public.delivery_events enable row level security;
create policy "devents staff" on public.delivery_events for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- RENEWALS
create table public.renewal_tasks (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  cycle_date date not null,
  kind text not null default 'renovacao' check (kind in ('renovacao','agradecimento','avaliacao','contato_comercial')),
  status text not null default 'nao_contatado' check (status in ('nao_contatado','lembrete_programado','contato_realizado','aguardando_resposta','confirmada','recusada','sem_resposta')),
  next_action text,
  last_contact_at timestamptz,
  notes text,
  auto_created boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subscription_id, cycle_date, kind)
);
grant select, insert, update, delete on public.renewal_tasks to authenticated;
grant all on public.renewal_tasks to service_role;
alter table public.renewal_tasks enable row level security;
create policy "renewals staff" on public.renewal_tasks for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- NOTIFICATIONS
create table public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  recipient text not null,
  related_table text,
  related_id uuid,
  dedupe_key text unique,
  status text not null default 'pendente' check (status in ('pendente','enviado','falhou','ignorado')),
  provider_message_id text,
  error_detail text,
  attempts int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.notification_logs (related_id);
grant select, insert, update on public.notification_logs to authenticated;
grant all on public.notification_logs to service_role;
alter table public.notification_logs enable row level security;
create policy "notif staff read" on public.notification_logs for select to authenticated using (public.is_staff(auth.uid()));

-- AUDIT
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);
create index on public.audit_logs (entity, entity_id, created_at desc);
grant select, insert on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;
alter table public.audit_logs enable row level security;
create policy "audit staff read" on public.audit_logs for select to authenticated using (public.is_staff(auth.uid()));
create policy "audit staff insert" on public.audit_logs for insert to authenticated with check (public.is_staff(auth.uid()) and actor_id = auth.uid());

-- Automatic audit for status changes
create or replace function public.audit_status_change() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'UPDATE' and new.status is distinct from old.status) then
    insert into public.audit_logs(actor_id, action, entity, entity_id, details)
    values (auth.uid(), 'status_change', tg_table_name, new.id, jsonb_build_object('from', old.status, 'to', new.status));
  elsif tg_op = 'INSERT' then
    insert into public.audit_logs(actor_id, action, entity, entity_id, details)
    values (auth.uid(), 'create', tg_table_name, new.id, jsonb_build_object('status', new.status));
  end if;
  return new;
end $$;

-- Business rule: subscription can only be 'ativa' with agreed amount and start date.
create or replace function public.validate_subscription() returns trigger language plpgsql as $$
begin
  if new.status = 'ativa' and (old is null or old.status <> 'ativa') then
    if new.agreed_amount is null or new.start_date is null or new.next_cycle_date is null then
      raise exception 'Para ativar a assinatura informe valor acordado, data de início e próxima data do ciclo.';
    end if;
    new.activated_at = now();
    new.activated_by = auth.uid();
  end if;
  return new;
end $$;
create trigger subs_validate before insert or update on public.subscriptions for each row execute function public.validate_subscription();

-- Business rule: payment status 'pago' requires paid_at
create or replace function public.validate_order() returns trigger language plpgsql as $$
begin
  if new.payment_status = 'pago' and new.paid_at is null then new.paid_at = now(); end if;
  return new;
end $$;
create trigger orders_validate before insert or update on public.orders for each row execute function public.validate_order();

do $$ declare t text; begin
  foreach t in array array['leads','customers','subscriptions','orders','deliveries','renewal_tasks','products','product_categories','plan_templates','notification_logs','profiles'] loop
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
  foreach t in array array['leads','subscriptions','orders','deliveries','renewal_tasks'] loop
    execute format('create trigger %I_audit after insert or update on public.%I for each row execute function public.audit_status_change()', t, t);
  end loop;
end $$;
