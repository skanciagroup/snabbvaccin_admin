import { Inter } from "next/font/google";
import "@/app/globals.css"; // Import the i18n configuration

const inter = Inter({ subsets: ["latin"] });

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${inter.className} bg-primary/30`}>{children}</div>;
}
