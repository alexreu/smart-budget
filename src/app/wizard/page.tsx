"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    TypographyH1,
    TypographyH2,
    TypographyH3,
} from "@/components/ui/typography";
import { Route } from "@/enum/route";
import { Currencies } from "@/lib/currencies";
import { UserSettingsSchema, UserSettingsType } from "@/schemas/userSettings";
import { useCreateUserSettings, useUserSettings } from "@/sdk/user-settings";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function WizardPage() {
    const { user } = useUser();
    const form = useForm<UserSettingsType>({
        resolver: zodResolver(UserSettingsSchema),
        defaultValues: {
            currency: Currencies[0].value,
            userBalance: 0,
        },
        mode: "onChange",
    });

    const { data: userSettings, isFetching, refetch } = useUserSettings();
    const { mutate: updateUserSettings, isPending } = useCreateUserSettings({
        onSuccess: () => {
            refetch();
            toast.success("User settings updated successfully 🎉", {
                id: "update-user-settings",
            });
        },
        onError: (error) => {
            console.error(error);
            toast.error("Something went wrong ❌", {
                id: "update-user-settings",
            });
        },
    });

    const handleSubmit = (data: UserSettingsType) => {
        toast.loading("Updating user settings...", {
            id: "update-user-settings",
        });
        updateUserSettings(data);
    };

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
            <Card className="w-full pt-6">
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-4"
                            onSubmit={form.handleSubmit(handleSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <CurrencyComboBox
                                                value={field.value}
                                                onChange={field.onChange}
                                                isPending={isPending}
                                                isFetching={isFetching}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Select the currency you want to use.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="userBalance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Default balance</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Default balance"
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Your current account balance
                                            (required)
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isPending || !form.formState.isValid}
                            >
                                {isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Save
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Separator />
            <Link href={Route.Dashboard} className="w-full" passHref>
                <Button
                    className="w-full"
                    disabled={isPending || !userSettings}
                >
                    I&apos;m ready to get started ✅
                </Button>
            </Link>
            <div className="mt-8">
                <Logo />
            </div>
        </div>
    );
}
