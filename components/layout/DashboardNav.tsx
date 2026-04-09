"use client";

import { Menu, Bell } from "lucide-react";
import CryptoTicker from "../CryptoTicker";

export default function DashboardNav({ user }: { user: any }) {
    return (
        <header className="bg-background border-b border-border sticky top-0 z-30">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center md:hidden">
                    <button className="text-muted-foreground hover:text-foreground p-2">
                        <Menu size={24} />
                    </button>
                </div>

                <div className="hidden md:block flex-1 max-w-xl mx-4 overflow-hidden">
                    <div className="scale-90 origin-left">
                        <CryptoTicker compact={true} />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-muted-foreground hover:text-foreground relative">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
                    </button>

                    <div className="flex items-center gap-3 border-l border-border pl-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-foreground">{user?.full_name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user?.status}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {user?.full_name?.charAt(0)}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
