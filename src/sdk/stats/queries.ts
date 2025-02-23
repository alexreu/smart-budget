import { GetUserBalanceAction } from "@/actions/stats";
import { OverviewSchemaType } from "@/schemas/overview";
import { useQuery } from "@tanstack/react-query";

export function useUserBalance({ from, to }: OverviewSchemaType) {
    return useQuery({
        queryKey: ["user-balance", from, to],
        queryFn: async () => {
            const balance = await GetUserBalanceAction({ from, to });
            return balance;
        },
    });
}
