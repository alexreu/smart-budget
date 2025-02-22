import { CreateCategoryAction } from "@/actions/categories";
import { CreateCategorySchemaType } from "@/schemas/categories";
import { Category } from "@prisma/client";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

export const useCreateCategory = (
    options?: Omit<
        UseMutationOptions<Category, Error, CreateCategorySchemaType, unknown>,
        "mutationFn"
    >,
) => {
    return useMutation({
        mutationFn: CreateCategoryAction,
        ...options,
    });
};
