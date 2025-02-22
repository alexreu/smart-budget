"use server";

import { Route } from "@/enum/route";
import prisma from "@/lib/prisma";
import {
    CreateTransactionSchemaType,
    createTransactionSchema,
} from "@/schemas/transactions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransactionAction(
    transaction: CreateTransactionSchemaType,
) {
    const parsedBody = createTransactionSchema.safeParse(transaction);

    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message);
    }

    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const { category, amount, date, description, type } = parsedBody.data;

    const categoryRow = await prisma.category.findFirst({
        where: {
            userId: user.id,
            name: category,
        },
    });

    if (!categoryRow) {
        throw new Error("Category not found");
    }

    const createdTransaction = await prisma.$transaction([
        prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                date,
                description: description ?? "",
                type,
                categoryId: categoryRow.id,
            },
        }),
        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
            update: {
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
        }),
        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear(),
                },
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
            update: {
                income: type === "income" ? amount : 0,
                expense: type === "expense" ? amount : 0,
            },
        }),
    ]);

    return createdTransaction;
}
