"use client";

import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories } from "@/sdk/categories";
import { TransactionType } from "@/sdk/transactions";
import { Category } from "@prisma/client";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type CategoryPickerProps = {
    type: TransactionType;
    onChange: (category: string) => void;
};

export const CategoryPicker = ({ type, onChange }: CategoryPickerProps) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        if (!value) return;
        onChange(value);
    }, [value, onChange]);

    const { data: categories = [], isLoading } = useCategories({ type });

    const selectedCategory = useMemo(
        () => categories?.find((category: Category) => category.name === value),
        [categories, value],
    );

    const onSuccess = useCallback(
        (category: Category) => {
            setValue(category.name);
            setOpen(false);
        },
        [setValue, setOpen],
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="animate-spin" />}
                    {selectedCategory ? (
                        <CategoryRow category={selectedCategory} />
                    ) : (
                        "Select a category"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
                <Command onSubmit={(e) => e.preventDefault()}>
                    <CommandInput placeholder="Search category" />
                    <CreateCategoryDialog type={type} onSuccess={onSuccess} />
                    <CommandEmpty>
                        <p className="text-sm font-medium">
                            No categories found
                        </p>
                    </CommandEmpty>

                    <CommandGroup>
                        <CommandList>
                            {categories.map((category, index) => (
                                <CommandItem
                                    key={index}
                                    value={category.name}
                                    onSelect={() => {
                                        setValue(category.name);
                                        setOpen(false);
                                    }}
                                >
                                    <CategoryRow category={category} />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const CategoryRow = ({ category }: { category: Category }) => {
    return (
        <div className="flex items-center gap-2">
            <span role="img">{category.icon}</span>
            <span>{category.name}</span>
        </div>
    );
};
