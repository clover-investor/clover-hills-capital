"use client";

import { useEffect, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

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
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const chartData = [
        { day: "Mon", value: 0 },
        { day: "Tue", value: 0 },
        { day: "Wed", value: 0 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 0 },
        { day: "Sat", value: 0 },
        { day: "Sun", value: 0 },
    ];

    const fetchData = async () => {
        try {
            const [dashRes, txRes] = await Promise.all([
                fetch("/api/user/dashboard"),
                fetch("/api/transactions"),
            ]);
            if (dashRes.ok) {
                const json = await dashRes.json();
                // API returns { user: {...}, transactions: [...] }
                if (json.user) setUserData(json.user);
            }
            if (txRes.ok) {
                const { transactions: txs } = await txRes.json();
                if (txs) setTransactions(txs);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    if (loading) {
        return <Spinner label="Loading your  dashboard..." />;
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
        </div>
    );
}
