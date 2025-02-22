import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
    CreateCategorySchemaType,
    createCategorySchema,
} from "@/schemas/categories";
import { useCreateCategory } from "@/sdk/categories/mutations";
import { TransactionType, TransactionTypeEnum } from "@/sdk/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { CircleOff, CirclePlus, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CreateCategoryDialogProps = {
    type: TransactionType;
    onSuccess: (category: Category) => void;
};

export const CreateCategoryDialog = ({
    type,
    onSuccess,
}: CreateCategoryDialogProps) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            type,
        },
    });

    const { mutate: createCategory, isPending } = useCreateCategory({
        onSuccess: async (data: Category) => {
            setOpen(false);
            form.reset({
                type,
                name: "",
                icon: "",
            });
            toast.success(`Category ${data.name} created successfully 🎉`, {
                id: "create-category",
            });

            onSuccess(data);

            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            });

            setOpen(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Something went wrong ❌", {
                id: "create-category",
            });
        },
    });

    const onSubmit = useCallback(
        (data: CreateCategorySchemaType) => {
            toast.loading("Creating category...", {
                id: "create-category",
            });
            createCategory(data);
        },
        [createCategory],
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground"
                >
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Create category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create{" "}
                        <span
                            className={cn(
                                "m-1",
                                type === TransactionTypeEnum.INCOME
                                    ? "text-primary"
                                    : "text-destructive",
                            )}
                        >
                            {type}
                        </span>{" "}
                        category
                    </DialogTitle>
                    <DialogDescription>
                        Create a new category to group your transactions.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className="space-y-8"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input defaultValue="" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Category name (required)
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Popover modal>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="h-[100px] w-full"
                                                >
                                                    {form.watch("icon") ? (
                                                        <div className="flex flex-col items-center justify-center">
                                                            <span
                                                                className="text-5xl"
                                                                role="img"
                                                            >
                                                                {field.value}
                                                            </span>
                                                            <TypographyP className="!mt-0 text-muted-foreground">
                                                                Click to change
                                                            </TypographyP>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center">
                                                            <CircleOff
                                                                className="!h-12 !w-12"
                                                                strokeWidth={1}
                                                            />
                                                            <TypographyP className="!mt-0 text-muted-foreground">
                                                                Click to select
                                                            </TypographyP>
                                                        </div>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full">
                                                <EmojiPicker
                                                    theme={theme.theme as Theme}
                                                    onEmojiClick={(emoji) => {
                                                        field.onChange(
                                                            emoji.emoji,
                                                        );
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        This is how your category will appear in
                                        the app
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
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
