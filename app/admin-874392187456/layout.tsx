import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: auth, error } = await supabase.auth.getUser();

    if (error || !auth?.user) {
        redirect("/login");
    }

    const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", auth.user.id)
        .single();

    if (user?.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6" style={FONT_SANS}>
                <div className="max-w-md w-full border border-[var(--border-light)] p-12 text-center space-y-8">
                    <div className="w-16 h-16 bg-foreground flex items-center justify-center mx-auto">
                        <span className="text-background text-2xl font-bold" style={FONT_MONO}>!</span>
                    </div>
                    <h1 className="text-3xl font-light text-foreground uppercase tracking-widest" style={FONT_DISPLAY}>Access Denied</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose" style={FONT_MONO}>
                        Admin access is required for this dashboard.
                    </p>
                    <Link href="/dashboard" className="block w-full py-5 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all" style={FONT_MONO}>
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const adminBase = `/admin-874392187456`;

    return (
        <div className="flex flex-col h-screen bg-background" style={FONT_SANS}>
            <header className="bg-background border-b border-[var(--border-light)] sticky top-0 z-40">
                <div className="flex h-20 items-center px-12 justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-10 h-10 bg-foreground flex items-center justify-center">
                            <div className="w-5 h-[2px] bg-[var(--gold)]" />
                        </div>
                        <h1 className="text-[11px] font-bold uppercase tracking-[0.4em] text-foreground" style={FONT_MONO}>
                            Clover Hills <span className="text-muted-foreground ml-2">/ Admin Portal</span>
                        </h1>
                    </div>
                    <Link href="/dashboard" className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all underline decoration-[var(--border-light)] underline-offset-4" style={FONT_MONO}>
                        Exit Admin Panel
                    </Link>
                </div>

                <div className="flex px-12 border-t border-[var(--border-light)] overflow-x-auto no-scrollbar">
                    {[
                        { label: "Manage Users", href: adminBase },
                        { label: "Investment Plans", href: `${adminBase}/plans` },
                        { label: "KYC Approvals", href: `${adminBase}/kyc` },
                    ].map(l => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="px-8 py-4 text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all border-r border-[var(--border-light)] last:border-r-0"
                            style={FONT_MONO}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-12">
                {children}
            </main>
        </div>
    );
}
