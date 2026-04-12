"use client";

import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLinks = [
        { label: "The Firm", href: "/about" },
        { label: "Strategies", href: "/plans" },
        { label: "Markets", href: "/markets" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <nav
            className={`fixed w-full z-40 top-0 left-0 transition-colors duration-400 ${scrolled ? "bg-background border-b border-[var(--border-light)]" : "bg-background border-b border-[var(--border-light)]"
                }`}
        >
            {/* Gold top rule — transitions over 0.4s */}
            <div
                className="w-full transition-colors duration-400"
                style={{ height: "3px", backgroundColor: "var(--gold)" }}
            />

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="shrink-0 flex items-center">
                        <img
                            src="/logoImages/clover banner transp.png"
                            alt="Clover Hills"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-200"
                                style={{ fontFamily: "var(--font-syne)" }}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-0">
                        <Link
                            href="/login"
                            className="hidden sm:flex px-7 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground hover:bg-muted transition-colors duration-200 border border-[var(--border-light)] items-center"
                            style={{ fontFamily: "var(--font-syne)" }}
                        >
                            Client Login
                        </Link>
                        <Link
                            href="/register"
                            className="flex px-7 py-3 text-[10px] font-bold uppercase tracking-[0.25em] bg-foreground text-background hover:bg-foreground/80 transition-colors duration-200 items-center"
                            style={{ fontFamily: "var(--font-syne)" }}
                        >
                            Open Account
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
