"use client";

import { useEffect, useRef } from "react";

export default function TradingViewWidget() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scriptId = "tv-script";
        if (document.getElementById(scriptId)) {
            // Re-initialize if script exists but widget is gone
            if (typeof window !== "undefined" && (window as any).TradingView) {
                renderWidget();
            }
            return;
        };

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = renderWidget;

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        function renderWidget() {
            if (typeof window !== "undefined" && (window as any).TradingView) {
                new (window as any).TradingView.widget({
                    autosize: true,
                    symbol: "BINANCE:BTCUSDT",
                    interval: "60",
                    timezone: "Etc/UTC",
                    theme: "light",
                    style: "1",
                    locale: "en",
                    enable_publishing: false,
                    backgroundColor: "#ffffff",
                    gridColor: "#f0f0f0",
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: false,
                    container_id: "tv-container",
                    width: "100%",
                    height: "100%"
                });
            }
        }
    }, []);

    return (
        <div
            className="h-[650px] w-full border border-[var(--border-light)] bg-background relative z-0"
            ref={containerRef}
            style={{ borderRadius: "0 !important" }}
        >
            <div id="tv-container" className="h-full w-full" />
        </div>
    );
}
