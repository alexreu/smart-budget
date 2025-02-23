"use server";

import { Route } from "@/enum/route";
import prisma from "@/lib/prisma";
import { UserSettingsSchema, UserSettingsType } from "@/schemas/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GetUserSettingsAction() {
    const user = await currentUser();

    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user?.id,
        },
    });

    return userSettings;
}

export async function UpdateUserSettingsAction(data: UserSettingsType) {
    const parsedBody = UserSettingsSchema.safeParse(data);

    if (!parsedBody.success) {
        throw parsedBody.error;
    }

    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const { currency, userBalance } = parsedBody.data;

    const userSettings = await prisma.userSettings.update({
        where: {
            userId: user.id,
        },
        data: {
            currency,
            userBalance,
        },
    });

    return userSettings;
}

export async function CreateUserSettingsAction(data: UserSettingsType) {
    const parsedBody = UserSettingsSchema.safeParse(data);

    if (!parsedBody.success) {
        throw parsedBody.error;
    }

    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const { currency, userBalance } = parsedBody.data;

    const userSettings = await prisma.userSettings.create({
        data: {
            userId: user.id,
            currency,
            userBalance,
        },
    });

    return userSettings;
}

export async function CheckUserSettingsAction() {
    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
        },
    });

    return !!userSettings;
}
