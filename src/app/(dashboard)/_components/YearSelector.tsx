import { GetHistoryPeriodsActionType } from "@/actions/history";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Period } from "@/sdk/history";

type YearSelectorProps = {
    period: Period;
    setPeriod: (period: Period) => void;
    years: GetHistoryPeriodsActionType;
};

export const YearSelector = ({
    period,
    setPeriod,
    years,
}: YearSelectorProps) => {
    return (
        <Select
            value={period.year.toString()}
            onValueChange={(value) =>
                setPeriod({ ...period, year: parseInt(value) })
            }
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
