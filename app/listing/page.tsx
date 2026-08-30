"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ListingCard from '@/components/ListingCard';

export default function ListingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
      if (error || !data) {
        router.push('/');
        return;
      }
      setListing(data);

      const { data: simData } = await supabase
        .from('listings')
        .select('*')
        .eq('subject', data.subject)
        .neq('id', data.id)
        .limit(4);
      setSuggestions(simData || []);
      setLoading(false);
    }
    fetchDetail();
  }, [id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-[#0a0a0a] dark:text-white">Yüklənir...</div>;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Geri qayıt düyməsi */}
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-8 flex items-center gap-2">
          ← Geri qayıt
        </button>

        {/* Detal Kartı */}
        <div className="bg-white dark:bg-[#151515] border border-gray-100 dark:border-white/5 rounded-3xl p-8 shadow-sm mb-12">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              {listing.subject}
            </span>
            {listing.is_vip && <span className="text-xs font-bold px-3 py-1 rounded-md bg-[#d4af37] text-white uppercase tracking-wider">VIP</span>}
          </div>

          <h1 className="text-3xl font-bold mb-8">{listing.teacher_name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Məkan:</strong> {listing.region || 'Bakı'}</p>
              <p><strong>Format:</strong> {listing.format === 'online' ? 'Onlayn' : listing.format === 'eyani' ? 'Əyani' : 'Hər ikisi'}</p>
              <p><strong>Qiymət:</strong> {listing.price ? `${listing.price} AZN / ay` : 'Razılaşma yolu ilə'}</p>
            </div>
            
            <div className="flex flex-col justify-end">
              <a 
                href={listing.whatsapp_link || `https://wa.me/${listing.phone_number?.replace(/\s+/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#1e1e1e] hover:bg-[#2a2a2a] dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white font-semibold py-4 rounded-xl transition-colors text-center"
              >
                WhatsApp ilə yaz
              </a>
            </div>
          </div>
        </div>

        {/* Oxşar Elanlar */}
        {suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-6 text-gray-500 uppercase tracking-wider">Oxşar Elanlar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestions.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}