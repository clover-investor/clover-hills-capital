"use client";

import { useState, useEffect } from "react";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function AdminPlans() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        min_deposit: "",
        daily_roi: "",
        duration_days: "",
        features: "Daily Payouts, Capital Returned"
    });
    const [saving, setSaving] = useState(false);

    const fetchPlans = async () => {
        try {
            const res = await fetch("/api/plans");
            if (res.ok) {
                const json = await res.json();
                setPlans(json.plans || []);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPlans();
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: formData.name,
                min_deposit: Number(formData.min_deposit),
                daily_roi: Number(formData.daily_roi),
                duration_days: Number(formData.duration_days),
                features: formData.features.split(",").map(f => f.trim())
            };

            const res = await fetch("/api/admin/plans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", newPlan: payload })
            });

            if (res.ok) {
                setFormData({ name: "", min_deposit: "", daily_roi: "", duration_days: "", features: "Daily Payouts, Capital Returned" });
                fetchPlans();
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Confirm deletion of this plan?")) return;
        try {
            const res = await fetch("/api/admin/plans", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "delete", planId: id })
            });
            if (res.ok) fetchPlans();
        } catch {
            // silent
        }
    };

    return (
        <div className="space-y-10" style={FONT_SANS}>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--border-light)] pb-8 gap-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                        Investment Plans
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        Manage <em>Plans.</em>
                    </h1>
                </div>
                <button onClick={handleRefresh} className="px-8 py-4 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all" style={FONT_MONO}>
                    {refreshing ? "Refreshing…" : "Refresh Plans"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Create Plan Form */}
                <div className="lg:col-span-1 space-y-8">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-foreground font-bold" style={FONT_MONO}>01 — Create New Plan</h3>
                    <form onSubmit={handleCreate} className="space-y-6 border border-[var(--border-light)] p-8 bg-background">
                        <div>
                            <label className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2 block" style={FONT_MONO}>Plan Name</label>
                            <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-[var(--border-light)] bg-background text-sm focus:outline-none focus:border-foreground" placeholder="e.g. ALPHA" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2 block" style={FONT_MONO}>Min Deposit ($)</label>
                                <input required type="number" step="0.01" value={formData.min_deposit} onChange={(e) => setFormData({ ...formData, min_deposit: e.target.value })} className="w-full px-4 py-3 border border-[var(--border-light)] bg-background text-sm font-mono" />
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2 block" style={FONT_MONO}>Daily Yield (%)</label>
                                <input required type="number" step="0.01" value={formData.daily_roi} onChange={(e) => setFormData({ ...formData, daily_roi: e.target.value })} className="w-full px-4 py-3 border border-[var(--border-light)] bg-background text-sm font-mono" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2 block" style={FONT_MONO}>Duration (Days)</label>
                            <input required type="number" value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })} className="w-full px-4 py-3 border border-[var(--border-light)] bg-background text-sm font-mono" />
                        </div>
                        <div>
                            <label className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2 block" style={FONT_MONO}>Features</label>
                            <textarea value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className="w-full px-4 py-3 border border-[var(--border-light)] bg-background text-[11px] focus:outline-none focus:border-foreground" rows={3}></textarea>
                        </div>
                        <button type="submit" disabled={saving} className="w-full py-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-foreground/80 transition-all disabled:opacity-50" style={FONT_MONO}>
                            {saving ? "Saving…" : "Save Plan"}
                        </button>
                    </form>
                </div>

                {/* Existing Plans */}
                <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-foreground font-bold" style={FONT_MONO}>02 — Active Plans</h3>
                    {loading ? (
                        <div className="py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse" style={FONT_MONO}>Loading plans…</div>
                    ) : plans.length === 0 ? (
                        <div className="border border-dashed border-[var(--border-light)] p-20 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>No active plans found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)] border border-[var(--border-light)]">
                            {plans.map((plan) => (
                                <div key={plan.id} className="bg-background p-8 flex flex-col justify-between group">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-3xl font-light text-foreground" style={FONT_DISPLAY}>{plan.name}</h4>
                                            <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-bold" style={FONT_MONO}>ID: {plan.id.substring(0, 6)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 border-y border-[var(--border-light)] py-4">
                                            <div><p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-1" style={FONT_MONO}>Min</p><p className="text-sm font-bold" style={FONT_MONO}>${plan.min_deposit}</p></div>
                                            <div><p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-1" style={FONT_MONO}>Yield</p><p className="text-sm font-bold text-[var(--gold)]" style={FONT_MONO}>{plan.daily_roi}%</p></div>
                                            <div><p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mb-1" style={FONT_MONO}>Term</p><p className="text-sm font-bold" style={FONT_MONO}>{plan.duration_days}D</p></div>
                                        </div>
                                        <div className="space-y-2">
                                            {plan.features?.map((f: string, i: number) => (
                                                <p key={i} className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground" style={FONT_MONO}>— {f}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(plan.id)} className="mt-10 py-4 border border-[var(--border-light)] text-[9px] uppercase tracking-[0.3em] font-bold text-muted-foreground hover:text-destructive hover:border-destructive transition-all" style={FONT_MONO}>
                                        Delete Plan
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
