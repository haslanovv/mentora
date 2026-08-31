"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ListingCard({
  listing,
  index = 0,
}: {
  listing: any;
  index?: number;
}) {
  const image =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images[0]
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.25),
      }}
      className="h-full"
    >
      <Link
        href={`/listing/${listing.id}`}
        className="group block h-full"
      >
        <div className="relative flex h-full min-h-[250px] flex-col justify-between overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface-solid)] p-5 shadow-[0_8px_30px_rgba(46,38,29,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(46,38,29,0.14)]">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[var(--accent-soft)] transition-transform duration-500 group-hover:scale-125" />

          {image && (
            <div className="relative -mx-5 -mt-5 mb-5 h-36 overflow-hidden bg-[var(--surface-muted)]">
              <img
                src={image}
                alt={`${listing.teacher_name || "Müəllim"} müəllim elanı`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          )}

          {/* Üst hissə: Fənn və VIP */}
          <div className="relative mb-7 flex items-start justify-between">
            <span className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-bold tracking-wide text-[var(--ink-muted)]">
              {listing.subject}
            </span>

            {listing.is_vip && (
              <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.12em] text-white">
                VIP
              </span>
            )}
          </div>

          {/* Müəllim Adı */}
          <h3 className="relative mb-5 text-xl font-bold tracking-[-0.04em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
            {listing.teacher_name}
          </h3>

          {/* Məkan və Format */}
          <div className="relative mb-6 space-y-3 text-sm text-[var(--ink-muted)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[var(--accent)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span className="text-xs">
                  {listing.region || "Bakı"}
                </span>
              </div>

              <span className="text-[11px] font-bold uppercase tracking-[0.1em]">
                {listing.format === "online"
                  ? "Onlayn"
                  : listing.format === "eyani"
                    ? "Əyani"
                    : "Hər ikisi (Onlayn + Əyani)"}
              </span>
            </div>
          </div>

          {/* Alt Hissə: Qiymət və Baxış */}
          <div className="relative mt-auto flex items-end justify-between border-t border-[var(--line)] pt-4">
            <div>
              <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                Qiymət
              </span>

              <span className="text-sm font-bold text-[var(--ink)]">
                {listing.price ? `${listing.price} AZN` : "Razılaşma"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>

              <span>{listing.views_count || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}