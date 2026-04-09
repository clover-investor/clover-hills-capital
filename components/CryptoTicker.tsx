"use client";

import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

type Coin = {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
};

export default function CryptoTicker({ compact = false }: { compact?: boolean }) {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCoins() {
            try {
                const res = await fetch(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
                );
                if (res.ok) {
                    const data = await res.json();
                    setCoins(data);
                }
            } catch (err) {
                console.error("Failed to fetch crypto prices", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCoins();
        const interval = setInterval(fetchCoins, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className={`w-full bg-muted border-b border-border ${compact ? 'py-4' : 'py-5'} animate-pulse`}></div>;
    }

    if (coins.length === 0) return null;

    return (
        <div className={`w-full overflow-hidden bg-muted border-b border-border ${compact ? 'py-2' : 'py-3'}`}>
            <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]">
                {/* Render coins 3 times to ensure a completely seamless loop without gaps */}
                {[...coins, ...coins, ...coins].map((coin, index) => (
                    <div key={`${coin.id}-${index}`} className="flex items-center gap-2 px-8 border-r border-border/50 min-w-max">
                        <span className="font-bold text-foreground uppercase">{coin.symbol}</span>
                        <span className="text-muted-foreground ml-1">
                            ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-sm flex items-center font-bold ml-2 ${coin.price_change_percentage_24h >= 0 ? "text-primary" : "text-destructive"}`}>
                            {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
