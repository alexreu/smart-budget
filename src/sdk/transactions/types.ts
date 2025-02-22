import { TransactionTypeEnum } from "./enum";

export type TransactionType =
    (typeof TransactionTypeEnum)[keyof typeof TransactionTypeEnum];
