"use client";

import { StatsCard } from "./StatsCard";
import { SkeletonWrapper } from "@/components/shared/SkeletonWrapper";
import { GetCurrencyFormatter } from "@/lib/helpers";
import { useUserBalance } from "@/sdk/stats";
import { UserSettings } from "@prisma/client";
import { Shapes, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";

type StatsCardProps = {
    userSettings: UserSettings;
    from: Date;
    to: Date;
};

export const StatsCards = ({ userSettings, from, to }: StatsCardProps) => {
    const { data, isLoading } = useUserBalance({ from, to });

    const balanceFormater = useMemo(() => {
        return GetCurrencyFormatter(userSettings.currency);
    }, [userSettings.currency]);

    const income = data?.income ?? 0;
    const expenses = data?.expenses ?? 0;
    const defaultBalance = userSettings.userBalance ?? 0;

    const balance = income - expenses + defaultBalance;

    return (
        <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
            <SkeletonWrapper isLoading={isLoading}>
                <StatsCard
                    formatter={balanceFormater}
                    value={income}
                    title="Income"
                    icon={
                        <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 bg-muted text-primary" />
                    }
                />
                <StatsCard
                    formatter={balanceFormater}
                    value={expenses}
                    title="Expenses"
                    icon={
                        <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 bg-muted text-destructive" />
                    }
                />
                <StatsCard
                    formatter={balanceFormater}
                    value={defaultBalance}
                    title="Start Balance"
                    icon={
                        <Shapes className="h-12 w-12 items-center rounded-lg p-2 bg-muted text-muted-foreground" />
                    }
                />
                <StatsCard
                    formatter={balanceFormater}
                    value={balance}
                    title="Current Balance"
                    icon={
                        <Wallet className="h-12 w-12 items-center rounded-lg p-2 bg-muted text-muted-foreground" />
                    }
                />
            </SkeletonWrapper>
        </div>
    );
};
