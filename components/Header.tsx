"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  // Modalın açıq və ya bağlı olmasını idarə edən state
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Sol tərəf: Loqo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          Mentora-az
        </Link>

        {/* Orta hissə: Search bar (Axtarış) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <input
            type="text"
            placeholder="Fənn və ya müəllim axtar..."
            className="w-full px-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
          />
        </div>

        {/* Sağ tərəf: 3 xətt (Hamburger menyu) */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Müraciət Et Modal Pəncərəsi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            
            {/* Bağlama düyməsi (X) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">Elan Yerləşdirmək</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Saytımızda elan yerləşdirmək üçün məlumatlarınızı qeyd edin. Qısa zamanda sizinlə əlaqə saxlanılacaq[cite: 1].
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad və Soyad</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Məsələn: Əli Əliyev" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Əlaqə Nömrəsi</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="050 123 45 67" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tədris etdiyiniz fənn</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Məsələn: Riyaziyyat" />
              </div>
              
              <button 
                type="button" 
                onClick={() => alert("Funksionallıq tezliklə əlavə ediləcək!")}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2"
              >
                Müraciət Göndər
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}