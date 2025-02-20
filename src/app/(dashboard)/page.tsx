import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
    const user = await currentUser();

    return (
        <div className="h-full bg-background">
            <div className="flex flex-col gap-2">
                <TypographyH1 className="tracking-wide">
                    Hi, {user?.firstName} 👋🏻
                </TypographyH1>
                <TypographyMuted className="tracking-wide">
                    Here&apos;s what happenning with your money. Let&apos;s
                    manage your expense
                </TypographyMuted>
            </div>
        </div>
    );
}
