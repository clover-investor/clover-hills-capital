"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

const FONT_MONO = { fontFamily: "var(--font-mono)" };

interface DashboardShellProps {
    children: React.ReactNode;
    userName?: string;
    userId?: string;
}

export default function DashboardShell({ children, userName, userId }: DashboardShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, []);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    return (
        <div className="flex h-screen bg-muted">
            {/* Desktop Sidebar */}
            <div className="hidden md:block shrink-0">
                <Sidebar onNavigate={() => { }} />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div
                className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden bg-background border-b border-[var(--border-light)] h-16 flex items-center justify-between px-5 shrink-0 z-30 sticky top-0">
                    <span className="font-semibold text-sm uppercase tracking-widest" style={FONT_MONO}>
                        Clover Hills
                    </span>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="border border-[var(--border-light)] p-3 hover:bg-muted transition-colors"
                        aria-label="Open menu"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-foreground" fill="none" strokeWidth="1.5">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                </header>

                {/* Desktop Top Bar */}
                <header className="hidden md:flex bg-background border-b border-[var(--border-light)] h-20 items-center justify-between px-12 shrink-0 z-10 sticky top-0">
                    <div className="border border-[var(--border-light)] px-6 py-3" style={FONT_MONO}>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Client — </span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-foreground font-semibold">{userName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground" style={FONT_MONO}>
                            ID: {userId?.substring(0, 8).toUpperCase()}
                        </span>
                        <div className="w-10 h-10 bg-foreground flex items-center justify-center font-bold text-background text-sm border border-foreground" style={FONT_MONO}>
                            {userName?.charAt(0) || "A"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-8 sm:py-10 md:px-16 md:py-16">
                    {children}
                </main>
            </div>
        </div>
    );
}
