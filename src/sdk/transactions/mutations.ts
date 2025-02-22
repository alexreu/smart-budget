import { CreateTransactionAction } from "@/actions/transactions";
import { CreateTransactionSchemaType } from "@/schemas/transactions";
import { MonthHistory, Transaction, YearHistory } from "@prisma/client";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

type CreateTransactionResponse = [Transaction, MonthHistory, YearHistory];

export const useCreateTransaction = (
    options?: Omit<
        UseMutationOptions<
            CreateTransactionResponse,
            Error,
            CreateTransactionSchemaType,
            unknown
        >,
        "mutationFn"
    >,
) => {
    return useMutation({
        mutationFn: CreateTransactionAction,
        ...options,
    });
};
