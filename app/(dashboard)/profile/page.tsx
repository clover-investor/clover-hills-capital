"use client";

import { useState, useEffect } from "react";
import { useAlert } from "@/components/ui/AlertProvider";
import { createClient } from "@/utils/supabase/client";
import Spinner from "@/components/ui/Spinner";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        full_name: "",
    });
    const { showSuccess, showError } = useAlert();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (authUser) {
                    const { data: profile, error } = await supabase.from("users").select("*").eq("id", authUser.id).single();
                    if (profile) {
                        setUser(profile);
                        setFormData({
                            full_name: profile.full_name || "",
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { error } = await supabase
                    .from("users")
                    .update({ full_name: formData.full_name })
                    .eq("id", authUser.id);

                if (error) throw error;
                showSuccess("Your profile has been updated.", "Saved");
            }
        } catch (err: any) {
            showError(err.message || "Failed to update profile", "Error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Spinner label="Loading Profile Data…" />;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12" style={FONT_SANS}>
            <div className="w-full mb-8 flex justify-center">
                <img src="/logoImages/clover banner transp.png" alt="Clover Banner" className="max-h-32 object-contain" />
            </div>
            <div className="border-b border-[var(--border-light)] pb-8">
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                    Account Settings
                </p>
                <h1 className="text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                    My <em>Profile.</em>
                </h1>
            </div>

            <div className="border border-[var(--border-light)] bg-background p-10 space-y-10">
                <h2 className="text-[10px] uppercase tracking-[0.4em] text-foreground font-bold" style={FONT_MONO}>01 — Personal Information</h2>

                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Full Name</label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 border border-[var(--border-light)] bg-background text-sm focus:outline-none focus:border-foreground"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Account ID</label>
                            <input
                                type="text"
                                disabled
                                className="w-full px-5 py-4 border border-[var(--border-light)] bg-muted text-muted-foreground font-mono text-[10px]"
                                value={user?.id?.substring(0, 16).toUpperCase() || ""}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3" style={FONT_MONO}>Email Address</label>
                        <input
                            type="email"
                            disabled
                            className="w-full px-5 py-4 border border-[var(--border-light)] bg-muted text-muted-foreground text-sm"
                            value={user?.email || ""}
                        />
                        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-3" style={FONT_MONO}>
                            Email cannot be changed. Please contact support if needed.
                        </p>
                    </div>

                    <div className="pt-8 border-t border-[var(--border-light)]">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-10 py-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground/80 transition-all disabled:opacity-50"
                            style={FONT_MONO}
                        >
                            {submitting ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}

