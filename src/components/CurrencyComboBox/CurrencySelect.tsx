import { OptionList } from "./OptionsList";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Currencies } from "@/lib/currencies";
import { useState } from "react";

interface CurrencySelectProps {
    value?: string;
    onChange: (value: string) => void;
    isDisabled?: boolean;
}

export function CurrencySelect({
    value,
    onChange,
    isDisabled,
}: CurrencySelectProps) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const selectedCurrency = Currencies.find(
        (currency) => currency.value === value,
    );

    const renderTrigger = () => (
        <Button
            variant="outline"
            className="w-full justify-start"
            disabled={isDisabled}
        >
            {selectedCurrency ? selectedCurrency.label : "Set currency"}
        </Button>
    );

    const renderOptionList = () => (
        <OptionList
            onSelect={(value) => {
                onChange(value);
                setOpen(false);
            }}
        />
    );

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>{renderTrigger()}</PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    {renderOptionList()}
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{renderTrigger()}</DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">{renderOptionList()}</div>
            </DrawerContent>
        </Drawer>
    );
}
