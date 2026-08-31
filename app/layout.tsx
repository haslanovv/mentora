import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/TeacherHeader";

export const metadata: Metadata = {
  title: "MüəllimTap - Tələbə Müəllim Saytı",
  description: "Özünə uyğun müəllimi tap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body className="min-h-screen font-sans antialiased">
        {/* Yaratdığımız yuxarı menyu burada görünəcək */}
        <Header />
        
        {/* Saytın digər səhifələri bu hissədə dəyişəcək */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
