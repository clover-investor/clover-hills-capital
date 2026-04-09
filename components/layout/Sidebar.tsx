"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

const navItems = [
    { name: "Overview", href: "/dashboard" },
    { name: "Live Markets", href: "/markets" },
    { name: "Deposit Funds", href: "/fund" },
    { name: "Investment Plans", href: "/plans" },
    { name: "Transactions", href: "/transactions" },
    { name: "Withdraw Funds", href: "/withdraw" },
    { name: "Refer & Earn", href: "/refer" },
    { name: "Profile", href: "/profile" },
    { name: "KYC Verification", href: "/kyc" },
];

interface SidebarProps {
    onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="w-72 md:w-80 bg-background border-r border-border h-screen flex flex-col pt-10 sticky top-0 z-20">
            <div className="px-8 md:px-10 pb-12">
                <Logo />
            </div>

            <nav className="flex-1 overflow-y-auto px-6 md:px-8 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onNavigate}
                            className={`group flex items-center justify-between py-4 px-0 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 border-b border-transparent hover:border-foreground/10 ${isActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                            style={FONT_SANS}
                        >
                            <span className="relative">
                                {item.name}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--gold)]" />
                                )}
                            </span>
                            {isActive ? (
                                <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full shadow-[0_0_8px_rgba(var(--gold-rgb),0.5)]" />
                            ) : (
                                <div className="w-1 h-1 bg-muted-foreground/20 rounded-full group-hover:bg-foreground/40 transition-colors" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 md:p-8 border-t border-border mt-auto bg-muted/30">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground hover:text-destructive transition-all duration-300"
                    style={FONT_SANS}
                >
                    <span>Log Out</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>

        </div>
    );
}
