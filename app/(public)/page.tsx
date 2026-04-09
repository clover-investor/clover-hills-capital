"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function Home() {
    const [cryptos, setCryptos] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fallbackCryptos = [
        { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 64230.00, price_change_percentage_24h: 1.25, total_volume: 32000000000, market_cap_rank: 1 },
        { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 3450.00, price_change_percentage_24h: -0.80, total_volume: 15000000000, market_cap_rank: 2 },
        { id: "tether", symbol: "usdt", name: "Tether", current_price: 1.00, price_change_percentage_24h: 0.01, total_volume: 25000000000, market_cap_rank: 3 },
        { id: "binancecoin", symbol: "bnb", name: "BNB", current_price: 580.00, price_change_percentage_24h: 2.10, total_volume: 2000000000, market_cap_rank: 4 },
        { id: "solana", symbol: "sol", name: "Solana", current_price: 145.00, price_change_percentage_24h: 5.40, total_volume: 4000000000, market_cap_rank: 5 },
        { id: "ripple", symbol: "xrp", name: "XRP", current_price: 0.60, price_change_percentage_24h: -1.20, total_volume: 1200000000, market_cap_rank: 6 },
    ];

    const fallbackPlans = [
        { id: 1, name: "Alpha Strategy", min_deposit: 100, daily_roi: 1.5, duration_days: 7, features: ["Daily Yield Payout", "Standard Execution", "Capital Segregation"] },
        { id: 2, name: "Sigma Execution", min_deposit: 1000, daily_roi: 3.5, duration_days: 14, features: ["Priority Execution", "Advanced Arbitrage", "24h Support", "Daily Payout"] },
        { id: 3, name: "Omni Protocol", min_deposit: 5000, daily_roi: 8.5, duration_days: 30, features: ["Institutional Access", "Bespoke Management", "Zero Fees", "Instant Payout"] },
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                try {
                    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false");
                    if (res.ok) {
                        const data = await res.json();
                        setCryptos(data.length ? data : fallbackCryptos);
                    } else setCryptos(fallbackCryptos);
                } catch {
                    setCryptos(fallbackCryptos);
                }

                try {
                    const res = await fetch("/api/plans");
                    if (res.ok) {
                        const json = await res.json();
                        setPlans(json.plans?.length ? json.plans : fallbackPlans);
                    } else setPlans(fallbackPlans);
                } catch {
                    setPlans(fallbackPlans);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        const id = setInterval(fetchData, 60_000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="pt-[83px] bg-background text-foreground">
            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="relative border-b border-[var(--border-light)] overflow-hidden">
                {/* dot-grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1.5px 1.5px, var(--foreground) 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-28 md:py-40 relative z-10">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-20">
                        {/* Left — headline */}
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex-1 space-y-10"
                        >
                            <p
                                className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground"
                                style={FONT_MONO}
                            >
                                Clover Hills — Algorithmic Asset Management
                            </p>

                            <h1
                                className="text-7xl md:text-[7rem] lg:text-[8.5rem] font-light leading-[0.88] tracking-tight"
                                style={FONT_DISPLAY}
                            >
                                Absolute
                                <br />
                                <em style={{ color: "var(--gold)" }}>Execution.</em>
                            </h1>

                            <p
                                className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed font-normal"
                                style={FONT_SANS}
                            >
                                Institutional algorithmic trading infrastructure for the
                                disciplined deployment of private capital into digital-asset
                                markets.
                            </p>

                            {/* CTA bar */}
                            <div className="flex flex-col sm:flex-row border border-foreground w-fit">
                                <Link
                                    href="/register"
                                    className="px-10 py-5 bg-foreground text-background text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-foreground/80 transition-colors duration-200 flex items-center justify-center"
                                    style={FONT_SANS}
                                >
                                    Open Account
                                </Link>
                                <Link
                                    href="/markets"
                                    className="px-10 py-5 bg-background text-foreground text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-muted transition-colors duration-200 border-t sm:border-t-0 sm:border-l border-foreground flex items-center justify-center"
                                    style={FONT_SANS}
                                >
                                    Live Markets
                                </Link>
                            </div>
                        </motion.div>

                        {/* Right — stat tiles */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="w-full lg:w-80 flex flex-col gap-px bg-foreground border border-foreground"
                        >
                            {[
                                { label: "Assets Under Management", val: "$4.2B" },
                                { label: "Algorithm Uptime", val: "99.99%" },
                                { label: "Active Client Accounts", val: "85,000+" },
                            ].map((s) => (
                                <div key={s.label} className="bg-background px-8 py-8 hover:bg-muted transition-colors duration-200">
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>
                                        {s.label}
                                    </p>
                                    <p className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                                        {s.val}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Market Data Table ──────────────────────────────────── */}
            <section className="border-b border-[var(--border-light)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-10" style={FONT_MONO}>
                        Real-Time Execution Data — Refreshed Every 60s
                    </p>

                    <div className="border border-[var(--border-light)]">
                        {/* header row */}
                        <div
                            className="grid grid-cols-4 border-b border-[var(--border-light)] px-6 py-3 bg-muted"
                            style={FONT_MONO}
                        >
                            {["Asset", "Price (USD)", "24H Change", "Volume"].map((h) => (
                                <span key={h} className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                                    {h}
                                </span>
                            ))}
                        </div>

                        {loading ? (
                            <div className="px-6 py-10 text-center text-[11px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>
                                Loading market data…
                            </div>
                        ) : (
                            cryptos.slice(0, 6).map((coin, i) => {
                                const pos = coin.price_change_percentage_24h >= 0;
                                return (
                                    <div
                                        key={coin.id}
                                        className={`grid grid-cols-4 px-6 py-5 hover:bg-muted transition-colors duration-150 ${i < cryptos.length - 1 ? "border-b border-[var(--border-light)]" : ""
                                            }`}
                                    >
                                        <div>
                                            <span className="font-semibold text-sm uppercase tracking-wider" style={FONT_SANS}>
                                                {coin.symbol}
                                            </span>
                                            <span className="ml-2 text-[9px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>
                                                #{coin.market_cap_rank}
                                            </span>
                                        </div>
                                        <span className="font-medium text-sm" style={FONT_MONO}>
                                            ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                        <span
                                            className="font-semibold text-sm"
                                            style={{ ...FONT_MONO, color: pos ? "var(--foreground)" : "var(--destructive)" }}
                                        >
                                            {pos ? "+" : ""}{coin.price_change_percentage_24h?.toFixed(2)}%
                                        </span>
                                        <span className="text-[11px] text-muted-foreground" style={FONT_MONO}>
                                            ${(coin.total_volume / 1_000_000).toFixed(1)}M
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Link
                            href="/markets"
                            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
                            style={FONT_MONO}
                        >
                            Full Market Chart →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Investment Plans ─────────────────────────────────── */}
            <section className="border-b border-[var(--border-light)] py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-6" style={FONT_MONO}>
                        Choose a Plan
                    </p>
                    <h2 className="text-4xl md:text-5xl font-light mb-16 text-foreground" style={FONT_DISPLAY}>
                        Investment <em>Plans.</em>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--border-light)] bg-[var(--border-light)] gap-px">
                        {plans.map((plan, i) => (
                            <div key={plan.id} className="bg-background p-10 flex flex-col group hover:bg-muted transition-colors duration-200">
                                <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-12" style={FONT_MONO}>
                                    Tier 0{i + 1}
                                </p>

                                <h3 className="text-3xl font-light mb-2 text-foreground" style={FONT_DISPLAY}>
                                    {plan.name}
                                </h3>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-10" style={FONT_MONO}>
                                    {plan.duration_days} Day Cycle
                                </p>

                                <div className="flex items-baseline gap-2 mb-12 border-b border-[var(--border-light)] pb-8">
                                    <span className="text-5xl font-light text-foreground tracking-tighter" style={FONT_DISPLAY}>
                                        {plan.daily_roi}%
                                    </span>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground" style={FONT_MONO}>
                                        Daily Return
                                    </span>
                                </div>

                                <div className="space-y-6 mb-12 flex-1">
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em]" style={FONT_MONO}>
                                        <span className="text-muted-foreground">Min. Deposit</span>
                                        <span className="text-foreground font-bold">${plan.min_deposit?.toLocaleString()}</span>
                                    </div>

                                    <ul className="space-y-4 pt-4 border-t border-[var(--border-light)]">
                                        {plan.features?.map((f: string, j: number) => (
                                            <li key={j} className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <div className="w-1.5 h-1.5 bg-[var(--gold)] shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    href="/register"
                                    className="w-full text-center py-5 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all"
                                    style={FONT_MONO}
                                >
                                    Start Investing
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Feature pillars ───────────────────────────────────── */}
            <section>
                <div className="grid md:grid-cols-3">
                    {[
                        {
                            n: "01",
                            title: "Quantum-Grade Security",
                            body: "Military-grade AES-256 encryption. Cold-storage segregation eliminates remote attack vectors on 98% of client assets.",
                        },
                        {
                            n: "02",
                            title: "Aggressive Optimisation",
                            body: "Proprietary HFT modules execute micro-arbitrage across decentralised exchanges 24/7, neutralising bearish macro conditions.",
                        },
                        {
                            n: "03",
                            title: "Full Transparency",
                            body: "Direct REST-API data feeds push verifiable execution records to your portfolio dashboard with zero obfuscation.",
                        },
                    ].map((f, i) => (
                        <div
                            key={f.n}
                            className={`p-16 hover:bg-muted transition-colors duration-200 ${i < 2 ? "border-r border-[var(--border-light)]" : ""
                                } border-t border-[var(--border-light)]`}
                        >
                            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground mb-10" style={FONT_MONO}>
                                {f.n}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-light mb-6 leading-tight" style={FONT_DISPLAY}>
                                {f.title}
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground" style={FONT_SANS}>
                                {f.body}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
