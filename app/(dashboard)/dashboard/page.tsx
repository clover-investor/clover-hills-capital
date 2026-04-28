"use client";

import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/components/ui/AlertProvider";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function DashboardPage() {
    const [userData, setUserData] = useState({
        total_balance: 0,
        available_balance: 0,
        invested: 0,
        earnings: 0,
    });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [investments, setInvestments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Topup Modal State
    const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
    const [topupAmount, setTopupAmount] = useState("");
    const [submittingTopup, setSubmittingTopup] = useState(false);
    const { showAlert } = useAlert();

    const processChartData = (txs: any[]) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(today.getDate() - (6 - i));
            return {
                dateStr: d.toISOString().split('T')[0],
                dayLabel: days[d.getDay()],
                value: 0
            };
        });

        txs.forEach(tx => {
            if (tx.status !== 'approved') return;
            if (tx.type !== 'earning' && tx.type !== 'penalty') return;

            const txDate = new Date(tx.created_at).toISOString().split('T')[0];
            const dayEntry = last7Days.find(d => d.dateStr === txDate);

            if (dayEntry) {
                const amt = Number(tx.amount);
                if (tx.type === 'earning') {
                    dayEntry.value += amt;
                } else if (tx.type === 'penalty') {
                    dayEntry.value -= amt;
                }
            }
        });

        return last7Days.map(d => ({ day: d.dayLabel, value: Number(d.value.toFixed(2)) }));
    };

    const chartData = processChartData(transactions);

    const fetchData = async () => {
        try {
            const [dashRes, txRes] = await Promise.all([
                fetch("/api/user/dashboard"),
                fetch("/api/transactions"),
            ]);
            if (dashRes.ok) {
                const json = await dashRes.json();
                if (json.user) setUserData(json.user);
                if (json.investments) setInvestments(json.investments);
            }
            if (txRes.ok) {
                const { transactions: txs } = await txRes.json();
                if (txs) setTransactions(txs || []);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleTopup = async () => {
        if (!selectedInvestment || !topupAmount || isNaN(Number(topupAmount)) || Number(topupAmount) <= 0) return;

        if (Number(topupAmount) > userData.available_balance) {
            showAlert("Insufficient available balance for this top-up.", "error", "Balance Conflict");
            return;
        }

        setSubmittingTopup(true);
        try {
            const res = await fetch("/api/topup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transactionId: selectedInvestment.id,
                    amount: Number(topupAmount)
                })
            });

            if (res.ok) {
                showAlert(`Successfully topped up $${Number(topupAmount).toLocaleString()} to your ${selectedInvestment.plans?.name || 'investment'}.`, "success", "Top-up Complete");
                setIsTopupModalOpen(false);
                setTopupAmount("");
                fetchData();
            } else {
                const err = await res.json();
                showAlert(err.error || "Failed to process top-up.", "error", "Process Error");
            }
        } catch {
            showAlert("A network error occurred. Please try again.", "error", "Connection Error");
        } finally {
            setSubmittingTopup(false);
        }
    };

    if (loading) {
        return <Spinner label="Loading your dashboard..." />;
    }

    const stats = [
        { label: "Total Balance", val: userData.total_balance },
        { label: "Available Balance", val: userData.available_balance },
        { label: "Amount Invested", val: userData.invested },
        { label: "Total Earnings", val: userData.earnings },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12" style={FONT_SANS}>
            <div className="w-full mb-8 flex justify-center">
                <img src="/logoImages/clover banner transp.png" alt="Clover Banner" className="max-h-32 object-contain" />
            </div>

            {/* Header */}
            <div className="flex justify-between items-end border-b border-[var(--border-light)] pb-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2" style={FONT_MONO}>
                        My Portfolio
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        Account Overview
                    </h1>
                </div>
                <button
                    onClick={() => { setRefreshing(true); fetchData(); }}
                    className="px-6 py-3 border border-[var(--border-light)] text-[10px] font-semibold uppercase tracking-[0.25em] hover:bg-muted transition-colors duration-200"
                    style={FONT_MONO}
                >
                    {refreshing ? "Updating…" : "Refresh"}
                </button>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 border border-[var(--border-light)] divide-x divide-y divide-[var(--border-light)] md:divide-y-0">
                {stats.map((s, i) => (
                    <div
                        key={s.label}
                        className="px-6 py-6 sm:px-8 sm:py-8 hover:bg-muted transition-colors duration-200"
                    >
                        <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground mb-4" style={FONT_MONO}>
                            {s.label}
                        </p>
                        <p className="text-2xl sm:text-3xl font-light text-foreground" style={FONT_DISPLAY}>
                            ${(s.val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                ))}
            </div>

            {/* Active Investments */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground" style={FONT_MONO}>
                        Active Strategies
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">
                    {investments.length === 0 ? (
                        <div className="bg-background p-10 col-span-2 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>No active investments found</p>
                            <Link href="/plans" className="inline-block mt-4 text-[9px] uppercase tracking-widest font-bold border-b border-foreground" style={FONT_MONO}>Start Your First Strategy →</Link>
                        </div>
                    ) : (
                        investments.map((inv) => {
                            const startDate = new Date(inv.created_at);
                            const endDate = new Date(startDate);
                            endDate.setDate(startDate.getDate() + (inv.duration_days || 30));
                            const today = new Date();
                            const totalDays = inv.duration_days || 30;
                            const daysPassed = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
                            const daysRemaining = Math.max(0, totalDays - daysPassed);
                            const progress = Math.min(100, (daysPassed / totalDays) * 100);

                            return (
                                <div key={inv.id} className="bg-background p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--gold)] mb-1" style={FONT_MONO}>Active Deployment</p>
                                            <h3 className="text-xl font-bold" style={FONT_DISPLAY}>{inv.plans?.name || "Algorithmic Strategy"}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-light" style={FONT_DISPLAY}>${Number(inv.amount).toLocaleString()}</p>
                                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>{inv.plans?.daily_roi}% Daily Yield</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>
                                            <span>Progress</span>
                                            <span>{daysRemaining} Days Remaining</span>
                                        </div>
                                        <div className="h-1 bg-muted w-full overflow-hidden">
                                            <div
                                                className="h-full bg-foreground transition-all duration-1000"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button
                                            onClick={() => {
                                                setSelectedInvestment(inv);
                                                setIsTopupModalOpen(true);
                                            }}
                                            className="flex-1 py-4 border border-foreground text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all"
                                            style={FONT_MONO}
                                        >
                                            Top-up Capital
                                        </button>
                                        <div className="px-4 py-4 bg-muted text-[8px] uppercase tracking-widest flex items-center gap-2" style={FONT_MONO}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
                                            Live
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chart + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-[var(--border-light)]">
                {/* Chart */}
                <div className="lg:col-span-2 p-8 border-r border-[var(--border-light)]">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-8" style={FONT_MONO}>
                        Earnings — Last 7 Days
                    </p>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-light)" />
                                <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    contentStyle={{ background: "#0a0a0a", color: "#fff", border: "none", fontFamily: "var(--font-mono)", fontSize: "11px" }}
                                />
                                <Line type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent activity */}
                <div className="flex flex-col">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground p-8 border-b border-[var(--border-light)]" style={FONT_MONO}>
                        Recent Transactions
                    </p>
                    <div className="flex-1 overflow-y-auto max-h-[360px] divide-y divide-[var(--border-light)]">
                        {transactions.length === 0 ? (
                            <p className="p-8 text-[11px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>No transactions yet</p>
                        ) : (
                            transactions.slice(0, 6).map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between px-6 py-5 hover:bg-muted transition-colors duration-150">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={FONT_MONO}>{tx.type}</p>
                                        <p className="text-[9px] text-muted-foreground mt-1" style={FONT_MONO}>{new Date(tx.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-base font-light" style={FONT_DISPLAY}>
                                            {tx.type === "withdrawal" ? "−" : "+"}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <p
                                            className="text-[9px] uppercase tracking-widest mt-1"
                                            style={{ ...FONT_MONO, color: tx.status === "approved" ? "var(--gold)" : "var(--muted-foreground)" }}
                                        >
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="border-t border-[var(--border-light)] p-6">
                        <Link
                            href="/transactions"
                            className="block text-center text-[10px] uppercase tracking-[0.3em] py-4 border border-[var(--border-light)] hover:bg-foreground hover:text-background transition-colors duration-200"
                            style={FONT_MONO}
                        >
                            View All Transactions →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Topup Modal */}
            <AnimatePresence>
                {isTopupModalOpen && selectedInvestment && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-background border border-foreground w-full max-w-lg shadow-2xl"
                        >
                            <div className="p-8 border-b border-[var(--border-light)] flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1" style={FONT_MONO}>Investment Enhancement</p>
                                    <h2 className="text-2xl font-bold" style={FONT_DISPLAY}>Top-up Capital</h2>
                                </div>
                                <button
                                    onClick={() => setIsTopupModalOpen(false)}
                                    className="p-2 hover:bg-muted transition-colors border border-transparent hover:border-[var(--border-light)]"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="p-6 bg-muted border border-[var(--border-light)] space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold" style={FONT_MONO}>Current Capital</span>
                                        <span className="text-lg font-bold" style={FONT_DISPLAY}>${Number(selectedInvestment.amount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold" style={FONT_MONO}>Available Funds</span>
                                        <span className="text-lg font-bold text-[var(--gold)]" style={FONT_DISPLAY}>${userData.available_balance.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3" style={FONT_MONO}>Top-up Amount ($)</label>
                                    <div className="flex items-center bg-muted border border-[var(--border-light)] p-5 focus-within:border-foreground transition-colors">
                                        <span className="text-foreground/70 mr-3 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={topupAmount}
                                            onChange={(e) => setTopupAmount(e.target.value)}
                                            className="bg-transparent text-foreground w-full outline-none font-bold text-lg"
                                            style={FONT_MONO}
                                            placeholder="0.00"
                                            autoFocus
                                        />
                                    </div>
                                    <p className="mt-3 text-[9px] text-muted-foreground uppercase tracking-widest leading-loose" style={FONT_MONO}>
                                        Note: Topping up will renew your investment period starting from today.
                                    </p>
                                </div>

                                <button
                                    onClick={handleTopup}
                                    disabled={submittingTopup || !topupAmount || Number(topupAmount) <= 0}
                                    className="w-full py-6 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    style={FONT_MONO}
                                >
                                    {submittingTopup ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                                            Processing…
                                        </>
                                    ) : "Confirm Top-up"}
                                </button>

                                <button
                                    onClick={() => setIsTopupModalOpen(false)}
                                    className="w-full py-4 text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                    style={FONT_MONO}
                                >
                                    Cancel & Return
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
