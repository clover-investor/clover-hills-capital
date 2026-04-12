"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import { useAlert } from "@/components/ui/AlertProvider";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };

export default function AdminSupportInbox() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const { showSuccess, showError } = useAlert();

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/admin/support");
            const data = await res.json();
            setTickets(data.tickets || []);
        } catch (err) {
            showError("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTickets(); }, []);

    const toggleStatus = async (ticketId: string, currentStatus: string) => {
        setProcessingId(ticketId);
        const newStatus = currentStatus === 'pending' ? 'resolved' : 'pending';
        try {
            const res = await fetch("/api/admin/support/resolve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId, status: newStatus }),
            });
            if (res.ok) {
                showSuccess(`Ticket marked as ${newStatus}`);
                setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
            } else showError("Failed to update ticket");
        } catch (err) {
            showError("Network error");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="space-y-12">
            <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4" style={FONT_MONO}>Concierge System</p>
                <h1 className="text-5xl font-light text-foreground" style={FONT_DISPLAY}>Support <em className="text-[var(--gold)]">Inbox.</em></h1>
            </div>

            <div className="border border-[var(--border-light)] bg-background overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted border-b border-[var(--border-light)] text-[9px] uppercase tracking-[0.3em] text-muted-foreground" style={FONT_MONO}>
                            <th className="px-8 py-4 font-normal">Date</th>
                            <th className="px-8 py-4 font-normal">Client</th>
                            <th className="px-8 py-4 font-normal">Message</th>
                            <th className="px-8 py-4 font-normal">Status</th>
                            <th className="px-8 py-4 font-normal text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                        {tickets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-[11px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>
                                    No support tickets found.
                                </td>
                            </tr>
                        ) : (
                            tickets.map((t) => (
                                <tr key={t.id} className="hover:bg-muted/50 transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <p className="text-[11px]" style={FONT_MONO}>
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-semibold" style={FONT_DISPLAY}>{t.name}</p>
                                        <p className="text-[10px] text-muted-foreground" style={FONT_MONO}>{t.email}</p>
                                    </td>
                                    <td className="px-8 py-6 max-w-md">
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {t.message}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 text-[8px] uppercase tracking-widest font-bold border ${t.status === 'resolved'
                                                ? 'text-teal-500 border-teal-500/30 bg-teal-500/5'
                                                : 'text-amber-500 border-amber-500/30 bg-amber-500/5'
                                            }`} style={FONT_MONO}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            disabled={processingId === t.id}
                                            onClick={() => toggleStatus(t.id, t.status)}
                                            className={`text-[9px] uppercase tracking-widest font-bold transition-all ${t.status === 'resolved' ? 'text-muted-foreground hover:text-foreground' : 'text-foreground hover:underline'
                                                } disabled:opacity-50`}
                                            style={FONT_MONO}
                                        >
                                            {processingId === t.id ? "Updating..." : t.status === 'resolved' ? "Re-open" : "Resolve"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
