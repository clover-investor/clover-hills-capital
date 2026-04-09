import { ShieldAlert } from "lucide-react";

const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function RiskDisclaimerPage() {
    return (
        <div className="pt-32 pb-24 bg-background min-h-screen" style={FONT_SANS}>
            <div className="max-w-4xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-20 border-b border-[var(--border-light)] pb-16">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-6" style={FONT_MONO}>
                        Clover Hills — Legal Notice
                    </p>
                    <h1 className="text-5xl md:text-7xl font-light text-foreground mb-8" style={FONT_DISPLAY}>
                        Risk <em>Disclosure.</em>
                    </h1>
                    <p className="max-w-lg mx-auto text-sm text-muted-foreground leading-relaxed uppercase tracking-widest" style={FONT_MONO}>
                        Important institutional information regarding the risk dynamics of digital asset execution.
                    </p>
                </div>

                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground w-32 shrink-0 flex items-center gap-2" style={FONT_MONO}>
                            <span className="w-4 h-[1px] bg-[var(--border-light)]"></span> 01
                        </span>
                        <div>
                            <h2 className="text-2xl font-light mb-4 text-foreground" style={FONT_DISPLAY}>Volatility & Market Risk</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Cryptocurrency markets are subject to extreme volatility. Asset valuations can oscillate significantly over minimal temporal horizons. Capable institutional execution does not eliminate the inherent possibility of abrupt and significant depreciation, which could result in the partial or total loss of initial capital. <strong>Never deploy capital that you cannot afford to lose.</strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground w-32 shrink-0 flex items-center gap-2" style={FONT_MONO}>
                            <span className="w-4 h-[1px] bg-[var(--border-light)]"></span> 02
                        </span>
                        <div>
                            <h2 className="text-2xl font-light mb-4 text-foreground" style={FONT_DISPLAY}>Algorithmic Execution Constraints</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                While Clover Hills utilizes proprietary HFT infrastructure designed to secure consistent yields, no logic is absolute. Anomalous market events, "black swan" scenarios, or structural failures in decentralized liquidity protocols may lead to unexpected results. Our algorithms are optimized for stability, but past performance provides zero guarantee of future outcomes.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground w-32 shrink-0 flex items-center gap-2" style={FONT_MONO}>
                            <span className="w-4 h-[1px] bg-[var(--border-light)]"></span> 03
                        </span>
                        <div>
                            <h2 className="text-2xl font-light mb-4 text-foreground" style={FONT_DISPLAY}>Systemic & Technological Risk</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                The digital nature of asset management introduces systemic risks including network latency, smart contract vulnerabilities, and third-party protocol insolvency. Despite Clover Hills's implementation of multi-layered encryption and offline security procedures, the user acknowledges that permanent capital loss is a theoretical possibility of all blockchain-based finance.
                            </p>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-[var(--border-light)]">
                        <p className="text-xs font-medium text-foreground uppercase tracking-[0.3em] leading-relaxed text-center" style={FONT_MONO}>
                            By initializing an account with Clover Hills, you acknowledge that you have reviewed and understood these risk dynamics in their entirety.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
