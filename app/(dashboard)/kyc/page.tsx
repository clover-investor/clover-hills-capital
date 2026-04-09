"use client";

import { useState, useRef, useEffect } from "react";
import { useAlert } from "@/components/ui/AlertProvider";
import imageCompression from "browser-image-compression";
import Spinner from "@/components/ui/Spinner";

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_DISPLAY = { fontFamily: "var(--font-cormorant), Georgia, serif" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

const compressionOptions = {
    maxSizeMB: 0.5,          // Compress to max 500KB
    maxWidthOrHeight: 1920,  // Max resolution
    useWebWorker: true,
};

export default function KycPage() {
    const [kycStatus, setKycStatus] = useState<string | null>(null);
    const [statusLoading, setStatusLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [idFile, setIdFile] = useState<File | null>(null);
    const [selfieFile, setSelfieFile] = useState<File | null>(null);
    const idInputRef = useRef<HTMLInputElement>(null);
    const selfieInputRef = useRef<HTMLInputElement>(null);
    const { showSuccess, showError } = useAlert();


    useEffect(() => {
        fetch("/api/kyc")
            .then(r => r.json())
            .then(({ kyc }) => {
                if (kyc?.status) setKycStatus(kyc.status);
            })
            .finally(() => setStatusLoading(false));
    }, []);

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (f: File | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Only compress images (not PDFs)
        if (file.type.startsWith("image/")) {
            setCompressing(true);
            try {
                const compressed = await imageCompression(file, compressionOptions);
                // Create a new File with the original name
                const compressedFile = new File([compressed], file.name, { type: compressed.type });
                setter(compressedFile);
            } catch {
                setter(file); // fallback to original if compression fails
            } finally {
                setCompressing(false);
            }
        } else {
            setter(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idFile || !selfieFile) return;
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("document", idFile);
            formData.append("selfie", selfieFile);

            const res = await fetch("/api/kyc", {
                method: "POST",
                body: formData,
            });

            const json = await res.json();

            if (res.ok) {
                setKycStatus("pending");
                showSuccess("Documents submitted! We will review them within 48 hours.", "Submitted");
            } else {
                showError(json.error || "Upload failed. Please try again.", "Error");
            }
        } catch {
            showError("Something went wrong. Please check your connection and try again.", "Error");
        } finally {
            setSubmitting(false);
        }
    };

    if (statusLoading) {
        return <Spinner label="Loading your verification status…" />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12" style={FONT_SANS}>
            <div className="w-full mb-8 flex justify-center">
                <img src="/logoImages/clover banner transp.png" alt="Clover Banner" className="max-h-32 object-contain" />
            </div>
            <div className="border-b border-[var(--border-light)] pb-6 sm:pb-8">
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3" style={FONT_MONO}>
                    Account Verification
                </p>
                <h1 className="text-3xl sm:text-4xl font-light text-foreground" style={FONT_DISPLAY}>
                    Identity <em>Verification.</em>
                </h1>
            </div>

            <div className="border border-[var(--border-light)] bg-background p-6 sm:p-10">
                {kycStatus === "pending" ? (
                    <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-16 h-16 border-2 border-dashed border-[var(--gold)] animate-pulse" />
                        <h2 className="text-2xl font-light text-foreground uppercase tracking-widest" style={FONT_DISPLAY}>Under Review</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose max-w-sm" style={FONT_MONO}>
                            Your documents have been submitted. Our team will review them within 48 hours and notify you by email.
                        </p>
                    </div>
                ) : kycStatus === "approved" ? (
                    <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-16 h-16 bg-[var(--gold)]" />
                        <h2 className="text-2xl font-light text-foreground uppercase tracking-widest" style={FONT_DISPLAY}>Verified ✓</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose max-w-sm" style={FONT_MONO}>
                            Your identity has been verified. You have full access to all features.
                        </p>
                    </div>
                ) : kycStatus === "rejected" ? (
                    <div className="py-16 sm:py-20 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-16 h-16 border-2 border-destructive" />
                        <h2 className="text-2xl font-light text-foreground uppercase tracking-widest" style={FONT_DISPLAY}>Verification Failed</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest leading-loose max-w-sm" style={FONT_MONO}>
                            Your documents were rejected. Please re-submit with clearer photos.
                        </p>
                        <button
                            onClick={() => setKycStatus(null)}
                            className="px-8 py-4 border border-foreground text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-all"
                            style={FONT_MONO}
                        >
                            Re-Submit Documents
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
                        <div className="p-6 sm:p-8 border border-[var(--border-light)] bg-muted flex items-start sm:items-center gap-5 sm:gap-8">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-foreground flex items-center justify-center shrink-0">
                                <span className="text-background text-lg font-bold" style={FONT_MONO}>i</span>
                            </div>
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground mb-1" style={FONT_MONO}>Why do we need this?</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">Clover Hills is required by law to verify the identity of all users before they can withdraw funds. Your documents are stored securely and never shared.</p>
                            </div>
                        </div>

                        {compressing && (
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center animate-pulse" style={FONT_MONO}>
                                Compressing image…
                            </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                            {/* Government ID Upload */}
                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase tracking-[0.3em] text-foreground font-bold" style={FONT_MONO}>
                                    01 — Government ID
                                </label>
                                <button
                                    type="button"
                                    onClick={() => idInputRef.current?.click()}
                                    className={`w-full border border-dashed p-8 sm:p-12 text-center hover:bg-muted transition-all ${idFile ? 'border-[var(--gold)]' : 'border-[var(--border-light)]'}`}
                                >
                                    <div className="w-8 h-8 border border-muted-foreground mx-auto mb-4" />
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground font-bold">
                                        {idFile ? `✓ ${idFile.name}` : "Tap to Upload ID"}
                                    </p>
                                    <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mt-2">Passport, Driver's Licence or National ID</p>
                                    <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mt-1">PNG / JPG / PDF — Auto-compressed</p>
                                </button>
                                <input
                                    ref={idInputRef}
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setIdFile)}
                                />
                            </div>

                            {/* Selfie Upload */}
                            <div className="space-y-4">
                                <label className="block text-[10px] uppercase tracking-[0.3em] text-foreground font-bold" style={FONT_MONO}>
                                    02 — Selfie Photo
                                </label>
                                <button
                                    type="button"
                                    onClick={() => selfieInputRef.current?.click()}
                                    className={`w-full border border-dashed p-8 sm:p-12 text-center hover:bg-muted transition-all ${selfieFile ? 'border-[var(--gold)]' : 'border-[var(--border-light)]'}`}
                                >
                                    <div className="w-8 h-8 border border-muted-foreground mx-auto mb-4" />
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-foreground font-bold">
                                        {selfieFile ? `✓ ${selfieFile.name}` : "Tap to Upload Selfie"}
                                    </p>
                                    <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mt-2">A clear photo of your face</p>
                                    <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground mt-1">PNG / JPG — Auto-compressed</p>
                                </button>
                                <input
                                    ref={selfieInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, setSelfieFile)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || compressing || !idFile || !selfieFile}
                            className="w-full py-5 sm:py-6 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-foreground/80 transition-all disabled:opacity-50"
                            style={FONT_MONO}
                        >
                            {submitting ? "Uploading…" :
                                compressing ? "Compressing Images…" :
                                    (!idFile || !selfieFile) ? "Please Upload Both Documents" :
                                        "Submit for Verification"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
