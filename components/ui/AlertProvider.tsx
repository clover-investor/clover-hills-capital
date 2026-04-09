"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AlertType = "success" | "error" | "info" | "warning";

interface Alert {
    id: string;
    message: string;
    title?: string;
    type: AlertType;
}

interface AlertContextType {
    showAlert: (message: string, type?: AlertType, title?: string) => void;
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    hideAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error("useAlert must be used within AlertProvider");
    return context;
};

const FONT_MONO = { fontFamily: "var(--font-mono)" };
const FONT_SANS = { fontFamily: "var(--font-syne)" };

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);

    const showAlert = useCallback((message: string, type: AlertType = "info", title?: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setAlerts((prev) => [...prev, { id, message, title, type }]);
        setTimeout(() => hideAlert(id), 5000);
    }, []);

    const showSuccess = useCallback((message: string, title?: string) => showAlert(message, "success", title), [showAlert]);
    const showError = useCallback((message: string, title?: string) => showAlert(message, "error", title), [showAlert]);
    const showInfo = useCallback((message: string, title?: string) => showAlert(message, "info", title), [showAlert]);
    const showWarning = useCallback((message: string, title?: string) => showAlert(message, "warning", title), [showAlert]);

    const hideAlert = useCallback((id: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, showSuccess, showError, showInfo, showWarning, hideAlert }}>

            {children}
            <div className="fixed top-6 right-6 z-[9999] pointer-events-none space-y-4 max-w-sm w-full">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            className="pointer-events-auto bg-background border-2 border-foreground p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
                            style={FONT_SANS}
                        >
                            {/* Type Indicator Bar */}
                            <div className={`absolute top-0 left-0 w-2 h-full ${alert.type === "success" ? "bg-[var(--gold)]" :
                                alert.type === "error" ? "bg-destructive" :
                                    alert.type === "warning" ? "bg-orange-500" : "bg-foreground"
                                }`} />

                            <div className="flex flex-col gap-1 ml-2">
                                {alert.title && (
                                    <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-foreground" style={FONT_MONO}>
                                        {alert.title} —
                                    </span>
                                )}
                                <p className="text-xs font-bold leading-relaxed">{alert.message}</p>
                            </div>

                            <button
                                onClick={() => hideAlert(alert.id)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </AlertContext.Provider>
    );
};
