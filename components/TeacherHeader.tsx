"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const WHATSAPP_USERNAME = "muallimtap";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", subject: "", format: "", language: "", region: "", price: "" });

  useEffect(() => {
    const saved = localStorage.getItem("muellimtap-theme");
    const isDark = saved === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("muellimtap-theme", next ? "dark" : "light");
  };

  const update = (name: string, value: string) => setForm((current) => ({ ...current, [name]: value }));

  const handleWhatsApp = (e: FormEvent) => {
    e.preventDefault();
    const message = [
      "Salam, MüəllimTap-da elan yerləşdirmək istəyirəm.",
      "",
      `Ad və soyad: ${form.name}`,
      `Əlaqə nömrəsi: ${form.phone}`,
      `Fənn: ${form.subject}`,
      `Format: ${form.format || "Qeyd edilməyib"}`,
      `Tədris dili: ${form.language || "Qeyd edilməyib"}`,
      `Region: ${form.region || "Qeyd edilməyib"}`,
      `Qiymət: ${form.price || "Qeyd edilməyib"}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_USERNAME}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <header className="bg-white dark:bg-[#111111] shadow-sm sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">MüəllimTap</Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Fənn və ya müəllim axtar..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white border-transparent rounded-full focus:bg-white dark:focus:bg-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>

          <button onClick={() => setIsOpen(true)} className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors focus:outline-none" aria-label="Menyu">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <button aria-label="Menyunu bağla" onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-[#111111] text-gray-900 dark:text-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Menyu</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl">×</button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 mb-8">
              <div>
                <p className="font-semibold">Görünüş</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ağ / qaranlıq rejim</p>
              </div>
              <button onClick={toggleTheme} className="px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-sm">
                {darkMode ? "☀️ Ağ rejim" : "🌙 Qaranlıq"}
              </button>
            </div>

            <h3 className="text-lg font-bold mb-2">Elan yerləşdir</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Məlumatları doldur, hazır mesaj WhatsApp-da avtomatik hazırlanacaq.</p>

            <form onSubmit={handleWhatsApp} className="space-y-4">
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ad və soyad" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none" />
              <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Əlaqə nömrəsi" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none" />
              <input required value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Tədris etdiyiniz fənn" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none" />

              <div className="grid grid-cols-2 gap-3">
                <select value={form.format} onChange={(e) => update("format", e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#191919] outline-none">
                  <option value="">Format</option>
                  <option>Onlayn</option>
                  <option>Əyani</option>
                  <option>Hər ikisi</option>
                </select>
                <select value={form.language} onChange={(e) => update("language", e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#191919] outline-none">
                  <option value="">Tədris dili</option>
                  <option>Azərbaycan</option>
                  <option>English</option>
                  <option>Русский</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input value={form.region} onChange={(e) => update("region", e.target.value)} placeholder="Region / şəhər" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none" />
                <input value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="Qiymət (AZN)" className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none" />
              </div>

              <button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl transition-colors">
                WhatsApp-a göndər
              </button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
