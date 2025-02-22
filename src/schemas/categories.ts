import { TransactionTypeEnum } from "@/sdk/transactions";
import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1).max(20),
    icon: z.string().max(20),
    type: z.nativeEnum(TransactionTypeEnum),
});

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>;
