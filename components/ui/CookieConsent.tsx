"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function CookieConsent() {
    const [show, setShow] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("clover_consent");
        if (!consent) {
            setShow(true);
        }
    }, []);

    const handleAccept = () => {
        if (!acceptedTerms) {
            alert("You must acknowledge the legal disclaimers to proceed.");
            return;
        }
        localStorage.setItem("clover_consent", "true");
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    className="fixed bottom-0 left-0 w-full z-[100] bg-background border-t border-foreground p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-2xl"
                    style={FONT_SANS}
                >
                    <div className="max-w-4xl">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground mb-3" style={FONT_MONO}>
                            Compliance & Privacy Protocol
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed md:pr-10">
                            Clover Hills utilizes fundamental tracking data to sustain algorithmic security, ensure AML compliance, and optimize systemic operations. By proceeding, you explicitly accept our utilization of essential cookies.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <input
                                type="checkbox"
                                id="termsCheckbox"
                                className="w-5 h-5 cursor-pointer appearance-none shrink-0 transition-colors"
                                style={{
                                    border: '1px solid var(--foreground)',
                                    backgroundImage: acceptedTerms ? 'url("data:image/svg+xml;utf8,<svg viewBox=\'0 0 14 14\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' xmlns=\'http://www.w3.org/2000/svg\'><polyline points=\'3 7 6 10 11 4\'/></svg>")' : 'none',
                                    backgroundColor: acceptedTerms ? 'var(--foreground)' : 'transparent',
                                    backgroundPosition: 'center',
                                    backgroundSize: '100% 100%'
                                }}
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                            />
                            <label htmlFor="termsCheckbox" className="text-[10px] uppercase tracking-[0.1em] font-medium text-muted-foreground cursor-pointer leading-relaxed" style={FONT_MONO}>
                                I acknowledge and agree to the <Link href="/terms" className="text-foreground underline underline-offset-4 font-bold hover:text-[var(--gold)] transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-foreground underline underline-offset-4 font-bold hover:text-[var(--gold)] transition-colors">Privacy Policy</Link>.
                            </label>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto shrink-0 flex items-center">
                        <button
                            onClick={handleAccept}
                            className={`w-full md:w-auto px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-200 border border-foreground ${acceptedTerms ? 'bg-foreground text-background hover:bg-foreground/80' : 'bg-background text-muted-foreground opacity-50 cursor-not-allowed'}`}
                            style={FONT_MONO}
                        >
                            Accept & Proceed
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
