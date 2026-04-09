import DashboardShell from "@/components/layout/DashboardShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: auth, error } = await supabase.auth.getUser();

    if (error || !auth?.user) {
        redirect("/login");
    }

    const { data: user } = await supabase.from("users").select("*").eq("id", auth.user.id).single();

    if (user && user.status === 'pending') {
        redirect("/pending");
    }

    return (
        <DashboardShell userName={user?.full_name} userId={user?.id}>
            {children}
        </DashboardShell>
    );
}
