"use client";

import { createClient } from "@/utils/supabase/client";

import { useState } from "react";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function PendingPage() {
    const supabase = createClient();
    const [checking, setChecking] = useState(false);

    const checkStatus = async () => {
        setChecking(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('users').select('status').eq('id', user.id).single();
            if (data && data.status !== 'pending') {
                window.location.href = "/dashboard";
                return;
            }
        }
        setChecking(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background" style={FONT_SANS}>
            <div className="max-w-md w-full border border-foreground p-12 text-center space-y-10">
                <div className="w-16 h-16 bg-foreground flex items-center justify-center mx-auto">
                    <div className="w-8 h-[2px] bg-[var(--gold)]" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-light text-foreground uppercase tracking-widest" style={FONT_DISPLAY}>Account <em>Review.</em></h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose" style={FONT_MONO}>
                        Your account is currently under review. Full dashboard access will be granted upon verification.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={checkStatus}
                        disabled={checking}
                        className="w-full py-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/80 transition-all disabled:opacity-50"
                        style={FONT_MONO}
                    >
                        {checking ? "Checking..." : "Check Status"}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full py-5 border border-[var(--border-light)] text-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-muted transition-all"
                        style={FONT_MONO}
                    >
                        Log Out
                    </button>
                </div>

                <div className="pt-6 border-t border-[var(--border-light)]">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground" style={FONT_MONO}>
                        Typical review time: 2—6 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}
