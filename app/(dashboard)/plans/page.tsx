"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAlert } from "@/components/ui/AlertProvider";
import { createClient } from "@/utils/supabase/client";
import Spinner from "@/components/ui/Spinner";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function PlansPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [investingId, setInvestingId] = useState<string | null>(null);
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const { showAlert } = useAlert();
    const supabase = createClient();

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

    const handleAmountChange = (planId: string, value: string) => {
        setAmounts(prev => ({ ...prev, [planId]: value }));
    };

    const handleInvest = async (plan: any) => {
        if (!userData) return;

        const investmentAmount = amounts[plan.id] ? Number(amounts[plan.id]) : plan.min_deposit;

        if (investmentAmount < plan.min_deposit) {
            showAlert(`Minimum deposit for ${plan.name} is $${plan.min_deposit.toLocaleString()}.`, "error", "Invalid Amount");
            return;
        }

        if (userData.available_balance < investmentAmount) {
            showAlert(`Insufficient funds. You need at least $${investmentAmount.toLocaleString()} in your available balance.`, "error", "Balance Conflict");
            return;
        }

        setInvestingId(plan.id);
        try {
            const res = await fetch("/api/invest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: plan.id, amount: investmentAmount })
            });

            if (res.ok) {
                showAlert(`Successfully invested $${investmentAmount.toLocaleString()} in the ${plan.name}.`, "success", "Investment Active");
                setAmounts(prev => ({ ...prev, [plan.id]: "" }));
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
                                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em]" style={FONT_MONO}>
                                    <span className="text-white/70">Min. Deposit</span>
                                    <span className="text-white font-bold">${plan.min_deposit.toLocaleString()}</span>
                                </div>

                                <ul className="space-y-4 pt-4 border-t border-white/20 text-white mb-6">
                                    {plan.features.map((f: string, j: number) => (
                                        <li key={j} className="flex items-center gap-3 text-xs text-white/80">
                                            <div className="w-1.5 h-1.5 bg-white shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <div>
                                    <label className="block text-white/70 text-[9px] uppercase tracking-[0.2em] mb-2" style={FONT_MONO}>Deposit Amount</label>
                                    <div className="flex items-center bg-[#143a22] border border-white/20 p-4 focus-within:border-white transition-colors">
                                        <span className="text-white/70 mr-2 font-bold">$</span>
                                        <input
                                            type="number"
                                            min={plan.min_deposit}
                                            placeholder={plan.min_deposit.toString()}
                                            value={amounts[plan.id] || ""}
                                            onChange={(e) => handleAmountChange(plan.id, e.target.value)}
                                            className="bg-transparent text-white w-full outline-none font-bold placeholder:text-white/30"
                                            style={FONT_MONO}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleInvest(plan)}
                                disabled={investingId === plan.id}
                                className="w-full py-5 bg-white text-[#1a4d2e] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/90 transition-all disabled:opacity-50"
                                style={FONT_MONO}
                            >
                                {investingId === plan.id ? "Processing…" : "Start Investing"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 border border-[var(--border-light)] bg-muted text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center" style={FONT_MONO}>
                Note: Larger investments may require a quick verification by our team to ensure account security.
            </div>

        </div>
    );
}
