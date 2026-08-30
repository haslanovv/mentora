"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ListingCard from "@/components/ListingCard";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Bütün fənlər');
  const [selectedFormat, setSelectedFormat] = useState('Bütün formatlar');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  useEffect(() => {
    async function fetchListings() {
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('is_vip', { ascending: false })
        .order('created_at', { ascending: false });
      setListings(data || []);
      setLoading(false);
    }
    fetchListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'Bütün fənlər' || item.subject === selectedSubject;
    const matchesFormat = selectedFormat === 'Bütün formatlar' || item.format === selectedFormat;
    return matchesSearch && matchesSubject && matchesFormat;
  });

  const vipListings = filteredListings.filter(item => item.is_vip);
  const normalListings = filteredListings.filter(item => !item.is_vip);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
      
      {/* Tünd Rejim Keçidi */}
      <div className="max-w-6xl mx-auto px-4 pt-6 flex justify-end">
        <button 
          onClick={toggleDarkMode}
          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
        >
          {darkMode ? 'Aydınlıq' : 'Tünd Rejim'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Axtarış və Filtr (Minimalist) */}
        <div className="mb-12 flex flex-col md:flex-row gap-3">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Axtarış..."
            className="w-full md:flex-1 bg-white dark:bg-[#151515] border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:border-[#d4af37]/50 text-sm shadow-sm transition-colors"
          />
          <div className="flex gap-3">
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
            </select>
          </div>
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