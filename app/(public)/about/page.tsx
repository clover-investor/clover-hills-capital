"use client";
import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

const values = [
    {
        num: "01",
        title: "Uncompromising Security",
        desc: "AES-256 encryption across all infrastructure layers. Cold-storage segregation of 98% of assets eliminates remote attack vectors.",
    },
    {
        num: "02",
        title: "Consistent Yield Generation",
        desc: "Proprietary HFT modules process millions of data points daily to identify micro-arbitrage windows across liquid digital-asset exchanges.",
    },
    {
        num: "03",
        title: "Radical Transparency",
        desc: "Real-time REST APIs deliver verifiable execution data directly to your portfolio dashboard with zero latency obfuscation.",
    },
];

const stats = [
    { label: "Assets Under Management", value: "$4.2B" },
    { label: "Active Client Relationships", value: "85,000+" },
    { label: "Avg. Annual Return", value: "158%" },
    { label: "Jurisdictions Served", value: "140+" },
];

export default function AboutPage() {
    return (
        <div className="pt-28 bg-background text-foreground" style={FONT_SANS}>
            {/* eyebrow + headline */}
            <section className="border-b border-[var(--border-light)] py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-6" style={FONT_MONO}>
                        The Firm / Overview
                    </p>
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-6xl md:text-8xl font-light leading-[0.9] tracking-tight text-foreground mb-12"
                        style={FONT_DISPLAY}
                    >
                        Pioneering the<br />
                        Future of<br />
                        <em>Institutional Yield.</em>
                    </motion.h1>
                    <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed font-normal" style={FONT_SANS}>
                        Clover Hills was founded by former Wall Street quantitative analysts
                        committed to delivering hedge-fund-level returns to individual investors
                        through verifiable, algorithmic infrastructure.
                    </p>
                </div>
            </section>

            {/* Stats bar */}
            <section className="border-b border-[var(--border-light)]">
                <div className="grid grid-cols-2 md:grid-cols-4 border-l border-[var(--border-light)]">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="border-r border-b md:border-b-0 border-[var(--border-light)] py-12 px-10"
                        >
                            <p className="text-5xl md:text-6xl font-light mb-3 text-foreground" style={FONT_DISPLAY}>
                                {s.value}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground" style={FONT_MONO}>
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission */}
            <section className="py-24 border-b border-[var(--border-light)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-20 items-start">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-6" style={FONT_MONO}>
                            Our Mandate
                        </p>
                        <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8" style={FONT_DISPLAY}>
                            Democratising Hedge-Fund Level Returns
                        </h2>
                    </div>
                    <div className="space-y-6 pt-16">
                        <p className="text-sm leading-relaxed text-muted-foreground" style={FONT_SANS}>
                            By combining AI-driven proprietary trading algorithms with
                            deep liquidity pools, our platform generates consistent,
                            verifiable daily yields regardless of macro market direction.
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground" style={FONT_SANS}>
                            Our strict risk-management framework protects principal capital
                            while systematically targeting asymmetric yield opportunities.
                        </p>
                        <Link
                            href="/plans"
                            className="inline-flex items-center gap-3 py-4 px-8 bg-foreground text-background text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-foreground/80 transition-colors duration-200 mt-4"
                            style={FONT_SANS}
                        >
                            View Strategies
                        </Link>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-16" style={FONT_MONO}>
                        Core Values
                    </p>
                    <div className="grid md:grid-cols-3 border-l border-[var(--border-light)]">
                        {values.map((v) => (
                            <div
                                key={v.num}
                                className="border-r border-[var(--border-light)] px-10 py-12 hover:bg-muted transition-colors duration-200"
                            >
                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8" style={FONT_MONO}>
                                    {v.num}
                                </p>
                                <h3 className="text-2xl font-light mb-6 text-foreground" style={FONT_DISPLAY}>
                                    {v.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground" style={FONT_SANS}>
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
