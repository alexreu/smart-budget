import { Route } from "@/enum/route";
import prisma from "@/lib/prisma";
import { TransactionTypeEnum } from "@/sdk/transactions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const { searchParams } = new URL(request.url);
    const paramType = searchParams.get("type");

    const validator = z.nativeEnum(TransactionTypeEnum).nullable();
    const queryParams = validator.safeParse(paramType);

    if (!queryParams.success) {
        return Response.json(
            { error: "Invalid transaction type" },
            { status: 400 },
        );
    }

    const type = queryParams.data;

    const categories = await prisma.category.findMany({
        where: {
            userId: user.id,
            ...(type && { type }), // include type in the filter if it exists
        },
        orderBy: {
            name: "asc",
        },
    });

    return Response.json(categories);
}
