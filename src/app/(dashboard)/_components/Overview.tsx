"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TypographyH2 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { format, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

type OverviewProps = {
    userSettings: UserSettings;
};

export const Overview = ({ userSettings }: OverviewProps) => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <TypographyH2>Overview</TypographyH2>
            </div>
            <div className="grid gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !dateRange && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                        {format(dateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={(ranges) => {
                                const { from, to } = ranges;
                                console.log(ranges);
                                // setDateRange(ranges);
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};
