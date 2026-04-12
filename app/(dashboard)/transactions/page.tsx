"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch("/api/transactions");
                if (res.ok) {
                    const json = await res.json();
                    if (json.transactions) setTransactions(json.transactions);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (loading) return <Spinner label="Loading ledger..." />;

    return (
        <div className="max-w-6xl mx-auto space-y-12" style={FONT_SANS}>
            <div className="border-b border-[var(--border-light)] pb-8">
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                    Account Ledger
                </p>
                <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                    Transaction <em>History.</em>
                </h1>
            </div>

            <div className="border border-[var(--border-light)] bg-background">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-light)] bg-muted/50">
                                <th className="px-6 py-5 text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground" style={FONT_MONO}>Date</th>
                                <th className="px-6 py-5 text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground" style={FONT_MONO}>Type</th>
                                <th className="px-6 py-5 text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground" style={FONT_MONO}>Amount</th>
                                <th className="px-6 py-5 text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground" style={FONT_MONO}>Status</th>
                                <th className="px-6 py-5 text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground" style={FONT_MONO}>Method / Destination</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[11px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>
                                        No transaction history found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={FONT_MONO}>
                                            {new Date(tx.created_at).toLocaleDateString()}
                                            <br />
                                            {new Date(tx.created_at).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold" style={FONT_MONO}>{tx.type}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-base font-light" style={{ ...FONT_DISPLAY, color: tx.type === 'withdrawal' ? 'var(--foreground)' : 'var(--gold)' }}>
                                                {tx.type === 'withdrawal' ? '−' : '+'}${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1.5 border border-[var(--border-light)] bg-background text-[9px] uppercase tracking-widest" style={{ ...FONT_MONO, color: tx.status === 'approved' ? 'var(--gold)' : tx.status === 'rejected' ? 'red' : 'var(--muted-foreground)' }}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-[10px] text-muted-foreground max-w-[200px] truncate" style={FONT_MONO}>
                                            {tx.payment_method ? (
                                                <>
                                                    <span className="font-bold uppercase tracking-widest text-foreground mr-2">{tx.payment_method}</span>
                                                    {tx.wallet_address}
                                                </>
                                            ) : '-'}
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
