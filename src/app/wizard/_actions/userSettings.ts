"use server";

import { Route } from "@/enum/route";
import prisma from "@/lib/prisma";
import { UserSettingsSchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
    const parsedBody = UserSettingsSchema.safeParse({ currency });

    if (!parsedBody.success) {
        throw parsedBody.error;
    }

    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.id,
        },
        data: {
            currency,
        },
    });

    return userSettings;
}
