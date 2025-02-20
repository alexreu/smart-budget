import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    TypographyH1,
    TypographyH2,
    TypographyH3,
} from "@/components/ui/typography";
import { Route } from "@/enum/route";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function WizardPage() {
    const user = await currentUser();

    return (
        <div className="container flex flex-col max-w-2xl items-center justify-between gap-4">
            <div className="text-center">
                <TypographyH1 className="text-3xl">
                    Welcome,{" "}
                    <span className="ml-2 font-bold text-primary">
                        {user?.firstName} ! 👋🏻
                    </span>
                </TypographyH1>
                <TypographyH2 className="mt-4 text-muted-foreground">
                    Let&apos;s get started by setting up your currency.
                </TypographyH2>
                <TypographyH3 className="mt-4 text-muted-foreground text-sm">
                    You can change this setting as anytime later.
                </TypographyH3>
            </div>
            <Separator />
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Currency</CardTitle>
                    <CardDescription>
                        Select the currency you want to use.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CurrencyComboBox />
                </CardContent>
            </Card>
            <Separator />
            <Button className="w-full" asChild>
                <Link href={Route.Dashboard}>
                    I&apos;m ready to get started ✅
                </Link>
            </Button>
            <div className="mt-8">
                <Logo />
            </div>
        </div>
    );
}
