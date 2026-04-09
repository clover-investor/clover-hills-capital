"use client";

import TradingViewWidget from "@/components/TradingViewWidget";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function MarketsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-10" style={FONT_SANS}>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--border-light)] pb-8 gap-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                        Market Prices
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        Live <em>Markets.</em>
                    </h1>
                </div>

                <div className="flex items-center gap-3 border border-[var(--border-light)] px-6 py-3 bg-muted">
                    <div className="w-2 h-2 bg-[var(--gold)] animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-foreground" style={FONT_MONO}>
                        Real-time price feed enabled
                    </span>
                </div>
            </div>

            <div className="border border-[var(--border-light)] p-2 bg-muted">
                <TradingViewWidget />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">
                <div className="bg-background p-8 space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-foreground" style={FONT_MONO}>01 — Market Data</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        We get live price data directly from top global exchanges like Binance and Coinbase.
                        Our systems monitor these prices 24/7 to ensure they are always up to date.
                    </p>
                </div>
                <div className="bg-background p-8 space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-foreground" style={FONT_MONO}>02 — Data Accuracy</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        All price data is verified and transparent.
                        We provide clear, real-time market information so you can track your investments with confidence.
                    </p>
                </div>

            </div>
        </div>
    );
}
