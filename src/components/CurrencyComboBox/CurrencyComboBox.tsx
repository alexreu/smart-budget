"use client";

import { SkeletonWrapper } from "../shared/SkeletonWrapper";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies, Currency } from "@/lib/currencies";
import { UserSettings } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as React from "react";
import { useEffect } from "react";
import { toast } from "sonner";

export const CurrencyComboBox = () => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
        null,
    );

    const { data: userSettings, isFetching } = useQuery<UserSettings>({
        queryKey: ["user-settings"],
        queryFn: async () => {
            const response = await axios.get("/api/user-settings");
            return response.data;
        },
    });

    useEffect(() => {
        if (!userSettings) return;

        const userCurrency = Currencies.find(
            (currency) => currency.value === userSettings.currency,
        );

        if (userCurrency) {
            setSelectedOption(userCurrency);
        }
    }, [userSettings]);

    const mutation = useMutation({
        mutationFn: UpdateUserCurrency,
        onSuccess: (data: UserSettings) => {
            toast.success("Currency updated successfully 🎉", {
                id: "update-currency",
            });

            setSelectedOption(
                Currencies.find(
                    (currency) => currency.value === data.currency,
                ) ?? null,
            );
        },
        onError: (error) => {
            console.error(error);
            toast.error("Something went wrong ❌", {
                id: "update-currency",
            });
        },
    });

    const selectOption = React.useCallback(
        (currency: Currency | null) => {
            if (!currency) {
                toast.error("Please select a currency");
                return;
            }

            toast.loading("Updating currency...", {
                id: "update-currency",
            });

            mutation.mutate(currency.value);
        },
        [mutation],
    );

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={isFetching}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            disabled={mutation.isPending}
                        >
                            {selectedOption ? (
                                <>{selectedOption.label}</>
                            ) : (
                                <>Set currency</>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <OptionList
                            setOpen={setOpen}
                            setSelectedOption={selectOption}
                        />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        );
    }

    return (
        <SkeletonWrapper isLoading={isFetching}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={mutation.isPending}
                    >
                        {selectedOption ? (
                            <>{selectedOption.label}</>
                        ) : (
                            <>Set currency</>
                        )}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <OptionList
                            setOpen={setOpen}
                            setSelectedOption={selectOption}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    );
};

function OptionList({
    setOpen,
    setSelectedOption,
}: {
    setOpen: (open: boolean) => void;
    setSelectedOption: (option: Currency | null) => void;
}) {
    return (
        <Command>
            <CommandInput placeholder="Filter currency..." />
            <CommandList>
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup>
                    {Currencies.map((currency: Currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={(value) => {
                                setSelectedOption(
                                    Currencies.find(
                                        (currency) => currency.value === value,
                                    ) || null,
                                );
                                setOpen(false);
                            }}
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
