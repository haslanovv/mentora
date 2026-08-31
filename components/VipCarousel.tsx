"use client";

import { useEffect, useRef, useState } from "react";
import ListingCard from "@/components/ListingCard";

export default function VipCarousel({ listings }: { listings: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (listings.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % listings.length), 4200);
    return () => window.clearInterval(timer);
  }, [listings.length]);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: active * 296, behavior: "smooth" });
  }, [active]);

  return <div>
    <div ref={trackRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none]">
      {listings.map((item, index) => <div key={item.id} className="w-[280px] min-w-[280px] snap-start"><ListingCard listing={item} index={index} /></div>)}
    </div>
    {listings.length > 1 && <div className="mt-1 flex justify-center gap-1.5">
      {listings.map((item, index) => <button key={item.id} onClick={() => setActive(index)} aria-label={`${index + 1}. VIP elana keç`} className={`h-1.5 rounded-full transition-all ${index === active ? "w-5 bg-[var(--accent)]" : "w-1.5 bg-[var(--line)]"}`} />)}
    </div>}
  </div>;
}
