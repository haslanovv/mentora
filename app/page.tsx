"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ListingCard from "@/components/ListingCard";

const languageLabels: Record<string, string> = {
  az: "Azərbaycan",
  en: "English",
  ru: "Русский",
};

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Bütün fənlər");
  const [selectedFormat, setSelectedFormat] = useState("Bütün formatlar");
  const [selectedLanguage, setSelectedLanguage] = useState("Bütün dillər");

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("is_active", true)
        .order("is_vip", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) console.error("Elanlar yüklənmədi:", error.message);
      setListings(data || []);
      setLoading(false);
    }

    fetchListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (item.teacher_name || "").toLowerCase().includes(search) ||
      (item.subject || "").toLowerCase().includes(search);
    const matchesSubject = selectedSubject === "Bütün fənlər" || item.subject === selectedSubject;
    const matchesFormat = selectedFormat === "Bütün formatlar" || item.format === selectedFormat;
    const matchesLanguage = selectedLanguage === "Bütün dillər" || item.language === selectedLanguage;

    return matchesSearch && matchesSubject && matchesFormat && matchesLanguage;
  });

  const vipListings = filteredListings.filter((item) => item.is_vip);
  const normalListings = filteredListings.filter((item) => !item.is_vip);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Müəllim və ya fənn axtar..."
            className="w-full bg-white dark:bg-[#151515] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:border-[#d4af37]/50 text-sm shadow-sm transition-colors"
          />

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 outline-none text-sm shadow-sm"
          >
            <option>Bütün fənlər</option>
            <option>Riyaziyyat</option>
            <option>İngilis dili</option>
          </select>

          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 outline-none text-sm shadow-sm"
          >
            <option>Bütün formatlar</option>
            <option value="online">Onlayn</option>
            <option value="eyani">Əyani</option>
            <option value="her_ikisi">Hər ikisi</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 outline-none text-sm shadow-sm"
          >
            <option value="Bütün dillər">Bütün dillər</option>
            <option value="az">Azərbaycan</option>
            <option value="en">English</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 text-sm">Yüklənir...</p>
        ) : filteredListings.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">Elan tapılmadı.</p>
        ) : (
          <div className="space-y-12">
            {vipListings.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-4 text-[#d4af37] uppercase tracking-wider">VIP Elanlar</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {vipListings.map((item) => (
                    <div key={item.id} className="min-w-[280px] w-[280px] flex-shrink-0">
                      <ListingCard listing={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {normalListings.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider">Bütün Elanlar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {normalListings.map((item) => (
                    <ListingCard key={item.id} listing={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
