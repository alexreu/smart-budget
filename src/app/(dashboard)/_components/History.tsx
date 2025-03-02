import { HistoryPeriodSelector } from "./HistoryPerdioSelector";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/typography";
import { GetCurrencyFormatter } from "@/lib/helpers";
import { Period, Timeframe } from "@/sdk/history";
import { useHistoryData } from "@/sdk/history/queries";
import { UserSettings } from "@prisma/client";
import { useMemo, useState } from "react";

type HistoryProps = {
    userSettings: UserSettings;
};

export const History = ({ userSettings }: HistoryProps) => {
    const [timeframe, setTimeframe] = useState<Timeframe>("month");
    const [period, setPeriod] = useState<Period>({
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
    });

    const formatter = useMemo(() => {
        return GetCurrencyFormatter(userSettings.currency);
    }, [userSettings]);

    const { data: historyData } = useHistoryData({
        timeframe,
        year: period.year,
        month: period.month,
    });

    console.log(historyData);

    return (
        <div>
            <TypographyH2>History</TypographyH2>
            <Card className="col-span-12 mt-2 w-full">
                <CardHeader>
                    <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
                        <HistoryPeriodSelector
                            period={period}
                            setPeriod={setPeriod}
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                        />
                        <div className="flex h-10 gap-2">
                            <Badge
                                variant="outline"
                                className="flex items-center gap-2 text-sm rounded-3xl"
                            >
                                <div className="h-4 w-4 rounded-full bg-primary" />
                                <span className="text-xs font-normal">
                                    Income
                                </span>
                            </Badge>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-2 text-sm rounded-3xl"
                            >
                                <div className="h-4 w-4 rounded-full bg-destructive" />
                                <span className="text-xs font-normal">
                                    Expense
                                </span>
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
};
