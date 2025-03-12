"use client";

import { MonthSelector } from "./MonthSelector";
import { YearSelector } from "./YearSelector";
import { SkeletonWrapper } from "@/components/shared/SkeletonWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeframeEnum } from "@/enum/timeframe";
import { Period, Timeframe } from "@/sdk/history";
import { useHistoryPeriods } from "@/sdk/history/queries";

type HistoryPeriodSelectorProps = {
    period: Period;
    timeframe: Timeframe;
    setPeriod: (period: Period) => void;
    setTimeframe: (timeframe: Timeframe) => void;
};

export const HistoryPeriodSelector = ({
    period,
    timeframe,
    setPeriod,
    setTimeframe,
}: HistoryPeriodSelectorProps) => {
    const { data: periods, isFetching } = useHistoryPeriods();
    return (
        <div className="flex flex-wrap items-center gap-4">
            <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
                <Tabs
                    value={timeframe}
                    onValueChange={(value) => setTimeframe(value as Timeframe)}
                >
                    <TabsList>
                        <TabsTrigger value={TimeframeEnum.YEAR}>
                            Year
                        </TabsTrigger>
                        <TabsTrigger value={TimeframeEnum.MONTH}>
                            Month
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </SkeletonWrapper>
            <div className="flex flex-wrap items-center gap-4">
                <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
                    <YearSelector
                        period={period}
                        setPeriod={setPeriod}
                        years={periods ?? []}
                    />
                </SkeletonWrapper>
                {timeframe === TimeframeEnum.MONTH && (
                    <SkeletonWrapper isLoading={isFetching} fullWidth={false}>
                        <MonthSelector period={period} setPeriod={setPeriod} />
                    </SkeletonWrapper>
                )}
            </div>
        </div>
    );
};
