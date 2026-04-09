"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useAlert } from "@/components/ui/AlertProvider";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { showError } = useAlert();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) { showError(authError.message, "Authentication Failed"); setLoading(false); return; }
        if (data?.user) {
            const { data: userData, error: userError } = await supabase.from("users").select("status, role").eq("id", data.user.id).single();
            if (userError || !userData) { showError("Profile error.", "Error"); await supabase.auth.signOut(); setLoading(false); return; }
            if (userData.status === "pending") { showError("Account pending approval. You will be notified by email.", "Pending"); await supabase.auth.signOut(); setLoading(false); return; }
            if (userData.status === "rejected") { showError("Your application was declined. Contact support.", "Declined"); await supabase.auth.signOut(); setLoading(false); return; }
            router.push(userData.role === "admin" ? "/admin-874392187456" : "/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4" style={FONT_SANS}>
            <div className="w-full max-w-md">
                {/* Top gold rule */}
                <div className="h-[3px] w-full mb-12" style={{ backgroundColor: "var(--gold)" }} />

                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4" style={FONT_MONO}>
                    Clover Hills — Secure Client Portal
                </p>
                <h1 className="text-5xl font-light mb-10 text-foreground" style={FONT_DISPLAY}>
                    Client Login
                </h1>

                <div className="border border-[var(--border-light)] p-10">
                    <form className="space-y-8" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-foreground mb-3" style={FONT_MONO}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 border border-[var(--border-light)] bg-background focus:outline-none focus:border-foreground transition-colors duration-200 text-sm"
                                style={FONT_SANS}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-foreground mb-3" style={FONT_MONO}>
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 border border-[var(--border-light)] bg-background focus:outline-none focus:border-foreground transition-colors duration-200 text-sm"
                                style={FONT_SANS}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-foreground text-background text-[11px] font-semibold uppercase tracking-[0.3em] hover:bg-foreground/80 transition-colors duration-200 disabled:opacity-50 mt-2"
                            style={FONT_SANS}
                        >
                            {loading ? "Authenticating…" : "Access Portfolio"}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground" style={FONT_MONO}>
                        No account?{" "}
                        <Link href="/register" className="text-foreground hover:underline transition-all">
                            Apply for access
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
