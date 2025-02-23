import { GetUserCategoriesStatsActionType } from "@/actions/stats";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyP } from "@/components/ui/typography";
import { TransactionTypeEnum } from "@/sdk/transactions";

type CategoryStatsCardProps = {
    formatter: Intl.NumberFormat;
    type: TransactionTypeEnum;
    data: GetUserCategoriesStatsActionType;
};

export const CategoryStatsCard = ({
    formatter,
    type,
    data,
}: CategoryStatsCardProps) => {
    const filteredData = data.filter((item) => item.type === type);
    const total = filteredData.reduce(
        (acc, item) => acc + (item._sum?.amount ?? 0),
        0,
    );

    return (
        <Card className="h-80 w-full col-span-6">
            <CardHeader>
                <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
                    {type === TransactionTypeEnum.INCOME
                        ? "Income"
                        : "Expenses"}{" "}
                    by category
                </CardTitle>
                <div className="flex items-center justify-between gap-2">
                    {filteredData.length === 0 && (
                        <div className="flex h-60 w-full flex-col items-center justify-center">
                            No data for the selected period
                            <TypographyP className="text-muted-foreground">
                                Try selecting a different period or try adding
                                new{" "}
                                {type === TransactionTypeEnum.INCOME
                                    ? "income"
                                    : "expense"}
                            </TypographyP>
                        </div>
                    )}

                    {filteredData.length > 0 && (
                        <ScrollArea className="h-60 w-full px-4">
                            <div className="flex w-full flex-col gap-4 p-4">
                                {filteredData.map((item) => {
                                    const amount = item._sum?.amount ?? 0;
                                    const percentage =
                                        (amount * 100) / (total || amount);

                                    return (
                                        <div
                                            key={item.categoryId}
                                            className="flex flex-col gap-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center">
                                                    {item.icon} {item.name}
                                                    <span className="ml-2 text-xs text-muted-foreground">
                                                        ({percentage.toFixed(0)}
                                                        %)
                                                    </span>
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatter.format(amount)}
                                                </span>
                                            </div>
                                            <Progress
                                                value={percentage}
                                                indicator={
                                                    type ===
                                                    TransactionTypeEnum.INCOME
                                                        ? "bg-primary"
                                                        : "bg-muted-foreground"
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </CardHeader>
        </Card>
    );
};
