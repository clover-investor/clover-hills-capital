import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
    const year = new Date().getFullYear();

    const cols = [
        {
            heading: "Navigation",
            links: [
                { label: "The Firm", href: "/about" },
                { label: "Investment Plans", href: "/plans" },
                { label: "Live Markets", href: "/markets" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
            ],
        },
        {
            heading: "Legal",
            links: [
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "KYC & AML Policy", href: "/kyc-aml" },
                { label: "Risk Disclosure", href: "/risk" },
            ],
        },
    ];

    return (
        <footer className="bg-background border-t border-[var(--border-light)]">
            {/* Gold rule */}
            <div className="w-full h-[3px]" style={{ backgroundColor: "var(--gold)" }} />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-8">
                        <Logo />
                        <p
                            className="text-sm leading-relaxed text-muted-foreground max-w-sm mt-4"
                            style={{ fontFamily: "var(--font-syne)" }}
                        >
                            Archem Capital deploys institutional‑grade algorithmic
                            infrastructure across liquid digital‑asset markets. Capital
                            preservation and asymmetric yield generation are our only mandates.
                        </p>
                    </div>

                    {cols.map((col) => (
                        <div key={col.heading}>
                            <h3
                                className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-8"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {col.heading}
                            </h3>
                            <ul className="space-y-4">
                                {col.links.map((lk) => (
                                    <li key={lk.href}>
                                        <Link
                                            href={lk.href}
                                            className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                                            style={{ fontFamily: "var(--font-syne)" }}
                                        >
                                            {lk.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Risk box */}
                <div
                    className="border border-[var(--border-light)] p-6 mb-12 text-[11px] leading-relaxed text-muted-foreground uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    <strong className="text-foreground">RISK DISCLOSURE —</strong> Trading
                    and investing in digital assets involves significant risk and may result
                    in the total loss of capital. Past performance does not guarantee future
                    results. Archem Capital does not provide financial advice.
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-[var(--border-light)] pt-8">
                    <p
                        className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        &copy; {year} Archem Capital Ltd. All rights reserved.
                    </p>
                    <div
                        className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        Reg. No. AC-874392
                    </div>
                </div>
            </div>
        </footer>
    );
}
