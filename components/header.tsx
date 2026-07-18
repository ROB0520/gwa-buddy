"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, GraduationCap, Menu, X } from "lucide-react";
import Logo from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Home", icon: House },
    { href: "/class-standing", label: "Class Standing", icon: GraduationCap },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full shadow-sm bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
                >
                    <Logo className="size-7 text-foreground" />
                    <span className="font-bold hidden sm:inline">GWA Buddy</span>
                </Link>

                <nav className="hidden md:flex items-center gap-1 ml-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden ml-auto"
                        >
                            <Menu className="size-5" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" showCloseButton={false} className="w-72 p-0">
                        <SheetHeader className="border-b px-4 py-3 flex-row items-center justify-between">
                            <SheetTitle asChild>
                                <Link href="/" className="flex items-center gap-2">
                                    <Logo className="size-6 text-foreground" />
                                    <span className="font-bold">GWA Buddy</span>
                                </Link>
                            </SheetTitle>
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon-sm">
                                    <X className="size-5" />
                                    <span className="sr-only">Close menu</span>
                                </Button>
                            </SheetClose>
                        </SheetHeader>
                        <nav className="flex-1 flex flex-col gap-1 p-4">
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-3 mb-2">
                                Navigation
                            </span>
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <SheetClose asChild key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-accent text-accent-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                            )}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            {link.label}
                                        </Link>
                                    </SheetClose>
                                );
                            })}
                        </nav>
                        <div className="border-t p-4">
                            <ThemeSwitcher />
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="hidden md:block ml-auto">
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
}
