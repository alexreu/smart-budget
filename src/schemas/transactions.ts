import { TransactionTypeEnum } from "@/sdk/transactions";
import { z } from "zod";

export const createTransactionSchema = z.object({
    amount: z.coerce.number().positive().multipleOf(0.01),
    description: z.string().optional(),
    date: z.date(),
    category: z.string(),
    type: z.nativeEnum(TransactionTypeEnum),
});

export type CreateTransactionSchemaType = z.infer<
    typeof createTransactionSchema
>;
