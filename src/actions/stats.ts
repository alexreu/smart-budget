"use server";

import { Route } from "@/enum/route";
import prisma from "@/lib/prisma";
import { OverviewSchemaType, overviewSchema } from "@/schemas/overview";
import { TransactionTypeEnum } from "@/sdk/transactions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type GetUserBalanceActionType = Awaited<
    ReturnType<typeof GetUserBalanceAction>
>;

export async function GetUserBalanceAction({ from, to }: OverviewSchemaType) {
    const parsedBody = overviewSchema.safeParse({ from, to });

    if (!parsedBody.success) {
        throw parsedBody.error.message;
    }

    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const balance = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
            userId: user.id,
            date: {
                gte: from,
                lte: to,
            },
        },
        _sum: {
            amount: true,
        },
    });

    return {
        expenses:
            balance.find((item) => item.type === TransactionTypeEnum.EXPENSE)
                ?._sum.amount || 0,
        income:
            balance.find((item) => item.type === TransactionTypeEnum.INCOME)
                ?._sum.amount || 0,
    };
}

export type GetUserCategoriesStatsActionType = Awaited<
    ReturnType<typeof GetUserCategoriesStatsAction>
>;

export async function GetUserCategoriesStatsAction({
    from,
    to,
}: OverviewSchemaType) {
    const parsedBody = overviewSchema.safeParse({ from, to });

    if (!parsedBody.success) {
        throw parsedBody.error.message;
    }

    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const categoriesStats = await prisma.transaction.groupBy({
        by: ["categoryId", "type"],
        where: {
            userId: user.id,
            date: { gte: from, lte: to },
        },
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: "desc",
            },
        },
    });

    const categories = await prisma.category.findMany({
        where: {
            id: { in: categoriesStats.map((item) => item.categoryId) },
        },
    });

    const categoriesStatsWithInfo = categoriesStats.map((item) => {
        const category = categories.find(
            (category) => category.id === item.categoryId,
        );
        return {
            ...item,
            name: category?.name,
            icon: category?.icon,
        };
    });

    return categoriesStatsWithInfo;
}
