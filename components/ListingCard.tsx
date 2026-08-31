import Link from 'next/link';

export default function ListingCard({ listing }: { listing: any }) {
  const image = Array.isArray(listing.images) && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-white dark:bg-[#151515] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full relative">
        {image && (
          <div className="w-full h-44 bg-gray-100 dark:bg-black/20 overflow-hidden">
            <img src={image} alt={listing.teacher_name || 'Müəllim'} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
          </div>
        )}

        <div className="p-5 flex flex-col justify-between h-full relative">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300">
              {listing.subject}
            </span>
            {listing.is_vip && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#d4af37] text-white shadow-sm uppercase tracking-wider">
                VIP
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 group-hover:text-[#d4af37] transition-colors">
            {listing.teacher_name}
          </h3>

          <div className="space-y-3 mb-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs">{listing.region || 'Bakı'}</span>
              </div>
              <span className="text-xs font-medium uppercase tracking-wider">
                {listing.format === 'online' ? 'Onlayn' : listing.format === 'eyani' ? 'Əyani' : 'Hər ikisi'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-end justify-between mt-auto">
            <div>
              <span className="text-[11px] text-gray-400 block mb-0.5">Qiymət</span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {listing.price ? `${listing.price} AZN` : 'Razılaşma'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7z" />
              </svg>
              <span>{listing.views_count || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
