"use client";

import { useState, useEffect } from "react";
import Spinner from "@/components/ui/Spinner";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function TransactionsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState("all");

    const fetchTxs = async () => {
        try {
            const res = await fetch("/api/transactions");
            if (res.ok) {
                const json = await res.json();
                setData(json.transactions || []);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchTxs(); }, []);

    const handleRefresh = () => { setRefreshing(true); fetchTxs(); };

    const filtered = filter === "all" ? data : data.filter((t) => t.type === filter);

    return (
        <div className="max-w-6xl mx-auto space-y-12" style={FONT_SANS}>
            <div className="w-full mb-8 flex justify-center">
                <img src="/logoImages/clover banner transp.png" alt="Clover Banner" className="max-h-32 object-contain" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--border-light)] pb-8 gap-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                        Transaction History
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        My <em>Transactions.</em>
                    </h1>
                </div>

                <div className="flex items-center gap-px bg-[var(--border-light)] border border-[var(--border-light)]">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-4 bg-background text-[9px] uppercase tracking-[0.3em] font-bold border-none focus:outline-none hover:bg-muted transition-colors cursor-pointer"
                        style={FONT_MONO}
                    >
                        <option value="all">All Types</option>
                        <option value="deposit">Deposits</option>
                        <option value="withdrawal">Withdrawals</option>
                        <option value="earning">Earnings</option>
                        <option value="investment">Investments</option>
                    </select>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-4 bg-background text-[9px] uppercase tracking-[0.3em] font-bold border-l border-[var(--border-light)] hover:bg-muted transition-colors disabled:opacity-50"
                        style={FONT_MONO}
                    >
                        {refreshing ? "Updating…" : "Refresh"}
                    </button>
                </div>
            </div>

            <div className="border border-[var(--border-light)] bg-background">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted border-b border-[var(--border-light)]" style={FONT_MONO}>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Date</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Type</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Amount</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-20">
                                        <Spinner label="Decrypting transaction ledger..." />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-muted/50 transition-colors duration-150">
                                        <td className="px-8 py-6 text-[11px] text-muted-foreground whitespace-nowrap" style={FONT_MONO}>
                                            {new Date(tx.created_at).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-foreground" style={FONT_MONO}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-medium text-foreground" style={FONT_MONO}>
                                                {tx.type === 'withdrawal' || tx.type === 'investment' ? '−' : '+'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`text-[9px] uppercase tracking-[0.3em] font-black ${tx.status === 'approved' ? 'text-[var(--gold)]' :
                                                tx.status === 'pending' ? 'text-muted-foreground' :
                                                    'text-destructive'
                                                }`} style={FONT_MONO}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-8 border border-[var(--border-light)] space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground" style={FONT_MONO}>
                    Note
                </p>
                <p className="text-xs text-muted-foreground leading-[1.8] max-w-3xl">
                    All transactions are recorded in real-time. Minor time differences may appear due to blockchain confirmation delays.
                </p>
            </div>
        </div>
    );
}
