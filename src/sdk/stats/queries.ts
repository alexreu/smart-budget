import {
    GetUserBalanceAction,
    GetUserBalanceActionType,
    GetUserCategoriesStatsAction,
    GetUserCategoriesStatsActionType,
} from "@/actions/stats";
import { OverviewSchemaType } from "@/schemas/overview";
import { useQuery } from "@tanstack/react-query";

export function useUserBalance({ from, to }: OverviewSchemaType) {
    return useQuery<GetUserBalanceActionType>({
        queryKey: ["overview", "stats", "user-balance", from, to],
        queryFn: async () => {
            const balance = await GetUserBalanceAction({ from, to });
            return balance;
        },
    });
}

export function useUserCategoriesStats({ from, to }: OverviewSchemaType) {
    return useQuery<GetUserCategoriesStatsActionType>({
        queryKey: ["overview", "stats", "user-categories-stats", from, to],
        queryFn: async () => {
            const stats = await GetUserCategoriesStatsAction({
                from,
                to,
            });

            return stats;
        },
    });
}
