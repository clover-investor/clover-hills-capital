"use client";

import { useState, useEffect } from "react";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/admin/transactions");
            if (res.ok) {
                const json = await res.json();
                setTransactions(json.transactions || []);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchTransactions(); }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchTransactions();
    };

    const handleApprove = async (txId: string) => {
        if (!confirm("Are you sure you want to approve this transaction? The user's balance will immediately update and an email will be sent.")) return;
        setProcessingId(txId);
        try {
            const res = await fetch("/api/admin/transactions/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ txId })
            });
            if (res.ok) {
                handleRefresh();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } finally {
            setProcessingId(null);
        }
    };

    const filteredTransactions = transactions.filter(t =>
        (t.users?.email?.toLowerCase().includes(search.toLowerCase())) ||
        (t.type?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-10" style={FONT_SANS}>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--border-light)] pb-8 gap-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                        Ledger Management
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        Manage <em>Transactions.</em>
                    </h1>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-8 py-4 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all disabled:opacity-50"
                    style={FONT_MONO}
                >
                    {refreshing ? "Refreshing…" : "Refresh Ledger"}
                </button>
            </div>

            <div className="border border-[var(--border-light)] bg-background">
                <div className="p-6 border-b border-[var(--border-light)] bg-muted">
                    <div className="relative max-w-sm">
                        <input
                            type="text"
                            placeholder="Search by email or type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-6 pr-6 py-3 bg-background border border-[var(--border-light)] text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-foreground"
                            style={FONT_MONO}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted border-b border-[var(--border-light)]" style={FONT_MONO}>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">User</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Type</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Amount</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Method / Wallet</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Status</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                            {loading ? (
                                <tr><td colSpan={6} className="px-8 py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse" style={FONT_MONO}>Loading transactions…</td></tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr><td colSpan={6} className="px-8 py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>No transactions found.</td></tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-muted/50 transition-all">
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-bold text-foreground" style={FONT_SANS}>{tx.users?.email}</p>
                                            <p className="text-[9px] text-muted-foreground mt-1" style={FONT_MONO}>{new Date(tx.created_at).toLocaleDateString()} {new Date(tx.created_at).toLocaleTimeString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold" style={FONT_MONO}>{tx.type}</span>
                                        </td>
                                        <td className="px-8 py-6 text-[11px]" style={FONT_MONO}>
                                            <span className="text-[var(--gold)]">$ {Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] text-muted-foreground max-w-[200px] truncate" style={FONT_MONO}>
                                            {tx.payment_method ? (
                                                <>
                                                    <span className="font-bold text-foreground uppercase tracking-widest mr-2">{tx.payment_method}</span>
                                                    {tx.wallet_address}
                                                </>
                                            ) : '-'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] uppercase tracking-[0.3em] font-black ${tx.status === 'approved' ? 'text-[var(--gold)]' :
                                                tx.status === 'pending' ? 'text-muted-foreground' : 'text-destructive'}`} style={FONT_MONO}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {tx.status === 'pending' && (
                                                <button
                                                    onClick={() => handleApprove(tx.id)}
                                                    disabled={processingId === tx.id}
                                                    className="px-4 py-2 bg-[var(--gold)] text-black text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-white transition-all disabled:opacity-50"
                                                    style={FONT_MONO}
                                                >
                                                    {processingId === tx.id ? "Approving..." : "Approve"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
