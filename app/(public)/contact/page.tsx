"use client";
import { useState } from "react";
import { useAlert } from "@/components/ui/AlertProvider";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

const contacts = [
    { label: "General Enquiries", val: "enquiries@cloverhills.com" },
    { label: "Client Support", val: "support@cloverhills.com" },
    { label: "Compliance & KYC", val: "compliance@cloverhills.com" },
    { label: "Registered Address", val: "123 Financial District, New York, NY 10001, USA" },
];

export default function ContactPage() {
    const { showSuccess, showError } = useAlert();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showSuccess("Your message has been received. Our team will contact you shortly.", "Inquiry Sent");
        }, 900);
    };

    return (
        <div className="pt-28 bg-background min-h-screen" style={FONT_SANS}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="border-b border-[var(--border-light)] py-20">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-5" style={FONT_MONO}>
                        Clover Hills — Contact
                    </p>
                    <h1 className="text-6xl md:text-8xl font-light leading-[0.9]" style={FONT_DISPLAY}>
                        Get In<br /><em>Touch.</em>
                    </h1>
                </div>

                <div className="grid md:grid-cols-2 py-20 gap-20">
                    {/* Contact details */}
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-10" style={FONT_MONO}>
                            Direct Lines
                        </p>
                        <div className="divide-y divide-[var(--border-light)] border-t border-[var(--border-light)]">
                            {contacts.map((c) => (
                                <div key={c.label} className="py-6">
                                    <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2" style={FONT_MONO}>{c.label}</p>
                                    <p className="text-sm font-medium text-foreground" style={FONT_SANS}>{c.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-10" style={FONT_MONO}>
                            Send a Message
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {[
                                { id: "name", label: "Full Name", type: "text" },
                                { id: "email", label: "Email Address", type: "email" },
                            ].map((f) => (
                                <div key={f.id}>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2" style={FONT_MONO}>{f.label}</label>
                                    <input
                                        type={f.type}
                                        required
                                        className="w-full px-5 py-4 border border-[var(--border-light)] bg-background text-sm focus:outline-none focus:border-foreground transition-colors duration-200"
                                        style={FONT_SANS}
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2" style={FONT_MONO}>Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    className="w-full px-5 py-4 border border-[var(--border-light)] bg-background text-sm focus:outline-none focus:border-foreground transition-colors duration-200 resize-none"
                                    style={FONT_SANS}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-foreground text-background text-[11px] font-semibold uppercase tracking-[0.3em] hover:bg-foreground/80 transition-colors duration-200 disabled:opacity-50"
                                style={FONT_SANS}
                            >
                                {loading ? "Transmitting…" : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
