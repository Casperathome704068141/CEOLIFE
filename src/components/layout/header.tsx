"use client";

import { useEffect, useState } from "react";
import {
  LifeBuoy,
  LogOut,
  Search,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CommandMenu } from "@/components/layout/command-menu";
import { NotificationsTray } from "@/components/layout/notifications-tray";
import { ProfileSwitcher } from "@/components/layout/profile-switcher";
import { useUIState } from "@/store/ui-store";

export function Header() {
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar-1");
  const { setCommandPaletteOpen } = useUIState();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur-md sm:px-6 md:px-8">
      <CommandMenu />
      <SidebarTrigger className="md:hidden" />
      <div className="relative hidden max-w-md flex-1 items-center md:flex">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder="Command ⌘K or search across finance, docs, wellness"
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 pl-10 text-sm text-slate-100 placeholder:text-slate-500"
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-3">
        <ProfileSwitcher />
        <Button
          variant="ghost"
          className="hidden h-10 gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 text-sm text-slate-200 shadow-inner shadow-cyan-500/10 transition hover:text-cyan-200 md:flex"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-4 w-4" />
          <span>Command ⌘K</span>
        </Button>
        <NotificationsTray />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full border border-slate-800 bg-slate-900/70 text-slate-100 shadow-inner shadow-cyan-500/10"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-2xl border border-slate-800 bg-slate-950/95 text-slate-100">
            <DropdownMenuItem onClick={() => setIsDark(false)}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDark(true)}>Dark</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-slate-800 bg-slate-900/80">
              <Avatar className="h-10 w-10">
                {userAvatar ? (
                  <AvatarImage
                    src={userAvatar.imageUrl}
                    alt="User Avatar"
                    data-ai-hint={userAvatar.imageHint}
                  />
                ) : null}
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 rounded-2xl border border-slate-800 bg-slate-950/95 text-slate-100" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Beno</p>
                <p className="text-xs leading-none text-muted-foreground">beno@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
