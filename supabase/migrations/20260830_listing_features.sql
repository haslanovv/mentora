alter table public.listings add column if not exists description text;
alter table public.listings add column if not exists expires_at timestamptz;
alter table public.listings add column if not exists hidden_until timestamptz;
create index if not exists listings_expires_at_idx on public.listings (expires_at);

insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true)
on conflict (id) do update set public = true;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public listing image access') then
    create policy "Public listing image access" on storage.objects for select using (bucket_id = 'listing-images');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Authenticated listing image upload') then
    create policy "Authenticated listing image upload" on storage.objects for insert to authenticated with check (bucket_id = 'listing-images');
  end if;
end $$;
