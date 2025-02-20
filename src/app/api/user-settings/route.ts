import { Route } from "@/enum/route";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET() {
    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    let userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSettings) {
        userSettings = await prisma.userSettings.create({
            data: {
                userId: user.id,
                currency: "USD",
            },
        });
    }

    // Revalidate the path to ensure the user settings are updated
    revalidatePath("/");
    return Response.json(userSettings);
}
