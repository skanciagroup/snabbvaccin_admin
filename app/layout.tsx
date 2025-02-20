"use client";
import { MainLayout } from "@/components/layout/main-layout";
import { Inter } from "next/font/google";
import "./globals.css"; // Import the i18n configuration
import { usePathname } from "next/navigation";
import useLanguageChange from "@/hooks/useLanguageChange";
import { useLanguageStore } from "@/store/languageStore";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { language } = useLanguageStore();

  useLanguageChange(); // Call the custom hook to handle language change

  return (
    <html lang={language}>
      <body className={`${inter.className} bg-[#f3f0f0]`}>
        {isLoginPage ? children : <MainLayout>{children}</MainLayout>}
      </body>
    </html>
  );
}
