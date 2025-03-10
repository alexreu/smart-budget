"use server";

import { Route } from "@/enum/route";
import { TimeframeEnum } from "@/enum/timeframe";
import prisma from "@/lib/prisma";
import { getHistoryDataSchema } from "@/schemas/history";
import { Timeframe } from "@/sdk/history";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";

export type GetHistoryPeriodsActionType = Awaited<
    ReturnType<typeof GetHistoryPeriodsAction>
>;

export async function GetHistoryPeriodsAction() {
    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    const results = await prisma.monthHistory.findMany({
        where: {
            userId: user.id,
        },
        select: {
            year: true,
        },
        distinct: ["year"],
        orderBy: {
            year: "asc",
        },
    });

    const years = results.map((result) => result.year);

    if (years.length === 0) {
        return [new Date().getFullYear()];
    }

    return years;
}

export type GetHistoryDataActionType = Awaited<
    ReturnType<typeof GetHistoryDataAction>
>;

export async function GetHistoryDataAction({
    timeframe,
    year,
    month,
}: {
    timeframe: Timeframe;
    year: number;
    month: number;
}) {
    const parsedBody = getHistoryDataSchema.safeParse({
        timeframe,
        year,
        month,
    });

    if (!parsedBody.success) {
        throw parsedBody.error.message;
    }

    const user = await currentUser();

    if (!user) {
        redirect(Route.SignIn);
    }

    switch (timeframe) {
        case TimeframeEnum.YEAR:
            return GetYearHistoryDataAction({ userId: user.id, year });
        case TimeframeEnum.MONTH:
            return GetMonthHistoryDataAction({ userId: user.id, year, month });
    }
}

type HistoryData = {
    expense: number;
    income: number;
    month: number;
    year: number;
    day?: number;
};

async function GetYearHistoryDataAction({
    userId,
    year,
}: {
    userId: string;
    year: number;
}) {
    const results = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: {
            userId,
            year,
        },
        _sum: {
            expense: true,
            income: true,
        },
        orderBy: {
            month: "asc",
        },
    });

    if (results.length === 0 || !results) return [];

    const historyData: HistoryData[] = [];

    const monthMap = new Map();
    results.forEach((result) => {
        monthMap.set(result.month, {
            expense: result._sum.expense || 0,
            income: result._sum.income || 0,
        });
    });

    for (let i = 0; i < 12; i++) {
        const monthData = monthMap.get(i) || { expense: 0, income: 0 };

        historyData.push({
            month: i,
            year,
            expense: monthData.expense,
            income: monthData.income,
        });
    }

    return historyData;
}

async function GetMonthHistoryDataAction({
    userId,
    year,
    month,
}: {
    userId: string;
    year: number;
    month: number;
}) {
    const results = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: {
            userId,
            year,
            month,
        },
        _sum: {
            expense: true,
            income: true,
        },
        orderBy: {
            day: "asc",
        },
    });

    console.log({ results, year, month });

    if (results.length === 0 || !results) return [];

    const historyData: HistoryData[] = [];
    const daysInMonth = getDaysInMonth(new Date(year, month));

    const dayMap = new Map();
    results.forEach((result) => {
        dayMap.set(result.day, {
            expense: result._sum.expense || 0,
            income: result._sum.income || 0,
        });
    });

    for (let i = 0; i < daysInMonth; i++) {
        const dayData = dayMap.get(i) || { expense: 0, income: 0 };

        historyData.push({
            day: i,
            month,
            year,
            expense: dayData.expense,
            income: dayData.income,
        });
    }

    return historyData;
}
