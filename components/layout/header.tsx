"use client";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useLanguageStore } from "@/store/languageStore";
import i18n from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export function Header() {
  const { language, setLanguage } = useLanguageStore((state) => state);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);

  const handleLanguageChange = () => {
    const newLanguage = language === "en" ? "se" : "en";
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/auth/signout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center bg-primaryDark/10 px-4 justify-between">
        <h1 className="text-xl text-primaryDark font-bold">
          <Image src={logo} alt="logo" width={180} />
        </h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 bg-primary hover:bg-primaryDark p-2 border border-secondary">
                  <AvatarImage src="/admin.png" alt="@admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white rounded-xl border border-border shadow-lg"
            >
              <DropdownMenuLabel className="font-normal px-3 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    Admin
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm hover:bg-primary/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer px-3 py-2 text-sm hover:bg-primary/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer px-3 py-2 text-sm hover:bg-primary/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                onClick={handleLanguageChange}
              >
                {language === "en" ? "Svenska" : "English"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                className="cursor-pointer px-3 py-2 text-sm text-destructive hover:bg-primary/50 hover:text-destructive focus:bg-destructive/10 focus:text-destructive rounded-b-xl"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
