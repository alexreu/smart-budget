"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Period } from "@/sdk/history";

type MonthSelectorProps = {
    period: Period;
    setPeriod: (period: Period) => void;
};

export const MonthSelector = ({ period, setPeriod }: MonthSelectorProps) => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
        <Select
            value={period.month.toString()}
            onValueChange={(value) =>
                setPeriod({ ...period, month: parseInt(value) })
            }
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent>
                {months.map((month) => {
                    const monthName = new Date(0, month).toLocaleString(
                        "default",
                        { month: "long" },
                    );
                    return (
                        <SelectItem key={month} value={month.toString()}>
                            {monthName}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
};
