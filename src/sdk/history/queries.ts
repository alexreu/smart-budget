import { Timeframe } from "./types";
import {
    GetHistoryDataAction,
    GetHistoryDataActionType,
    GetHistoryPeriodsAction,
    GetHistoryPeriodsActionType,
} from "@/actions/history";
import { useQuery } from "@tanstack/react-query";

export function useHistoryPeriods() {
    return useQuery<GetHistoryPeriodsActionType>({
        queryKey: ["overview", "history", "periods"],
        queryFn: async () => {
            const periods = await GetHistoryPeriodsAction();
            return periods;
        },
    });
}

export function useHistoryData({
    timeframe,
    year,
    month,
}: {
    timeframe: Timeframe;
    year: number;
    month: number;
}) {
    return useQuery<GetHistoryDataActionType>({
        queryKey: ["overview", "history", "data"],
        queryFn: async () => {
            const data = await GetHistoryDataAction({
                timeframe,
                year,
                month,
            });
            return data;
        },
    });
}
