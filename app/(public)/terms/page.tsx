"use client";

const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function TermsPage() {
    return (
        <div className="pt-28 bg-background text-foreground" style={FONT_SANS}>
            <section className="border-b border-[var(--border-light)] py-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-6" style={FONT_MONO}>
                        Legal & Compliance
                    </p>
                    <h1 className="text-5xl md:text-7xl font-light leading-[0.9] tracking-tight mb-12" style={FONT_DISPLAY}>
                        Terms of <em>Service.</em>
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={FONT_MONO}>
                        Last Updated: September 2024
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-16">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light" style={FONT_DISPLAY}>1. Protocol Engagement</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            By utilizing the Clover Hills architectural infrastructure, you agree to be bound by these institutional terms. Access to proprietary execution modules is provided solely at the discretion of the firm and may be revoked if compliance standards are breached.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-light" style={FONT_DISPLAY}>2. Capital Risk Acknowledgment</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Digital asset markets are inherently volatile. While Clover Hills employs high-frequency arbitrage and quantitative modeling to isolate yields, absolute principal protection cannot be mathematically guaranteed. Clients allocate capital acknowledging full cryptographic and market risk.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-light" style={FONT_DISPLAY}>3. Yield Disbursement</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Yield returns indicated on Strategy modules are algorithmic targets based on historical high-frequency data. Actual distributions depend on live liquidity conditions and automated operational slippage logic. Withdrawal requests are processed subject to AML/KYC clearance buffers.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-light" style={FONT_DISPLAY}>4. Ecosystem Integrity</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Any attempt to reverse-engineer, sybil-attack, or manipulate the Clover Hills web interface or underlying smart-contract aggregations will result in immediate capital freezing and legal notification to relevant international jurisdiction authorities.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
