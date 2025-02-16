import { MainLayout } from '@/components/layout/main-layout';
import { Inter } from 'next/font/google';
import './globals.css';// Import the i18n configuration

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f3f0f0]`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}