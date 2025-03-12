import { HistoryPeriodSelector } from "./HistoryPerdioSelector";
import { SkeletonWrapper } from "@/components/shared/SkeletonWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { GetCurrencyFormatter } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Period, Timeframe } from "@/sdk/history";
import { useHistoryData } from "@/sdk/history/queries";
import { UserSettings } from "@prisma/client";
import { useCallback, useMemo, useState } from "react";
import CountUp from "react-countup";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

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

    const { data: historyData, isFetching: historyDataIsFetching } =
        useHistoryData({
            timeframe,
            year: period.year,
            month: period.month,
        });

    const isDataHistoryAvailable = historyData && historyData.length > 0;

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
                <CardContent>
                    <SkeletonWrapper isLoading={historyDataIsFetching}>
                        {isDataHistoryAvailable ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    height={300}
                                    barCategoryGap={5}
                                    data={historyData}
                                >
                                    <defs>
                                        <linearGradient
                                            id="income"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0"
                                                stopColor="	#2563eb"
                                                stopOpacity={1}
                                            />
                                            <stop
                                                offset="1"
                                                stopColor="	#2563eb"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="expense"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0"
                                                stopColor="	#ef4444"
                                                stopOpacity={1}
                                            />
                                            <stop
                                                offset="1"
                                                stopColor="	#ef4444"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="5 5"
                                        strokeOpacity={0.2}
                                    />
                                    <XAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        padding={{ left: 5, right: 5 }}
                                        dataKey={(data) => {
                                            const { year, month, day } = data;
                                            const date = new Date(
                                                year,
                                                month,
                                                day || 1,
                                            );
                                            if (timeframe === "year") {
                                                return date.toLocaleString(
                                                    "default",
                                                    {
                                                        month: "long",
                                                    },
                                                );
                                            }

                                            return date.toLocaleString(
                                                "default",
                                                {
                                                    day: "2-digit",
                                                },
                                            );
                                        }}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Bar
                                        dataKey="income"
                                        label="Income"
                                        fill="url(#income)"
                                        radius={4}
                                        className="cursor-pointer"
                                    />
                                    <Bar
                                        dataKey="expense"
                                        label="  "
                                        fill="url(#expense)"
                                        radius={4}
                                        className="cursor-pointer"
                                    />
                                    <Tooltip
                                        cursor={{ opacity: 0.1 }}
                                        content={(props) => (
                                            <CustomTooltip
                                                formatter={formatter}
                                                {...props}
                                            />
                                        )}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Card className="flex h-[300px] flex-col items-center justify-center">
                                <TypographyP>
                                    No data for the selected period
                                </TypographyP>
                                <TypographyP className="text-sm text-muted-foreground">
                                    Try selecting a different period or adding
                                    new transactions
                                </TypographyP>
                            </Card>
                        )}
                    </SkeletonWrapper>
                </CardContent>
            </Card>
        </div>
    );
};

const CustomTooltip = ({ active, payload, formatter }: any) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0].payload;
    const { expense, income } = data;

    return (
        <div className="min-w-[300px] rounded border bg-background p-4">
            <TooltipRow
                formatter={formatter}
                label="Expense"
                value={expense}
                bgColor="bg-destructive"
                textColor="text-destructive"
            />
            <TooltipRow
                formatter={formatter}
                label="Income"
                value={income}
                bgColor="bg-primary"
                textColor="text-primary"
            />
            <TooltipRow
                formatter={formatter}
                label="Balance"
                value={income - expense}
                bgColor="bg-muted-foreground"
                textColor="text-muted-foreground"
            />
        </div>
    );
};

const TooltipRow = ({
    label,
    value,
    formatter,
    bgColor,
    textColor,
}: {
    formatter: Intl.NumberFormat;
    label: string;
    value: number;
    bgColor: string;
    textColor: string;
}) => {
    const formattingFn = useCallback(
        (value: number) => formatter.format(value),
        [formatter],
    );

    return (
        <div className="flex items-center justify-between gap-2">
            <div className={cn("h-4 w-4 rounded-full", bgColor)} />
            <div className="flex w-full justify-between ">
                <TypographyP className="text-sm text-muted-foreground">
                    {label}
                </TypographyP>
                <div className={cn("text-sm font-bold", textColor)}>
                    <CountUp
                        preserveValue
                        duration={0.5}
                        end={value}
                        decimals={0}
                        formattingFn={formattingFn}
                        className="text-sm"
                    />
                </div>
            </div>
        </div>
    );
};
