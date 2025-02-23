"use client";

import { CategoryStatsCard } from "./CategoryStatsCard";
import { SkeletonWrapper } from "@/components/shared/SkeletonWrapper";
import { GetCurrencyFormatter } from "@/lib/helpers";
import { useUserCategoriesStats } from "@/sdk/stats";
import { TransactionTypeEnum } from "@/sdk/transactions";
import { UserSettings } from "@prisma/client";
import { useMemo } from "react";

type CategoriesStatsProps = {
    userSettings: UserSettings;
    from: Date;
    to: Date;
};

export const CategoriesStats = ({
    userSettings,
    from,
    to,
}: CategoriesStatsProps) => {
    const { data: categoriesStats, isLoading } = useUserCategoriesStats({
        from,
        to,
    });

    const formatter = useMemo(() => {
        return GetCurrencyFormatter(userSettings.currency);
    }, [userSettings.currency]);

    return (
        <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
            <SkeletonWrapper isLoading={isLoading}>
                <CategoryStatsCard
                    formatter={formatter}
                    type={TransactionTypeEnum.INCOME}
                    data={categoriesStats ?? []}
                />
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={isLoading}>
                <CategoryStatsCard
                    formatter={formatter}
                    type={TransactionTypeEnum.EXPENSE}
                    data={categoriesStats ?? []}
                />
            </SkeletonWrapper>
        </div>
    );
};
