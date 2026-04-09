"use client";

const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function PrivacyPolicyPage() {
    return (
        <div className="pt-28 bg-background text-foreground" style={FONT_SANS}>
            <section className="border-b border-[var(--border-light)] py-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-12">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-6" style={FONT_MONO}>
                        Legal & Compliance
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        Privacy <em>Policy.</em>
                    </h1>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={FONT_MONO}>Last Updated: April 2024 — Clover Hills Legal</p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-16">
                    <div className="prose prose-invert max-w-none space-y-10">
                        <section>
                            <h2 className="text-xl font-medium text-foreground tracking-widest uppercase mb-4" style={FONT_MONO}>01. Data Collection</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Clover Hills is committed to maintaining the highest standards of data security and privacy. This policy outlines how we collect, process, and protect your institutional data.
                            </p>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-light" style={FONT_DISPLAY}>2. Cryptographic Security & Storage</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            All user data is encrypted at rest and in transit utilizing 256-bit Advanced Encryption Standard (AES). We employ cold-storage paradigms for sensitive physical identification documents.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-light" style={FONT_DISPLAY}>3. Information Utilization</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Collected data is utilized strictly for identity verification, transaction execution, account security enhancements, and systemic algorithmic optimization. Clover Hills does not, under any circumstances, sell client data to third-party data brokers.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-light" style={FONT_DISPLAY}>4. Blockchain Analytics & Tracking</h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Given the nature of digital assets, we employ blockchain analytics to monitor transaction flows into and out of our ecosystem. This is to ensure absolute compliance with global regulatory frameworks and prevent illicit capital utilization.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
