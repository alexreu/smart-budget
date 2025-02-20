"use client";

import { Button } from "@/components/ui/button";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    return (
        <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme scheme"
        >
            {theme === "dark" ? <Sun /> : <MoonStar />}
        </Button>
    );
};
