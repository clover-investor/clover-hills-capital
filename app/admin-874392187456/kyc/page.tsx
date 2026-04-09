"use client";

import { useState, useEffect } from "react";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function AdminKycPage() {
    const [kycs, setKycs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [viewingKyc, setViewingKyc] = useState<any>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchKyc = async () => {
        try {
            const res = await fetch("/api/admin/kyc");
            if (res.ok) {
                const json = await res.json();
                setKycs(json.kyc || []);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchKyc(); }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchKyc();
    };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        if (!confirm(`Confirm you want to ${action} this KYC request?`)) return;
        setProcessingId(id);
        try {
            const res = await fetch("/api/admin/kyc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, kycId: id })
            });
            if (res.ok) {
                fetchKyc();
                setViewingKyc(null);
            }
        } finally {
            setProcessingId(null);
        }
    };

    const filtered = kycs.filter(k =>
        k.users?.email?.toLowerCase().includes(search.toLowerCase()) ||
        k.users?.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10" style={FONT_SANS}>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--border-light)] pb-8 gap-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                        User Verification
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        KYC <em>Approvals.</em>
                    </h1>
                </div>
                <button onClick={handleRefresh} className="px-8 py-4 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all" style={FONT_MONO}>
                    {refreshing ? "Refreshing…" : "Refresh List"}
                </button>
            </div>

            <div className="border border-[var(--border-light)] bg-background">
                <div className="p-6 border-b border-[var(--border-light)] bg-muted">
                    <div className="relative max-w-sm">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
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
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Submission Date</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Status</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                            {loading ? (
                                <tr><td colSpan={4} className="px-8 py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse" style={FONT_MONO}>Loading KYC requests…</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={4} className="px-8 py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>No pending KYC requests found.</td></tr>
                            ) : (
                                filtered.map((kyc) => (
                                    <tr key={kyc.id} className="hover:bg-muted/50 transition-all">
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">{kyc.users?.full_name}</p>
                                            <p className="text-[9px] text-muted-foreground mt-1" style={FONT_MONO}>{kyc.users?.email}</p>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] text-muted-foreground whitespace-nowrap" style={FONT_MONO}>
                                            {new Date(kyc.created_at).toLocaleString().toUpperCase()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] uppercase tracking-[0.3em] font-black ${kyc.status === 'approved' ? 'text-[var(--gold)]' :
                                                kyc.status === 'pending' ? 'text-muted-foreground' :
                                                    'text-destructive'
                                                }`} style={FONT_MONO}>
                                                {kyc.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => setViewingKyc(kyc)}
                                                className="text-[9px] uppercase tracking-[0.3em] font-bold text-foreground hover:underline underline-offset-4 transition-all"
                                                style={FONT_MONO}
                                            >
                                                View Documents
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {viewingKyc && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-12" style={FONT_SANS}>
                    <div className="bg-background w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-foreground p-10 space-y-10 shadow-2xl">
                        <div className="flex justify-between items-end border-b border-[var(--border-light)] pb-8">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-2" style={FONT_MONO}>KYC Application</p>
                                <h3 className="text-3xl font-light text-foreground" style={FONT_DISPLAY}>{viewingKyc.users?.full_name}</h3>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-foreground bg-muted px-4 py-2" style={FONT_MONO}>
                                Status: {viewingKyc.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground" style={FONT_MONO}>Identity Document</p>
                                <div className="border border-[var(--border-light)] bg-muted p-2 h-[500px]">
                                    {viewingKyc.document_url ? (
                                        <img src={viewingKyc.document_url} alt="ID" className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>Error: Image Missing</div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground" style={FONT_MONO}>Biometric Selfie</p>
                                <div className="border border-[var(--border-light)] bg-muted p-2 h-[500px]">
                                    {viewingKyc.selfie_url ? (
                                        <img src={viewingKyc.selfie_url} alt="Selfie" className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>Error: Image Missing</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-10 border-t border-[var(--border-light)]">
                            <button onClick={() => setViewingKyc(null)} className="px-8 py-5 border border-[var(--border-light)] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-muted transition-all" style={FONT_MONO}>
                                Close
                            </button>

                            {viewingKyc.status === "pending" && (
                                <div className="flex gap-6">
                                    <button
                                        onClick={() => handleAction(viewingKyc.id, "reject")}
                                        disabled={!!processingId}
                                        className="px-10 py-5 bg-background border border-destructive text-destructive text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-destructive hover:text-background transition-all disabled:opacity-50"
                                        style={FONT_MONO}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(viewingKyc.id, "approve")}
                                        disabled={!!processingId}
                                        className="px-10 py-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/80 transition-all disabled:opacity-50"
                                        style={FONT_MONO}
                                    >
                                        Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
