"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

const faqs = [
    { q: "How does the investment algorithm work?", a: "Our proprietary AI-driven trading bots execute thousands of micro-arbitrage positions per second across decentralised exchanges, systematically generating positive yield regardless of directional market movement." },
    { q: "What is the minimum deposit amount?", a: "The minimum capital injection to activate a strategy is $100 USD equivalent. Higher-tier strategies unlock reduced withdrawal fees and elevated daily yield ceilings." },
    { q: "How long do withdrawals take?", a: "Standard withdrawal requests are processed by our compliance team within 2–24 hours. Enterprise tier clients receive priority processing within 30 minutes." },
    { q: "Is my capital and personal data secure?", a: "Clover Hills operates with AES-256 encryption across all infrastructure. 98% of client assets are held in offline cold storage, immune to remote access vectors." },
    { q: "Can I upgrade my strategy tier at any point?", a: "Yes. Additional deposits are processed in real time. When your balance crosses a higher-tier threshold, your daily ROI rate updates automatically without interruption." },
];

export default function FAQPage() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <div className="pt-28 bg-background min-h-screen" style={FONT_SANS}>
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                <div className="border-b border-[var(--border-light)] py-20">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-5" style={FONT_MONO}>
                        Clover Hills — Support
                    </p>
                    <h1 className="text-6xl md:text-8xl font-light leading-[0.9]" style={FONT_DISPLAY}>
                        Frequently<br />Asked<br /><em>Questions.</em>
                    </h1>
                </div>

                <div className="divide-y divide-[var(--border-light)] mt-0">
                    {faqs.map((faq, i) => (
                        <div key={i}>
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-start justify-between py-8 gap-8 text-left group"
                            >
                                <span className="text-base md:text-lg font-medium text-foreground" style={FONT_SANS}>{faq.q}</span>
                                <span className="text-xl shrink-0 text-muted-foreground group-hover:text-foreground transition-colors duration-200" style={FONT_MONO}>
                                    {open === i ? "−" : "+"}
                                </span>
                            </button>
                            <AnimatePresence>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-sm leading-relaxed text-muted-foreground pb-8 max-w-2xl" style={FONT_SANS}>
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="border-t border-[var(--border-light)] py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="font-medium text-foreground mb-1" style={FONT_SANS}>Still have questions?</p>
                        <p className="text-sm text-muted-foreground" style={FONT_SANS}>Our compliance team responds within 24 hours.</p>
                    </div>
                    <Link
                        href="/contact"
                        className="px-8 py-4 bg-foreground text-background text-[11px] font-semibold uppercase tracking-[0.25em] hover:bg-foreground/80 transition-colors duration-200"
                        style={FONT_SANS}
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
