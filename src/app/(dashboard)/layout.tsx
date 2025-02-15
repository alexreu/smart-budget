import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar />
            <main className="relative flex h-screen w-full flex-col p-8">
                <SidebarTrigger />
                <div className="w-full">{children}</div>
            </main>
        </SidebarProvider>
    );
}
