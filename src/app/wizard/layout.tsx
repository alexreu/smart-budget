import { CheckUserSettingsAction } from "@/actions/user-settings";
import { Route } from "@/enum/route";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function WizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, hasSettings] = await Promise.all([
        currentUser(),
        CheckUserSettingsAction(),
    ]);

    if (!user) {
        redirect(Route.SignIn);
    }

    if (hasSettings) {
        redirect(Route.Dashboard);
    }
    return (
        <div className="relative flex flex-col h-screen w-full items-center justify-center">
            {children}
        </div>
    );
}
