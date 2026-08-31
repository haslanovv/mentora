"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import ListingCard from "@/components/ListingCard";

export default function ListingDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`).or(`hidden_until.is.null,hidden_until.lte.${new Date().toISOString()}`).single();
      if (error || !data) { router.replace("/"); return; }
      setListing(data);
      const { data: related } = await supabase.from("listings").select("*").eq("subject", data.subject).neq("id", data.id).eq("is_active", true).or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`).or(`hidden_until.is.null,hidden_until.lte.${new Date().toISOString()}`).order("is_vip", { ascending: false }).order("created_at", { ascending: false }).limit(4);
      setSuggestions(related || []);
      setLoading(false);
    }
    if (id) fetchDetail();
  }, [id, router]);

  if (loading) return <div className="page-shell grid min-h-screen place-items-center text-sm text-[var(--ink-muted)]">Elan yüklənir...</div>;
  const format = listing.format === "online" ? "Onlayn" : listing.format === "eyani" ? "Əyani" : "Hər ikisi (Onlayn + Əyani)";
  const whatsapp = listing.whatsapp_link || `https://wa.me/${listing.phone_number?.replace(/\D/g, "")}`;

  return <div className="page-shell min-h-screen px-4 py-10 sm:px-6">
    <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto max-w-5xl">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-sm text-[var(--ink-muted)] transition hover:text-[var(--ink)]">← Geri qayıt</button>
      <section className="glass-panel overflow-hidden rounded-[32px]">
        {listing.images?.[0] && <div className="relative bg-[var(--surface-muted)]"><img src={listing.images[0]} alt={`${listing.teacher_name} müəllim elanı`} className="h-[min(66vh,680px)] min-h-[360px] w-full object-contain" /><div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" /></div>}
        <div className="grid gap-8 p-7 sm:p-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-8 flex items-center justify-between"><span className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-bold text-[var(--accent)]">{listing.subject}</span>{listing.is_vip && <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-bold tracking-[0.12em] text-white">VIP</span>}</div>
            <h1 className="text-4xl font-bold tracking-[-0.055em] text-[var(--ink)]">{listing.teacher_name}</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-[var(--ink-muted)]">{listing.description || "Dərs planı və uyğun vaxtları öyrənmək üçün müəllimlə birbaşa əlaqə saxlayın."}</p>
          </div>
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface-solid)] p-6">
            <dl className="space-y-5 text-sm"><div><dt className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-[var(--ink-muted)]">Məkan</dt><dd className="font-semibold text-[var(--ink)]">{listing.region || "Bakı"}</dd></div><div><dt className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-[var(--ink-muted)]">Dərs formatı</dt><dd className="font-semibold text-[var(--ink)]">{format}</dd></div><div><dt className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-[var(--ink-muted)]">Aylıq qiymət</dt><dd className="font-semibold text-[var(--ink)]">{listing.price ? `${listing.price} AZN` : "Razılaşma ilə"}</dd></div></dl>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-8 block rounded-xl bg-[var(--ink)] px-4 py-3.5 text-center text-sm font-bold text-[var(--page)] transition hover:-translate-y-0.5">WhatsApp ilə yaz</a>
          </div>
        </div>
      </section>
      {suggestions.length > 0 && <section className="mt-14"><h2 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)]">Oxşar müəllimlər</h2><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{suggestions.map((item, index) => <ListingCard key={item.id} listing={item} index={index} />)}</div></section>}
    </motion.main>
  </div>;
}
