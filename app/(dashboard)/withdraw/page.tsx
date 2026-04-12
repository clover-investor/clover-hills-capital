"use client";

import { useState } from "react";
import { useAlert } from "@/components/ui/AlertProvider";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function WithdrawPage() {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("btc");
    const [address, setAddress] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const { showSuccess, showError } = useAlert();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0 || !address) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "withdrawal", amount: Number(amount), method, address })
            });
            if (res.ok) {
                setSuccess(true);
                setAmount("");
                setAddress("");
                showSuccess("Withdrawal request submitted. We will process it within 2–24 hours.", "Submitted");
            }
        } catch {
            showError("Something went wrong. Please try again.", "Error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12" style={FONT_SANS}>
            <div className="w-full mb-8 flex justify-center">
                <img src="/logoImages/clover banner transp.png" alt="Clover Banner" className="max-h-32 object-contain" />
            </div>
            <div className="border-b border-[var(--border-light)] pb-8">
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                    Cash Out
                </p>
                <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                    Withdraw <em>Funds.</em>
                </h1>
            </div>

            <div className="border border-[var(--border-light)] bg-background p-10">
                {success ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-16 h-16 bg-[var(--gold)]" />
                        <h2 className="text-2xl font-light text-foreground uppercase tracking-widest" style={FONT_DISPLAY}>Withdrawal Submitted</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose max-w-sm" style={FONT_MONO}>
                            Your request is being reviewed. You will receive your funds within 2–24 hours.
                        </p>
                        <button onClick={() => setSuccess(false)} className="px-10 py-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/80 transition-all" style={FONT_MONO}>
                            New Withdrawal
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-6">
                            <h3 className="text-[10px] uppercase tracking-[0.4em] text-foreground font-bold" style={FONT_MONO}>01 — Choose Currency</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">
                                {['btc', 'eth', 'usdt'].map(coin => (
                                    <button
                                        type="button"
                                        key={coin}
                                        onClick={() => setMethod(coin)}
                                        className={`py-5 text-[9px] uppercase tracking-[0.3em] font-bold transition-all ${method === coin ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                        style={FONT_MONO}
                                    >
                                        {coin === 'usdt' ? 'USDT.TRC20' : coin.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8 pt-6">
                            <h3 className="text-[10px] uppercase tracking-[0.4em] text-foreground font-bold" style={FONT_MONO}>02 — Enter Details</h3>
                            <div className="grid gap-8">
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Your {method.toUpperCase()} Wallet Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder={`Enter your ${method.toUpperCase()} wallet address`}
                                        className="w-full px-6 py-5 bg-background border border-[var(--border-light)] text-xs font-mono focus:outline-none focus:border-foreground"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Amount (USD)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                                        <input
                                            type="number"
                                            required
                                            min="20"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-12 pr-6 py-5 bg-background border border-[var(--border-light)] text-2xl font-light focus:outline-none focus:border-foreground"
                                            style={FONT_DISPLAY}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border border-[var(--border-light)] bg-muted flex items-start gap-6">
                            <div className="w-10 h-10 border border-foreground flex items-center justify-center shrink-0">
                                <span className="text-xl font-bold" style={FONT_MONO}>!</span>
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.2em] leading-relaxed text-muted-foreground" style={FONT_MONO}>
                                Always double-check your wallet address before submitting. Sending funds to a wrong address cannot be reversed. Minimum withdrawal: $20.00.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-6 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-foreground/80 transition-all disabled:opacity-50"
                            style={FONT_MONO}
                        >
                            {submitting ? "Submitting…" : "Submit Withdrawal"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
