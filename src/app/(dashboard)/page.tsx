import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
    const user = await currentUser();

    return (
        <div className="h-full bg-background">
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <div className="flex items-center gap-2"></div>
                </div>
            </div>
        </div>
    );
}
