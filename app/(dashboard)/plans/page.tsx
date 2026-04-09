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
    const { showAlert } = useAlert();
    const supabase = createClient();

    const fallbackPlans = [
        { id: "8f6b6a6c-486d-4e9f-9c60-4e1781191060", name: "Bronze Plan", min_deposit: 100, daily_roi: 10, duration_days: 7, features: ["Daily Earnings Payout", "Standard Trading", "Secure Storage"] },
        { id: "a713b14d-6e47-4939-9d62-7e0e7a17684d", name: "Silver Plan", min_deposit: 500, daily_roi: 20, duration_days: 14, features: ["Priority Returns", "Advanced Trading", "24/7 Support", "Daily Payout"] },
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

    const handleInvest = async (plan: any) => {
        if (!userData) return;

        if (userData.available_balance < plan.min_deposit) {
            showAlert(`Insufficient funds. You need at least $${plan.min_deposit.toLocaleString()} in your available balance.`, "error", "Balance Conflict");
            return;
        }

        setInvestingId(plan.id);
        try {
            const res = await fetch("/api/invest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: plan.id, amount: plan.min_deposit })
            });

            if (res.ok) {
                showAlert(`Successfully invested $${plan.min_deposit.toLocaleString()} in the ${plan.name}.`, "success", "Investment Active");
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
                        className="bg-background p-10 flex flex-col group hover:bg-muted transition-colors duration-200"
                    >
                        <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-12" style={FONT_MONO}>
                            Plan 0{i + 1}
                        </p>

                        <h3 className="text-3xl font-light mb-2 text-foreground" style={FONT_DISPLAY}>
                            {plan.name}
                        </h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-10" style={FONT_MONO}>
                            {plan.duration_days} Day Period
                        </p>

                        <div className="flex items-baseline gap-2 mb-12 border-b border-[var(--border-light)] pb-8">
                            <span className="text-5xl font-light text-foreground tracking-tighter" style={FONT_DISPLAY}>
                                {plan.daily_roi}%
                            </span>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground" style={FONT_MONO}>
                                Daily Profit
                            </span>
                        </div>

                        <div className="space-y-6 mb-12 flex-1">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em]" style={FONT_MONO}>
                                <span className="text-muted-foreground">Min. Deposit</span>
                                <span className="text-foreground font-bold">${plan.min_deposit.toLocaleString()}</span>
                            </div>

                            <ul className="space-y-4 pt-4 border-t border-[var(--border-light)]">
                                {plan.features.map((f: string, j: number) => (
                                    <li key={j} className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="w-1.5 h-1.5 bg-[var(--gold)] shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            onClick={() => handleInvest(plan)}
                            disabled={investingId === plan.id}
                            className="w-full py-5 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all disabled:opacity-50"
                            style={FONT_MONO}
                        >
                            {investingId === plan.id ? "Processing…" : "Start Investing"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-8 border border-[var(--border-light)] bg-muted text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center" style={FONT_MONO}>
                Note: Larger investments may require a quick verification by our team to ensure account security.
            </div>

        </div>
    );
}
