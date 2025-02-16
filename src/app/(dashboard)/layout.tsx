import { Appbar } from "@/components/Appbar";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar />
            <main className="relative flex h-screen w-full flex-col">
                <Appbar />
                <div className="w-full p-8">{children}</div>
            </main>
        </SidebarProvider>
    );
}
