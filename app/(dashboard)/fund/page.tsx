"use client";

import { useState } from "react";
import { useAlert } from "@/components/ui/AlertProvider";
import { createClient } from "@/utils/supabase/client";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function FundWalletPage() {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("btc");
    const [copied, setCopied] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const { showSuccess, showError, showInfo } = useAlert();
    const supabase = createClient();


    const cryptoAddresses = {
        btc: "bc1qdkzn0v440q5u9g6k8padw6aazqsd6akrz0zvtz",
        eth: "0x94761fa0e354866AB792B00BB824a0b194F100cD",
        sol: "CAny4rVeuTCjwjwjBdft2AFZhofLzNHvbhi8NzMqUeoP",
        usdt: "TLSqPg3YCZDdEHuNhLADpLDBbSyhYJTuZ4",
        bnb: "0x94761fa0e354866AB792B00BB824a0b194F100cD",
    } as const;

    const currentAddress = cryptoAddresses[method as keyof typeof cryptoAddresses];

    const handleCopy = () => {
        navigator.clipboard.writeText(currentAddress);
        setCopied(true);
        showInfo("Address copied to clipboard", "Copied");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "deposit", amount: Number(amount) })
            });
            if (res.ok) {
                setSuccess(true);
                setAmount("");
                showSuccess("Deposit request submitted. Our team will verify and credit your account.", "Submitted");
            }
        } catch {
            showError("Something went wrong. Please try again.", "Error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12" style={FONT_SANS}>
            <div className="border-b border-[var(--border-light)] pb-8">
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                    Add Funds
                </p>
                <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                    Deposit <em>Funds.</em>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">
                {/* Left Col - Address */}
                <div className="bg-background p-6 sm:p-10 space-y-8 sm:space-y-10">
                    <div>
                        <h2 className="text-[10px] uppercase tracking-[0.4em] text-foreground mb-6" style={FONT_MONO}>01 — Choose Currency</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">
                            {['btc', 'eth', 'sol', 'usdt', 'bnb'].map(coin => (
                                <button
                                    key={coin}
                                    onClick={() => setMethod(coin)}
                                    className={`py-4 text-[9px] uppercase tracking-[0.3em] font-bold transition-all ${method === coin ? 'bg-foreground text-background' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                                    style={FONT_MONO}
                                >
                                    {coin === 'usdt' ? 'USDT.TRC20' : coin === 'bnb' ? 'BNB (BSC)' : coin.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 border border-[var(--border-light)] bg-muted flex flex-col items-center">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white p-3 sm:p-4 border border-[var(--border-light)] mb-8">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${currentAddress}&color=000000&bgcolor=ffffff`}
                                alt="QR"
                                className="w-full h-full grayscale"
                            />
                        </div>
                        <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4 text-center" style={FONT_MONO}>
                            Send {method.toUpperCase()} to the address below:
                        </p>
                        <div className="w-full flex flex-col sm:flex-row border border-[var(--border-light)] bg-background">
                            <span className="flex-1 px-4 py-4 text-[10px] font-mono text-foreground break-all sm:truncate text-center sm:text-left">{currentAddress}</span>
                            <button
                                onClick={handleCopy}
                                className="px-6 py-4 sm:py-0 border-t sm:border-t-0 sm:border-l border-[var(--border-light)] text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-muted transition-all"
                                style={FONT_MONO}
                            >
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Col - Form */}
                <div className="bg-background p-6 sm:p-10 flex flex-col">
                    <h2 className="text-[10px] uppercase tracking-[0.4em] text-foreground mb-6" style={FONT_MONO}>02 — Submit Deposit</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8 sm:mb-10">
                        After sending the crypto, enter the exact USD equivalent amount below. Your balance will be credited within 2–6 hours after our team confirms the payment.
                    </p>

                    {success ? (
                        <div className="flex-1 flex flex-col items-center justify-center border border-[var(--border-light)] p-8 sm:p-12 bg-muted text-center space-y-6">
                            <div className="w-12 h-12 bg-[var(--gold)]" />
                            <h3 className="text-xl font-light text-foreground uppercase tracking-widest" style={FONT_MONO}>Deposit Submitted</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose" style={FONT_MONO}>
                                Your deposit is being reviewed. We will credit your balance shortly.
                            </p>
                            <button onClick={() => setSuccess(false)} className="px-8 py-4 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all" style={FONT_MONO}>
                                Make Another Deposit
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Amount Sent (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                                    <input
                                        type="number"
                                        required
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-12 pr-6 py-5 bg-background border border-[var(--border-light)] text-xl sm:text-2xl font-light focus:outline-none focus:border-foreground"
                                        style={FONT_DISPLAY}
                                    />
                                </div>
                            </div>

                            <div className="p-6 border border-[var(--border-light)] bg-muted space-y-3">
                                <p className="text-[9px] uppercase tracking-[0.4em] text-foreground font-bold" style={FONT_MONO}>Important:</p>
                                <ul className="space-y-2 text-[9px] uppercase tracking-[0.2em] text-muted-foreground" style={FONT_MONO}>
                                    <li>— Minimum deposit: $10.00</li>
                                    <li>— Send to the correct address to avoid loss</li>
                                    <li>— Network fees are not included</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 sm:py-6 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-foreground/80 transition-all disabled:opacity-50 mt-auto"
                                style={FONT_MONO}
                            >
                                {submitting ? "Submitting…" : "Confirm Deposit"}
                            </button>
                        </form>
                    )}
                </div>
            </div>

        </div>
    );
}
