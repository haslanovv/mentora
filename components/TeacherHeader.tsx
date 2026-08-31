"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const WHATSAPP_USERNAME = "muallimtap";

export default function Header() {
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
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--page)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Loqo */}
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

          {/* Orta menyu */}
          <div className="hidden items-center gap-7 text-sm font-medium text-[var(--ink-muted)] md:flex">
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
          </div>

          {/* Sağ tərəf */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] text-[var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-[var(--surface-muted)]"
              aria-label="Rəng rejimini dəyiş"
            >
              {isDark ? "☀" : "◐"}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-[var(--ink)] px-4 py-2.5 text-xs font-semibold text-[var(--page)] transition-all hover:-translate-y-0.5 hover:shadow-lg sm:px-5"
            >
              Elan yerləşdir
            </button>
          </div>
        </div>
      </header>

      {/* Elan yerləşdirmə modalı */}
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
              {/* Bağlama düyməsi */}
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