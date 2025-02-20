import { CheckUserSettingsAction } from "../wizard/_actions/userSettings";
import { Appbar } from "@/components/layout/Appbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Route } from "@/enum/route";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const hasSettings = await CheckUserSettingsAction();

    if (!hasSettings) {
        redirect(Route.Wizard);
    }

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
