"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const subjects = ["Riyaziyyat", "Azərbaycan dili", "İngilis dili", "Rus dili", "Alman dili", "Fransız dili", "Ədəbiyyat", "Fizika", "Kimya", "Biologiya", "Tarix", "Coğrafiya", "İnformatika", "Məntiq", "İbtidai sinif", "Məktəbəqədər hazırlıq", "Musiqi", "Rəsm", "Şahmat", "SAT", "IELTS", "TOEFL", "DİM hazırlığı", "Qabiliyyət imtahanı", "Digər"];
const emptyForm = { teacher_name: "", subject: "", price: "", format: "online", phone_number: "", whatsapp_link: "", region: "", description: "", duration: "1", hidden_until: "" };

export default function AdminListingsManager({ onLogout }: { onLogout: () => Promise<void> }) {
  const [listings, setListings] = useState<any[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchListings = async () => {
    const { data, error } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (error) setMessage(`Elanlar yüklənmədi: ${error.message}`); else setListings(data || []);
  };
  useEffect(() => { fetchListings(); }, []);

  const visibleListings = useMemo(() => listings.filter((item) => `${item.teacher_name} ${item.subject}`.toLocaleLowerCase("az").includes(search.toLocaleLowerCase("az"))), [listings, search]);
  const wordCount = form.description.trim() ? form.description.trim().split(/\s+/).length : 0;

  const changeForm = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const changeImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (selected.length > 3) { setMessage("Bir elan üçün maksimum 3 şəkil seçilə bilər."); return; }
    if (selected.some((file) => !file.type.startsWith("image/"))) { setMessage("Yalnız şəkil faylları seçin."); return; }
    setImages(selected); setMessage("");
  };

  const addMonths = (date: Date, months: number) => { const result = new Date(date); result.setMonth(result.getMonth() + months); return result.toISOString(); };
  const openEditor = (item?: any) => {
    setMessage(""); setImages([]); setEditingListing(item || null);
    setForm(item ? { teacher_name: item.teacher_name || "", subject: item.subject || "", price: item.price?.toString() || "", format: item.format || "online", phone_number: item.phone_number || "", whatsapp_link: item.whatsapp_link || "", region: item.region || "", description: item.description || "", duration: "1", hidden_until: item.hidden_until ? new Date(item.hidden_until).toISOString().slice(0, 16) : "" } : emptyForm);
    setIsOpen(true);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingListing && images.length < 1) { setMessage("Ən azı 1 şəkil əlavə edin."); return; }
    if (wordCount > 300) { setMessage("Təsvir 300 sözdən uzun ola bilməz."); return; }
    setSaving(true); setMessage("");
    try {
      const listingId = editingListing?.id || crypto.randomUUID();
      const uploadedImages = await Promise.all(images.map(async (file, index) => {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${listingId}/${Date.now()}-${index}-${safeName}`;
        const { error } = await supabase.storage.from("listing-images").upload(path, file, { cacheControl: "31536000", upsert: false });
        if (error) throw error;
        return supabase.storage.from("listing-images").getPublicUrl(path).data.publicUrl;
      }));
      const imageUrls = uploadedImages.length ? uploadedImages : (editingListing?.images || []);
      const values = { teacher_name: form.teacher_name, subject: form.subject, price: form.price ? Number(form.price) : null, format: form.format, phone_number: form.phone_number, whatsapp_link: form.whatsapp_link || `https://wa.me/${form.phone_number.replace(/\D/g, "")}`, region: form.region || null, description: form.description.trim() || null, images: imageUrls, is_active: true, expires_at: addMonths(new Date(), Number(form.duration)), hidden_until: form.hidden_until ? new Date(form.hidden_until).toISOString() : null };
      const { error } = editingListing ? await supabase.from("listings").update(values).eq("id", listingId) : await supabase.from("listings").insert([{ id: listingId, ...values, is_vip: false }]);
      if (error) throw error;
      setForm(emptyForm); setImages([]); setEditingListing(null); setIsOpen(false); setMessage(editingListing ? "Elan yeniləndi və aktivləşdirildi." : "Elan uğurla əlavə olundu."); fetchListings();
    } catch (error: any) { setMessage(`Xəta: ${error.message}`); }
    finally { setSaving(false); }
  };

  const toggleVip = async (item: any) => { const { error } = await supabase.from("listings").update({ is_vip: !item.is_vip }).eq("id", item.id); if (error) setMessage(`Xəta: ${error.message}`); else fetchListings(); };
  const remove = async (id: string) => { if (!confirm("Bu elanı silmək istədiyinizə əminsiniz?")) return; const { error } = await supabase.from("listings").delete().eq("id", id); if (error) setMessage(`Xəta: ${error.message}`); else { setMessage("Elan silindi."); fetchListings(); } };

  return <div className="min-h-screen bg-[#f4f2ee] p-4 text-[#20201e] sm:p-7">
    <div className="mx-auto max-w-6xl">
      <header className="mb-7 flex flex-col gap-4 rounded-3xl bg-[#20201e] p-6 text-[#faf8f3] shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-[#e2b875]">MüəllimTap</p><h1 className="text-2xl font-bold tracking-[-0.04em]">Elan idarəetməsi</h1></div>
        <div className="flex gap-2"><button onClick={onLogout} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold">Çıxış et</button><button onClick={() => openEditor()} className="rounded-xl bg-[#e2b875] px-4 py-2.5 text-sm font-bold text-[#20201e]">+ Yeni elan</button></div>
      </header>
      {message && <p className="mb-5 rounded-xl border border-[#dccba9] bg-[#fff8e9] px-4 py-3 text-sm text-[#765522]">{message}</p>}
      <div className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
        <div className="border-b border-black/5 p-4"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Müəllim və ya fənn axtar..." className="w-full max-w-md rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#b98540]" /></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#faf9f6] text-xs uppercase tracking-wide text-[#777168]"><tr><th className="p-4">Müəllim</th><th className="p-4">Fənn</th><th className="p-4">Bitmə tarixi</th><th className="p-4">Status</th><th className="p-4 text-right">Əməliyyatlar</th></tr></thead><tbody>{visibleListings.map((item) => <tr key={item.id} className="border-t border-black/5"><td className="p-4 font-semibold">{item.teacher_name}</td><td className="p-4 text-[#6d6962]">{item.subject}</td><td className="p-4 text-[#6d6962]">{item.expires_at ? new Date(item.expires_at).toLocaleDateString("az-AZ") : "Müddətsiz"}</td><td className="p-4">{!item.is_active ? <span className="rounded-full bg-[#f2f0eb] px-2 py-1 text-xs font-bold text-[#777168]">Müddəti bitib</span> : item.hidden_until && new Date(item.hidden_until) > new Date() ? <span className="rounded-full bg-[#edf2ff] px-2 py-1 text-xs font-bold text-[#40568a]">{new Date(item.hidden_until).toLocaleDateString("az-AZ")}-dək deaktiv</span> : <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">Aktiv{item.is_vip ? " · VIP" : ""}</span>}</td><td className="p-4 text-right"><button onClick={() => openEditor(item)} className="mr-2 rounded-lg bg-[#edf2ff] px-3 py-1.5 text-xs font-bold text-[#40568a]">{item.is_active ? "Redaktə et / deaktiv et" : "Aktivləşdir / redaktə et"}</button><button onClick={() => toggleVip(item)} className="mr-2 rounded-lg bg-[#fff4dc] px-3 py-1.5 text-xs font-bold text-[#986822]">{item.is_vip ? "VIP-dən çıxar" : "VIP et"}</button><button onClick={() => remove(item.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">Sil</button></td></tr>)}{visibleListings.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-[#777168]">Elan tapılmadı.</td></tr>}</tbody></table></div>
      </div>
    </div>
    {isOpen && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 p-4 backdrop-blur-sm"><div className="mx-auto my-6 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"><div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b98540]">{editingListing ? "Elanı yenilə" : "Yeni elan"}</p><h2 className="mt-1 text-2xl font-bold">Müəllim məlumatları</h2></div><button onClick={() => setIsOpen(false)} className="rounded-full bg-[#f2f0eb] px-3 py-1 text-xl">×</button></div><form onSubmit={submit} className="grid gap-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Ad və soyad *"><input required name="teacher_name" value={form.teacher_name} onChange={changeForm} className="input" /></Field><Field label="Fənn *"><select required name="subject" value={form.subject} onChange={changeForm} className="input"><option value="">Fənni seçin</option>{subjects.map((subject) => <option key={subject}>{subject}</option>)}</select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Əlaqə nömrəsi *"><input required name="phone_number" value={form.phone_number} onChange={changeForm} className="input" placeholder="050 123 45 67" /></Field><Field label="Dərs formatı *"><select name="format" value={form.format} onChange={changeForm} className="input"><option value="online">Onlayn</option><option value="eyani">Əyani</option><option value="her_ikisi">Hər ikisi</option></select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Qiymət (istəyə bağlı)"><input type="number" min="0" name="price" value={form.price} onChange={changeForm} className="input" /></Field><Field label="Bölgə / ünvan (istəyə bağlı)"><input name="region" value={form.region} onChange={changeForm} className="input" /></Field></div><Field label="WhatsApp linki (istəyə bağlı)"><input type="url" name="whatsapp_link" value={form.whatsapp_link} onChange={changeForm} className="input" placeholder="Boş buraxdıqda nömrədən yaradılacaq" /></Field><Field label={`Təsvir (istəyə bağlı) - ${wordCount}/300 söz`}><textarea name="description" value={form.description} onChange={changeForm} rows={5} className="input resize-y" placeholder="Müəllimin təcrübəsi, dərsin proqramı və s." /></Field><Field label="Yeni aktiv müddət *"><select name="duration" value={form.duration} onChange={changeForm} className="input"><option value="1">1 ay</option><option value="2">2 ay</option><option value="3">3 ay</option><option value="6">6 ay</option><option value="12">1 il</option></select></Field><Field label="Müvəqqəti deaktiv tarixi (istəyə bağlı)"><input type="datetime-local" name="hidden_until" value={form.hidden_until} onChange={changeForm} className="input" /><p className="mt-1 text-xs font-normal text-[#777168]">Tarixə qədər elan ziyarətçilərə görünməyəcək, sonra avtomatik aktiv olacaq.</p></Field><Field label={editingListing ? "Şəkilləri dəyiş (istəyə bağlı, maksimum 3)" : "Elanın şəkilləri * (ən azı 1, maksimum 3)"}><input required={!editingListing} type="file" accept="image/*" multiple onChange={changeImages} className="block w-full text-sm" /><p className="mt-2 text-xs text-[#777168]">{images.length ? images.map((file) => file.name).join(", ") : editingListing ? "Mövcud şəkillər saxlanılacaq" : "Şəkil seçilməyib"}</p></Field><div className="mt-2 flex justify-end gap-3"><button type="button" onClick={() => setIsOpen(false)} className="rounded-xl bg-[#f2f0eb] px-5 py-3 text-sm font-bold">Ləğv et</button><button disabled={saving} className="rounded-xl bg-[#20201e] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Yüklənir..." : editingListing ? "Yenilə və aktivləşdir" : "Elanı əlavə et"}</button></div></form></div></div>}
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm font-semibold text-[#49453f]"><span className="mb-1.5 block">{label}</span>{children}</label>; }
