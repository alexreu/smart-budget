import { TimeframeEnum } from "@/enum/timeframe";
import { z } from "zod";

export const getHistoryDataSchema = z.object({
    timeframe: z.enum([TimeframeEnum.MONTH, TimeframeEnum.YEAR]),
    month: z.coerce.number().min(1).max(11).default(new Date().getMonth()),
    year: z.coerce.number().min(1900).max(3000),
});
