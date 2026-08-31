
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ListingCard from "@/components/ListingCard";
import VipCarousel from "@/components/VipCarousel";
import { motion } from "framer-motion";

const subjects = [
  "Riyaziyyat",
  "Azərbaycan dili",
  "İngilis dili",
  "Rus dili",
  "Alman dili",
  "Fransız dili",
  "Ədəbiyyat",
  "Fizika",
  "Kimya",
  "Biologiya",
  "Tarix",
  "Coğrafiya",
  "İnformatika",
  "Məntiq",
  "İbtidai sinif",
  "Məktəbəqədər hazırlıq",
  "Musiqi",
  "Rəsm",
  "Şahmat",
  "SAT",
  "IELTS",
  "TOEFL",
  "DİM hazırlığı",
  "Qabiliyyət imtahanı",
  "Digər",
];

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
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("is_active", true)
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .or(`hidden_until.is.null,hidden_until.lte.${now}`)
        .order("is_vip", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Elanlar yüklənmədi:", error.message);
      }

      setListings(data || []);
      setLoading(false);
    }

    fetchListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      (item.teacher_name || "").toLowerCase().includes(search) ||
      (item.subject || "").toLowerCase().includes(search);

    const matchesSubject =
      selectedSubject === "Bütün fənlər" ||
      item.subject === selectedSubject;

    const matchesFormat =
      selectedFormat === "Bütün formatlar" ||
      item.format === selectedFormat;

    const matchesLanguage =
      selectedLanguage === "Bütün dillər" ||
      item.language === selectedLanguage;

    return (
      matchesSearch &&
      matchesSubject &&
      matchesFormat &&
      matchesLanguage
    );
  });

  const vipListings = filteredListings.filter((item) => item.is_vip);
  const normalListings = filteredListings.filter((item) => !item.is_vip);

  return (
    <div className="page-shell overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
        <div className="soft-grid pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-50" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <span className="premium-ring inline-flex rounded-full bg-[var(--surface-solid)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            Doğru seçim, güclü nəticə
          </span>

          <h1 className="mt-7 text-4xl font-bold leading-[1.04] tracking-[-0.065em] text-[var(--ink)] sm:text-6xl">
            Sizə uyğun müəllimi{" "}
            <span className="text-[var(--accent)]">tapın.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[var(--ink-muted)] sm:text-lg">
            Fənn, format və qiymət seçiminizə uyğun peşəkar müəllimlərlə
            rahatlıqla əlaqə saxlayın.
          </p>
        </motion.div>

        <div id="elanlar" className="relative mx-auto mt-11 max-w-6xl">
          {/* Axtarış və Filtr */}
          <div className="glass-panel mb-12 flex flex-col gap-3 rounded-[24px] p-3 md:flex-row">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Axtarış..."
              className="w-full rounded-xl border border-transparent bg-[var(--surface-solid)] px-4 py-3.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-muted)] focus:border-[var(--accent)] md:flex-1"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl border border-transparent bg-[var(--surface-solid)] px-4 py-3.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
              >
                <option>Bütün fənlər</option>

                {subjects.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="rounded-xl border border-transparent bg-[var(--surface-solid)] px-4 py-3.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
              >
                <option>Bütün formatlar</option>
                <option value="online">Onlayn</option>
                <option value="eyani">Əyani</option>
                <option value="her_ikisi">Hər ikisi</option>
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="rounded-xl border border-transparent bg-[var(--surface-solid)] px-4 py-3.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
              >
                <option value="Bütün dillər">Bütün dillər</option>

                {Object.entries(languageLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-[var(--ink-muted)]">
              Elanlar yüklənir...
            </p>
          ) : filteredListings.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-[var(--line)] py-14 text-center text-sm text-[var(--ink-muted)]">
              Bu seçimlərə uyğun elan tapılmadı.
            </p>
          ) : (
            <div className="space-y-12">
              {vipListings.length > 0 && (
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-[var(--accent)]" />

                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                      Seçilmiş müəllimlər
                    </h2>
                  </div>

                  <VipCarousel listings={vipListings} />
                </div>
              )}

              {normalListings.length > 0 && (
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                      Bütün elanlar
                    </h2>

                    <span className="text-xs text-[var(--ink-muted)]">
                      {normalListings.length} nəticə
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {normalListings.map((item, index) => (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section
        id="nece-isleyir"
        className="border-t border-[var(--line)] bg-[var(--surface)]"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
          {[
            [
              "01",
              "Axtarın",
              "Fənn, format və qiymətə görə uyğun müəllimi seçin.",
            ],
            [
              "02",
              "Tanış olun",
              "Elan detallarını nəzərdən keçirin və seçim edin.",
            ],
            [
              "03",
              "Əlaqə saxlayın",
              "WhatsApp vasitəsilə birbaşa müəllimə yazın.",
            ],
          ].map(([number, title, text]) => (
            <div
              key={number}
              className="border-l border-[var(--line)] pl-5"
            >
              <p className="mb-4 text-xs font-bold tracking-[0.16em] text-[var(--accent)]">
                {number}
              </p>

              <h2 className="mb-2 text-lg font-bold tracking-[-0.035em] text-[var(--ink)]">
                {title}
              </h2>

              <p className="text-sm leading-6 text-[var(--ink-muted)]">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}