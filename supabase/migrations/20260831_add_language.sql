-- Müəllim elanlarının tədris dilini saxlamaq üçün
alter table public.listings
add column if not exists language text not null default 'az';

alter table public.listings
add constraint listings_language_check
check (language in ('az', 'en', 'ru'));

create index if not exists listings_language_idx on public.listings(language);
