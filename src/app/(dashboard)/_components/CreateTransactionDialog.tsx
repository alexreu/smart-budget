"use client";

import { CategoryPicker } from "./CategoryPicker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DateToUTCDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
    CreateTransactionSchemaType,
    createTransactionSchema,
} from "@/schemas/transactions";
import { TransactionType } from "@/sdk/transactions";
import { useCreateTransaction } from "@/sdk/transactions/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateTransactionDialogProps = {
    trigger: ReactNode;
    type: TransactionType;
};

export const CreateTransactionDialog = ({
    trigger,
    type,
}: CreateTransactionDialogProps) => {
    const [open, setOpen] = useState(false);

    const form = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            amount: 0,
            category: undefined,
            date: new Date(),
            description: "",
        },
    });

    useEffect(() => {
        form.setValue("type", type);
    }, [form, type]);

    const handleCategoryChange = useCallback(
        (category: string) => {
            form.setValue("category", category);
        },
        [form],
    );

    const queryClient = useQueryClient();

    const { mutate: createTransaction, isPending } = useCreateTransaction({
        onSuccess: () => {
            toast.success("Transaction created successfully 🎉", {
                id: "create-transaction",
            });
            form.reset({
                amount: 0,
                category: undefined,
                date: new Date(),
                description: "",
            });

            queryClient.invalidateQueries({
                queryKey: ["overview"],
            });
            setOpen(false);
        },
        onError: () => {
            toast.error("Something went wrong ❌", {
                id: "create-transaction",
            });
        },
    });

    const onSubmit = useCallback(
        (data: CreateTransactionSchemaType) => {
            toast.loading("Creating transaction...", {
                id: "create-transaction",
            });

            createTransaction({
                ...data,
                date: DateToUTCDate(data.date),
            });
        },
        [createTransaction],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create a new{" "}
                        <span
                            className={cn(
                                "font-bold mx-1",
                                type === "income"
                                    ? "text-primary"
                                    : "text-destructive",
                            )}
                        >
                            {type === "income" ? "income" : "expense"}
                        </span>{" "}
                        transaction
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-4"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input defaultValue="" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction description (optionnal)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount </FormLabel>
                                    <FormControl>
                                        <Input
                                            defaultValue={0}
                                            type="number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction amount (required)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-between gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Category </FormLabel>
                                        <FormControl>
                                            <CategoryPicker
                                                type={type}
                                                onChange={handleCategoryChange}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Select a category for this
                                            transaction
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-[200px] pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP",
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select a category for this
                                            transaction
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="secondary"
                                    onClick={() => form.reset()}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending}>
                                {isPending && (
                                    <Loader2 className="animate-spin" />
                                )}
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
