import { GetCategoriesAction } from "@/actions/categories";
import { TransactionType } from "@/sdk/transactions";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

type UseCategoriesParams = {
    type: TransactionType;
};

export function useCategories({ type }: UseCategoriesParams) {
    return useQuery<Category[]>({
        queryKey: ["categories", type],
        queryFn: async () => {
            const categories = await GetCategoriesAction(type);
            return categories;
        },
    });
}
