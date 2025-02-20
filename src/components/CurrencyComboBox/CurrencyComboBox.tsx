"use client";

import { SkeletonWrapper } from "../shared/SkeletonWrapper";
import { CurrencySelect } from "./CurrencySelect";
import { useUpdateUserSettings, useUserSettings } from "@/sdk/user-settings";
import { toast } from "sonner";

export const CurrencyComboBox = () => {
    const { data: userSettings, isFetching, refetch } = useUserSettings();

    const mutation = useUpdateUserSettings({
        onSuccess: () => {
            refetch();
            toast.success("Currency updated successfully 🎉", {
                id: "update-currency",
            });
        },
        onError: (error) => {
            console.error(error);
            toast.error("Something went wrong ❌", {
                id: "update-currency",
            });
        },
    });

    const handleCurrencyChange = (currencyValue: string) => {
        if (!currencyValue) {
            toast.error("Please select a currency");
            return;
        }

        toast.loading("Updating currency...", {
            id: "update-currency",
        });

        mutation.mutate(currencyValue);
    };

    return (
        <SkeletonWrapper isLoading={isFetching}>
            <CurrencySelect
                value={userSettings?.currency}
                onChange={handleCurrencyChange}
                isDisabled={mutation.isPending}
            />
        </SkeletonWrapper>
    );
};
