"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/components/ui/AlertProvider";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function SupportChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const { showSuccess, showError } = useAlert();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                showSuccess("Message sent. We will contact you soon.", "Support Ticket Received");
                setFormData({ name: "", email: "", message: "" });
                setIsOpen(false);
            } else {
                showError("Failed to send message. Please try again.", "Error");
            }
        } catch {
            showError("A network error occurred.", "Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-[100]" style={FONT_SANS}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[350px] bg-background border border-foreground p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8 border-b border-[var(--border-light)] pb-4">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground" style={FONT_MONO}>Concierge</p>
                                <h3 className="text-xl font-light text-foreground" style={FONT_DISPLAY}>Client Support</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2" style={FONT_MONO}>Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-[var(--border-light)] text-[11px] focus:outline-none focus:border-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2" style={FONT_MONO}>Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-[var(--border-light)] text-[11px] focus:outline-none focus:border-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2" style={FONT_MONO}>How can we help?</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-[var(--border-light)] text-[11px] focus:outline-none focus:border-foreground resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-foreground/80 transition-all disabled:opacity-50"
                                style={FONT_MONO}
                            >
                                {loading ? "Dispatching..." : "Send Message"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-foreground text-background flex items-center justify-center shadow-xl hover:scale-105 transition-all"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                )}
            </button>
        </div>
    );
}
