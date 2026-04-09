"use client";

import { useState } from "react";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function ReferPage() {
    const [copied, setCopied] = useState(false);
    const referralCode = "CH-874392";
    const referralLink = `https://cloverhills.com/register?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12" style={FONT_SANS}>
            <div className="w-full mb-8 flex justify-center">
                <img src="/logoImages/clover banner transp.png" alt="Clover Banner" className="max-h-32 object-contain" />
            </div>
            <div className="border-b border-[var(--border-light)] pb-8 text-left">
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                    Earn More
                </p>
                <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                    Refer & <em>Earn.</em>
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--border-light)] bg-[var(--border-light)] gap-px">
                {[
                    { label: "Total Referrals", val: "0" },
                    { label: "Active Referrals", val: "0" },
                    { label: "Total Earned", val: "$0.00" }
                ].map((s, i) => (
                    <div key={i} className="bg-background p-10 hover:bg-muted transition-colors duration-200">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4" style={FONT_MONO}>{s.label}</p>
                        <p className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>{s.val}</p>
                    </div>
                ))}
            </div>

            <div className="border border-[var(--border-light)] bg-background p-12 flex flex-col md:flex-row items-center gap-16">
                <div className="w-24 h-24 bg-foreground flex items-center justify-center shrink-0 border border-foreground">
                    <div className="w-12 h-12 border-2 border-background rotate-45" />
                </div>

                <div className="flex-1 space-y-6">
                    <h2 className="text-2xl font-light uppercase tracking-widest text-foreground" style={FONT_DISPLAY}>Your Referral Link</h2>
                    <p className="text-sm text-muted-foreground leading-loose max-w-2xl">
                        Share your unique link with friends and family. When someone signs up and makes their first deposit, you automatically earn 5% of their initial deposit as a bonus — credited directly to your balance.
                    </p>

                    <div className="pt-6">
                        <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Your Referral Link</p>
                        <div className="flex flex-col sm:flex-row items-stretch border border-[var(--border-light)]">
                            <div className="flex-1 bg-muted p-4 overflow-hidden flex items-center">
                                <span className="text-[11px] font-mono text-foreground truncate">{referralLink}</span>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="px-8 py-4 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/80 transition-all shrink-0"
                                style={FONT_MONO}
                            >
                                {copied ? "Copied!" : "Copy Link"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 border border-[var(--border-light)] bg-muted text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center" style={FONT_MONO}>
                Referral bonuses are credited automatically once your referred user makes a deposit.
            </div>
        </div>
    );
}
