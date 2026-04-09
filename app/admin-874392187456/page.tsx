"use client";

import { useState, useEffect } from "react";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const [editingUser, setEditingUser] = useState<any>(null);
    const [editFormData, setEditFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const json = await res.json();
                setUsers(json.users || []);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setEditFormData({
            status: user.status,
            total_balance: user.total_balance,
            available_balance: user.available_balance,
            invested: user.invested,
            earnings: user.earnings,
        });
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/users/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: editingUser.id,
                    updates: {
                        status: editFormData.status,
                        total_balance: Number(editFormData.total_balance),
                        available_balance: Number(editFormData.available_balance),
                        invested: Number(editFormData.invested),
                        earnings: Number(editFormData.earnings),
                    }
                }),
            });
            if (res.ok) {
                setEditingUser(null);
                handleRefresh();
            }
        } finally {
            setSaving(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10" style={FONT_SANS}>
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-[var(--border-light)] pb-8 gap-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                        User Management
                    </p>
                    <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                        Manage <em>Users.</em>
                    </h1>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-8 py-4 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all disabled:opacity-50"
                    style={FONT_MONO}
                >
                    {refreshing ? "Refreshing…" : "Refresh Users"}
                </button>
            </div>

            <div className="border border-[var(--border-light)] bg-background">
                <div className="p-6 border-b border-[var(--border-light)] bg-muted">
                    <div className="relative max-w-sm">
                        <input
                            type="text"
                            placeholder="Search users..."
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
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Status</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Total / Avail</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold">Invested / Earnings</th>
                                <th className="px-8 py-5 text-[9px] uppercase tracking-[0.4em] text-muted-foreground font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                            {loading ? (
                                <tr><td colSpan={5} className="px-8 py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground animate-pulse" style={FONT_MONO}>Loading users…</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="px-8 py-20 text-center text-[10px] uppercase tracking-widest text-muted-foreground" style={FONT_MONO}>No registered users found.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-muted/50 transition-all">
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground" style={FONT_SANS}>{user.full_name}</p>
                                            <p className="text-[9px] text-muted-foreground mt-1" style={FONT_MONO}>{user.email}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] uppercase tracking-[0.3em] font-black ${user.status === 'active' ? 'text-[var(--gold)]' :
                                                user.status === 'pending' ? 'text-muted-foreground' :
                                                    'text-destructive'
                                                }`} style={FONT_MONO}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[11px]" style={FONT_MONO}>
                                            <span className="text-foreground">$ {Number(user.total_balance).toFixed(2)}</span>
                                            <span className="mx-2 text-muted-foreground">/</span>
                                            <span className="text-muted-foreground">$ {Number(user.available_balance).toFixed(2)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-[11px]" style={FONT_MONO}>
                                            <span className="text-foreground">$ {Number(user.invested).toFixed(2)}</span>
                                            <span className="mx-2 text-muted-foreground">/</span>
                                            <span className="text-[var(--gold)]">$ {Number(user.earnings).toFixed(2)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-[9px] uppercase tracking-[0.3em] font-bold text-foreground hover:underline underline-offset-4 transition-all"
                                                style={FONT_MONO}
                                            >
                                                Edit Balance
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingUser && (
                <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-6" style={FONT_SANS}>
                    <div className="bg-background w-full max-w-xl border border-foreground p-10 space-y-10">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground mb-2" style={FONT_MONO}>Edit Users Balance</p>
                            <h3 className="text-2xl font-light text-foreground" style={FONT_DISPLAY}>{editingUser.full_name}</h3>
                        </div>

                        <form onSubmit={handleSaveUser} className="space-y-8">
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Account Status</label>
                                <select
                                    value={editFormData.status}
                                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                    className="w-full px-5 py-4 border border-[var(--border-light)] bg-background text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-foreground"
                                    style={FONT_MONO}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Total Balance ($)</label>
                                    <input type="number" step="0.01" value={editFormData.total_balance} onChange={(e) => setEditFormData({ ...editFormData, total_balance: e.target.value })} className="w-full px-5 py-4 border border-[var(--border-light)] bg-background text-sm font-mono" />
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Avail. Balance ($)</label>
                                    <input type="number" step="0.01" value={editFormData.available_balance} onChange={(e) => setEditFormData({ ...editFormData, available_balance: e.target.value })} className="w-full px-5 py-4 border border-[var(--border-light)] bg-background text-sm font-mono" />
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Invested Plan ($)</label>
                                    <input type="number" step="0.01" value={editFormData.invested} onChange={(e) => setEditFormData({ ...editFormData, invested: e.target.value })} className="w-full px-5 py-4 border border-[var(--border-light)] bg-background text-sm font-mono" />
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Earnings ($)</label>
                                    <input type="number" step="0.01" value={editFormData.earnings} onChange={(e) => setEditFormData({ ...editFormData, earnings: e.target.value })} className="w-full px-5 py-4 border border-[var(--border-light)] bg-background text-sm font-mono text-[var(--gold)]" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-[var(--border-light)]">
                                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-5 border border-[var(--border-light)] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-muted transition-all" style={FONT_MONO}>Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 py-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/80 transition-all disabled:opacity-50" style={FONT_MONO}>
                                    {saving ? "Saving…" : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
