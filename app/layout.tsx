'use client'
import { MainLayout } from "@/components/layout/main-layout";
import { Inter } from "next/font/google";
import "./globals.css"; // Import the i18n configuration
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f3f0f0]`}>
        {isLoginPage ? children : <MainLayout>{children}</MainLayout>}
      </body>
    </html>
  );
}
