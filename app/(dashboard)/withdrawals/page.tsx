import TransactionsPage from "../transactions/page";

export default function WithdrawalsPage() {
    return (
        <div>
            <div className="max-w-6xl mb-6">
                <h1 className="text-2xl font-bold text-foreground">Withdrawal History</h1>
                <p className="text-muted-foreground text-sm mb-4">You can view your withdrawal status by selecting 'Withdrawals' below.</p>
            </div>
            <TransactionsPage />
        </div>
    );
}
