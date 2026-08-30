"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPanel() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    teacher_name: '',
    subject: '',
    price: '',
    format: 'online',
    phone_number: '',
    whatsapp_link: '',
    region: '',
  });

  // Səhifə açılan kimi istifadəçinin giriş edib-etmədiyini yoxlayırıq
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchListings();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchListings();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Supabase vasitəsilə Giriş funksiyası
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Giriş xətası: E-poçt və ya şifrə yanlışdır!');
    }
    setAuthLoading(false);
  };

  // Çıxış funksiyası
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Elanları bazadan çəkmək
  const fetchListings = async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Xəta:', error.message);
    } else {
      setListings(data || []);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Yeni elan əlavə etmək
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('listings').insert([
        {
          teacher_name: formData.teacher_name,
          subject: formData.subject,
          price: formData.price ? parseFloat(formData.price) : null,
          format: formData.format,
          phone_number: formData.phone_number,
          whatsapp_link: formData.whatsapp_link || `https://wa.me/${formData.phone_number.replace(/\s+/g, '')}`,
          region: formData.region,
          images: ['https://via.placeholder.com/300'],
          is_active: true,
          is_vip: false,
        },
      ]);

      if (error) throw error;

      alert('Elan uğurla əlavə olundu!');
      setIsAddModalOpen(false);
      setFormData({
        teacher_name: '',
        subject: '',
        price: '',
        format: 'online',
        phone_number: '',
        whatsapp_link: '',
        region: '',
      });
      fetchListings();
    } catch (error: any) {
      alert('Xəta baş verdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Elanı silmək
  const handleDelete = async (id: string) => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return;

    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) {
      alert('Silinərkən xəta oldu: ' + error.message);
    } else {
      fetchListings();
    }
  };

  // VIP statusunu dəyişmək
  const handleToggleVip = async (id: string, currentVipStatus: boolean) => {
    const { error } = await supabase
      .from('listings')
      .update({ is_vip: !currentVipStatus })
      .eq('id', id);

    if (error) {
      alert('Xəta oldu: ' + error.message);
    } else {
      fetchListings();
    }
  };

  // Əgər istifadəçi daxil olmayıbsa, Supabase Auth Login Ekranını göstər
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Admin Girişi</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">Supabase hesab məlumatlarınızı daxil edin</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">E-poçt</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Şifrə</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-gray-800 text-sm"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {authLoading ? 'Yoxlanılır...' : 'Daxil Ol'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredListings = listings.filter(item => 
    item.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-500">Supabase Auth ilə qorunan mərkəz</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleLogout}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Çıxış Et
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            + Yeni Elan Əlavə Et
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Admin paneldə elan axtar..." 
            className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Müəllim</th>
                <th className="p-4 font-medium">Fənn</th>
                <th className="p-4 font-medium">Format</th>
                <th className="p-4 font-medium">Qiymət</th>
                <th className="p-4 font-medium text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    Heç bir elan tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredListings.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800 flex items-center gap-2">
                      {item.teacher_name}
                      {item.is_vip && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          VIP
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{item.subject}</td>
                    <td className="p-4 text-gray-600">{item.format}</td>
                    <td className="p-4 text-gray-600">{item.price ? `${item.price} AZN` : '-'}</td>
                    <td className="p-4 flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleVip(item.id, item.is_vip)}
                        className={`font-medium text-sm px-3 py-1 rounded-md transition-colors ${
                          item.is_vip 
                            ? 'bg-amber-500 text-white hover:bg-amber-600' 
                            : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}
                      >
                        {item.is_vip ? 'VIP-dir' : 'VIP Et'}
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 bg-red-50 rounded-md transition-colors"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pəncərə */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Yeni Müəllim Elanı Əlavə Et</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Müəllimin Adı və Soyadı</label>
                <input 
                  type="text" 
                  name="teacher_name" 
                  value={formData.teacher_name} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Məsələn: Leyla Məmmədova" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fənn</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Məsələn: İngilis dili" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qiymət (AZN)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <select 
                    name="format" 
                    value={formData.format} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="online">Onlayn</option>
                    <option value="eyani">Əyani</option>
                    <option value="her_ikisi">Hər ikisi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Əlaqə Nömrəsi</label>
                <input 
                  type="text" 
                  name="phone_number" 
                  value={formData.phone_number} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="050 123 45 67" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Linki (İstəyə bağlı)</label>
                <input 
                  type="text" 
                  name="whatsapp_link" 
                  value={formData.whatsapp_link} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="https://wa.me/994501234567" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bölgə / Ünvan</label>
                <input 
                  type="text" 
                  name="region" 
                  value={formData.region} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Məsələn: Bakı, Elmlər Akademiyası" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  Ləğv et
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Yüklənir...' : 'Əlavə Et'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}