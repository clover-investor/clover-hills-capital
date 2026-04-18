"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAlert } from "@/components/ui/AlertProvider";
import Spinner from "@/components/ui/Spinner";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function PlansPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [investingId, setInvestingId] = useState<string | null>(null);
    const { showAlert } = useAlert();

    const fallbackPlans = [
        { id: "8f6b6a6c-486d-4e9f-9c60-4e1781191060", name: "Bronze Plan", min_deposit: 100, daily_roi: 10, duration_days: 7, features: ["Daily Earnings Payout", "Standard Trading", "Secure Storage"] },
        { id: "a713b14d-6e47-4939-9d62-7e0e7a17684d", name: "Silver Plan", min_deposit: 1000, daily_roi: 20, duration_days: 14, features: ["Priority Returns", "Advanced Trading", "24/7 Support", "Daily Payout"] },
        { id: "9c629d29-cae5-4813-a5af-be409ea622ce", name: "Gold Plan", min_deposit: 5000, daily_roi: 35, duration_days: 30, features: ["Premium Features", "Personal Account Manager", "Zero Fees", "Instant Payout"] },
    ];


    useEffect(() => {
        async function fetchData() {
            try {
                const [plansRes, userRes] = await Promise.all([
                    fetch("/api/plans"),
                    fetch("/api/user/dashboard")
                ]);

                if (plansRes.ok) {
                    const json = await plansRes.json();
                    setPlans(json.plans?.length ? json.plans : fallbackPlans);
                } else {
                    setPlans(fallbackPlans);
                }

                if (userRes.ok) {
                    const json = await userRes.json();
                    setUserData(json.user);
                }
            } catch {
                setPlans(fallbackPlans);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [frequency, setFrequency] = useState("7 days (weekly)");
    const [duration, setDuration] = useState("30");

    const handleInvest = async () => {
        if (!userData || !selectedPlan) return;

        const investmentAmount = amount ? Number(amount) : selectedPlan.min_deposit;

        if (investmentAmount < selectedPlan.min_deposit) {
            showAlert(`Minimum deposit for ${selectedPlan.name} is $${selectedPlan.min_deposit.toLocaleString()}.`, "error", "Invalid Amount");
            return;
        }

        if (userData.available_balance < investmentAmount) {
            showAlert(`Insufficient funds. You need at least $${investmentAmount.toLocaleString()} in your available balance.`, "error", "Balance Conflict");
            return;
        }

        setInvestingId(selectedPlan.id);
        try {
            const res = await fetch("/api/invest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: selectedPlan.id,
                    amount: investmentAmount,
                    frequency: frequency,
                    duration: Number(duration)
                })
            });

            if (res.ok) {
                showAlert(`Successfully invested $${investmentAmount.toLocaleString()} in the ${selectedPlan.name}.`, "success", "Investment Active");
                setIsModalOpen(false);
                setAmount("");
                // Refresh user data
                const userRes = await fetch("/api/user/dashboard");
                if (userRes.ok) {
                    const json = await userRes.json();
                    setUserData(json.user);
                }
            } else {
                const err = await res.json();
                showAlert(err.error || "Failed to process investment.", "error", "Process Error");
            }
        } catch (err) {
            showAlert("A network error occurred. Please try again.", "error", "Connection Error");
        } finally {
            setInvestingId(null);
        }
    };

    const openInvestmentModal = (plan: any) => {
        setSelectedPlan(plan);
        setAmount(plan.min_deposit.toString());
        setIsModalOpen(true);
    };

    if (loading) {
        return <Spinner label="Accessing investment plans..." />;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12" style={FONT_SANS}>
            <div className="w-full mb-8 flex justify-center">
                <img src="/logoImages/clover banner transp.png" alt="Clover Banner" className="max-h-32 object-contain" />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--border-light)] pb-8 gap-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                        Grow Your Wealth
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        Investment <em>Plans.</em>
                    </h1>
                </div>

                <div className="px-6 py-3 bg-muted border border-[var(--border-light)]">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1" style={FONT_MONO}>Available Capital</p>
                    <p className="text-xl font-bold" style={FONT_DISPLAY}>
                        ${userData?.available_balance?.toLocaleString() || "0.00"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--border-light)] bg-[var(--border-light)] gap-px">
                {plans.map((plan, i) => (
                    <div
                        key={plan.id}
                        className="bg-background flex flex-col group transition-colors duration-200"
                    >
                        <div className="p-10 pb-4">
                            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-12" style={FONT_MONO}>
                                Plan 0{i + 1}
                            </p>

                            <h3 className="text-3xl font-extrabold mb-2 text-foreground" style={FONT_DISPLAY}>
                                {plan.name}
                            </h3>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-6" style={FONT_MONO}>
                                {plan.duration_days} Day Period
                            </p>
                        </div>

                        {/* Green Section */}
                        <div className="flex-1 bg-[#1a4d2e] p-10 flex flex-col">
                            <div className="flex items-baseline gap-2 mb-12 border-b border-white/20 pb-8">
                                <span className="text-5xl font-light text-white tracking-tighter" style={FONT_DISPLAY}>
                                    {plan.daily_roi}%
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-white/70" style={FONT_MONO}>
                                    Daily Profit
                                </span>
                            </div>

                            <div className="space-y-6 mb-12 flex-1">
                                <ul className="space-y-4 pt-4 border-t border-white/20 text-white flex-1">
                                    {plan.features.map((f: string, j: number) => (
                                        <li key={j} className="flex items-center gap-3 text-xs text-white/80">
                                            <div className="w-1.5 h-1.5 bg-white shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => openInvestmentModal(plan)}
                                className="w-full py-5 bg-white text-[#1a4d2e] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/90 transition-all"
                                style={FONT_MONO}
                            >
                                Start Investing
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 border border-[var(--border-light)] bg-muted text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center" style={FONT_MONO}>
                Note: Larger investments may require a quick verification by our team to ensure account security.
            </div>

            {/* Investment Modal */}
            {isModalOpen && selectedPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-background border border-[var(--border-light)] w-full max-w-lg shadow-2xl"
                    >
                        <div className="p-8 border-b border-[var(--border-light)] flex justify-between items-center">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1" style={FONT_MONO}>Configure Investment</p>
                                <h2 className="text-2xl font-bold" style={FONT_DISPLAY}>{selectedPlan.name}</h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-muted transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Amount Input */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3" style={FONT_MONO}>Deposit Amount</label>
                                <div className="flex items-center bg-muted border border-[var(--border-light)] p-5 focus-within:border-foreground transition-colors">
                                    <span className="text-foreground/70 mr-3 font-bold">$</span>
                                    <input
                                        type="number"
                                        min={selectedPlan.min_deposit}
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="bg-transparent text-foreground w-full outline-none font-bold text-lg"
                                        style={FONT_MONO}
                                        placeholder={selectedPlan.min_deposit.toString()}
                                    />
                                </div>
                                <p className="mt-2 text-[9px] text-muted-foreground uppercase tracking-wider" style={FONT_MONO}>
                                    Minimum for this plan: ${selectedPlan.min_deposit.toLocaleString()}
                                </p>
                            </div>

                            {/* Frequency & Duration row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3" style={FONT_MONO}>Top-Up Frequency</label>
                                    <div className="relative">
                                        <select
                                            value={frequency}
                                            onChange={(e) => setFrequency(e.target.value)}
                                            className="w-full bg-muted border border-[var(--border-light)] p-5 outline-none font-bold text-[11px] uppercase tracking-[0.1em] appearance-none cursor-pointer focus:border-foreground transition-colors"
                                            style={FONT_MONO}
                                        >
                                            <option value="7 days (weekly)">7 Days (Weekly)</option>
                                            <option value="14 days (bi-weekly)">14 Days (Bi-Weekly)</option>
                                            <option value="30 days (monthly)">30 Days (Monthly)</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3" style={FONT_MONO}>Investment Period</label>
                                    <div className="relative">
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            className="w-full bg-muted border border-[var(--border-light)] p-5 outline-none font-bold text-[11px] uppercase tracking-[0.1em] appearance-none cursor-pointer focus:border-foreground transition-colors"
                                            style={FONT_MONO}
                                        >
                                            <option value="30">1 Month (30 Days)</option>
                                            <option value="90">3 Months (90 Days)</option>
                                            <option value="180">6 Months (180 Days)</option>
                                            <option value="365">1 Year (365 Days)</option>
                                            <option value="730">2 Years (730 Days)</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleInvest}
                                disabled={investingId === selectedPlan.id}
                                className="w-full py-6 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                style={FONT_MONO}
                            >
                                {investingId === selectedPlan.id ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                                        Processing…
                                    </>
                                ) : "Confirm & Start Investment"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
