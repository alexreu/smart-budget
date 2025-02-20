import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Currencies } from "@/lib/currencies";

interface OptionListProps {
    onSelect: (value: string) => void;
}

export function OptionList({ onSelect }: OptionListProps) {
    return (
        <Command>
            <CommandInput placeholder="Filter currency..." />
            <CommandList>
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup>
                    {Currencies.map((currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={onSelect}
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
