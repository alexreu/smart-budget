"use client";

import { SkeletonWrapper } from "../shared/SkeletonWrapper";
import { CurrencySelect } from "./CurrencySelect";

type CurrencyComboBoxProps = {
    value: string;
    onChange: (currencyValue: string) => void;
    isPending: boolean;
    isFetching: boolean;
};

export const CurrencyComboBox = ({
    value,
    onChange,
    isPending,
    isFetching,
}: CurrencyComboBoxProps) => {
    return (
        <SkeletonWrapper isLoading={isFetching}>
            <CurrencySelect
                value={value}
                onChange={onChange}
                isDisabled={isPending}
            />
        </SkeletonWrapper>
    );
};
