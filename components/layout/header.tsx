"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import logo from "@/public/logo.png";
import {useLanguageStore} from "@/store/languageStore";
import i18n from "@/lib/i18n";
import { useEffect } from "react";

export function Header() {
  const { language, setLanguage } = useLanguageStore((state) => state);
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const handleLanguageChange = () => {
    const newLanguage = i18n.language === "en" ? "se" : "en";
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Change language
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center bg-primaryDark/10 px-4 justify-between">
        <h1 className="text-xl text-primaryDark font-bold">
          <Image src={logo} alt="logo" width={180} />
        </h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLanguageChange}>
                Switch to {language === "en" ? "Swedish" : "English"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
