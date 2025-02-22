"use server";

import { Route } from "@/enum/route";
import prisma from "@/lib/prisma";
import {
    CreateCategorySchemaType,
    createCategorySchema,
} from "@/schemas/categories";
import { TransactionType } from "@/sdk/transactions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GetCategoriesAction(type: TransactionType) {
    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const categories = await prisma.category.findMany({
        where: {
            type,
            userId: user.id,
        },
        orderBy: {
            name: "asc",
        },
    });

    return categories;
}

export async function CreateCategoryAction(category: CreateCategorySchemaType) {
    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }
    const parsedBody = createCategorySchema.safeParse(category);

    if (!parsedBody.success) {
        throw new Error("bad request");
    }

    const { name, icon, type } = parsedBody.data;

    const createdCategory = await prisma.category.create({
        data: {
            name,
            icon,
            type,
            userId: user.id,
        },
    });

    return createdCategory;
}
