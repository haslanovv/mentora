
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const WHATSAPP_USERNAME = "muallimtap";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    subject: "",
    format: "",
    language: "",
    region: "",
    price: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("muellimtap-theme");

    const dark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;

    setIsDark(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme);
    localStorage.setItem(
      "muellimtap-theme",
      nextTheme ? "dark" : "light"
    );
  };

  const updateForm = (name: string, value: string) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openListingModal = () => {
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

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

    const url = `https://wa.me/${WHATSAPP_USERNAME}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--page)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* LOGO */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="MüəllimTap ana səhifə"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--ink)] text-sm font-black text-[var(--page)] transition-transform duration-300 group-hover:-rotate-6">
              M
            </span>

            <span className="text-lg font-bold tracking-[-0.04em] text-[var(--ink)]">
              Müəllim
              <span className="text-[var(--accent)]">Tap</span>
            </span>
          </Link>

          {/* DESKTOP MENYU */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--ink-muted)] md:flex">
            <a
              href="#elanlar"
              className="transition-colors hover:text-[var(--ink)]"
            >
              Müəllimlər
            </a>

            <a
              href="#nece-isleyir"
              className="transition-colors hover:text-[var(--ink)]"
            >
              Necə işləyir
            </a>
          </nav>

          {/* SAĞ TƏRƏF */}
          <div className="flex items-center gap-2">

            {/* ELAN YERLƏŞDİR */}
            <button
              onClick={openListingModal}
              className="hidden rounded-full bg-[var(--ink)] px-4 py-2.5 text-xs font-semibold text-[var(--page)] transition-all hover:-translate-y-0.5 hover:shadow-lg sm:px-5 md:block"
            >
              Elan yerləşdir
            </button>

            {/* DARK MODE */}
            <button
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-muted)]"
              aria-label="Rəng rejimini dəyiş"
            >
              {isDark ? "☀" : "◐"}
            </button>

            {/* HAMBURGER */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-muted)]"
              aria-label="Menyunu aç"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* SAĞDAN SLIDE MENYU */}
      {isMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[90]">

            {/* ARXA FON */}
            <button
              aria-label="Menyunu bağla"
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
            />

            {/* SLIDE PANEL */}
            <aside
              className="absolute right-0 top-0 h-full w-full max-w-[390px] overflow-y-auto border-l border-[var(--line)] bg-[var(--surface-solid)] text-[var(--ink)] shadow-2xl animate-in slide-in-from-right duration-300"
            >
              <div className="flex min-h-full flex-col p-6">

                {/* PANEL HEADER */}
                <div className="mb-10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                      MüəllimTap
                    </p>

                    <h2 className="mt-1 text-xl font-bold tracking-[-0.04em]">
                      Menyu
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface-muted)] text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
                    aria-label="Menyunu bağla"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 6l12 12M18 6L6 18"
                      />
                    </svg>
                  </button>
                </div>

                {/* NAVİQASİYA */}
                <div className="space-y-2">

                  <a
                    href="#elanlar"
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center justify-between rounded-2xl border border-transparent px-4 py-4 transition hover:border-[var(--line)] hover:bg-[var(--surface-muted)]"
                  >
                    <div>
                      <p className="font-semibold">Müəllimlər</p>
                      <p className="mt-1 text-xs text-[var(--ink-muted)]">
                        Bütün müəllim elanlarına baxın
                      </p>
                    </div>

                    <span className="text-xl text-[var(--ink-muted)] transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>

                  <a
                    href="#nece-isleyir"
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center justify-between rounded-2xl border border-transparent px-4 py-4 transition hover:border-[var(--line)] hover:bg-[var(--surface-muted)]"
                  >
                    <div>
                      <p className="font-semibold">Necə işləyir</p>
                      <p className="mt-1 text-xs text-[var(--ink-muted)]">
                        MüəllimTap haqqında məlumat
                      </p>
                    </div>

                    <span className="text-xl text-[var(--ink-muted)] transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>

                </div>

                {/* GÖRÜNÜŞ */}
                <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
                  <div className="flex items-center justify-between gap-4">

                    <div>
                      <p className="font-semibold">Görünüş</p>
                      <p className="mt-1 text-xs text-[var(--ink-muted)]">
                        Ağ və qaranlıq rejim
                      </p>
                    </div>

                    <button
                      onClick={toggleTheme}
                      className="rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5"
                    >
                      {isDark ? "☀ Ağ rejim" : "◐ Qaranlıq"}
                    </button>

                  </div>
                </div>

                {/* ELAN YERLƏŞDİR */}
                <div className="mt-4">
                  <button
                    onClick={openListingModal}
                    className="w-full rounded-2xl bg-[var(--ink)] px-5 py-4 text-sm font-bold text-[var(--page)] transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Elan yerləşdir
                  </button>
                </div>

                {/* ALT MƏLUMAT */}
                <div className="mt-auto pt-10">
                  <div className="border-t border-[var(--line)] pt-6">
                    <p className="text-xs leading-5 text-[var(--ink-muted)]">
                      MüəllimTap — sizə uyğun müəllimi daha rahat tapmağın
                      sadə yolu.
                    </p>
                  </div>
                </div>

              </div>
            </aside>
          </div>,
          document.body
        )}

      {/* ELAN YERLƏŞDİRMƏ MODALI */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative my-auto w-full max-w-md rounded-[28px] border border-[var(--line)] bg-[var(--surface-solid)] p-7 text-[var(--ink)] shadow-2xl animate-in fade-in zoom-in duration-200"
              onClick={(event) => event.stopPropagation()}
            >

              {/* BAĞLA */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-muted)] text-lg text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
                aria-label="Bağla"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
                Müəllimlər üçün
              </p>

              <h2 className="mb-2 text-2xl font-bold tracking-[-0.04em]">
                Elan yerləşdirin
              </h2>

              <p className="mb-6 text-sm leading-6 text-[var(--ink-muted)]">
                Məlumatları doldurun. Hazır müraciət WhatsApp-da
                avtomatik hazırlanacaq.
              </p>

              <form onSubmit={handleWhatsApp} className="space-y-3">

                <input
                  required
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  type="text"
                  placeholder="Ad və soyad"
                  className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                />

                <input
                  required
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  type="text"
                  placeholder="Əlaqə nömrəsi"
                  className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                />

                <input
                  required
                  value={form.subject}
                  onChange={(e) => updateForm("subject", e.target.value)}
                  type="text"
                  placeholder="Tədris etdiyiniz fənn"
                  className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                />

                <div className="grid grid-cols-2 gap-3">

                  <select
                    value={form.format}
                    onChange={(e) =>
                      updateForm("format", e.target.value)
                    }
                    className="rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-3 text-sm outline-none"
                  >
                    <option value="">Format</option>
                    <option>Onlayn</option>
                    <option>Əyani</option>
                    <option>Hər ikisi</option>
                  </select>

                  <select
                    value={form.language}
                    onChange={(e) =>
                      updateForm("language", e.target.value)
                    }
                    className="rounded-xl border border-[var(--line)] bg-[var(--surface-solid)] px-4 py-3 text-sm outline-none"
                  >
                    <option value="">Tədris dili</option>
                    <option>Azərbaycan</option>
                    <option>English</option>
                    <option>Русский</option>
                  </select>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <input
                    value={form.region}
                    onChange={(e) =>
                      updateForm("region", e.target.value)
                    }
                    type="text"
                    placeholder="Region / şəhər"
                    className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                  />

                  <input
                    value={form.price}
                    onChange={(e) =>
                      updateForm("price", e.target.value)
                    }
                    type="text"
                    placeholder="Qiymət (AZN)"
                    className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
                  />

                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white transition hover:bg-[#20bd5a]"
                >
                  WhatsApp-a göndər
                </button>

              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}