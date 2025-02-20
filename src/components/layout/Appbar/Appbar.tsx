"use client";

import { Button } from "../../ui/button";
import { useSidebar } from "../../ui/sidebar";
import { Breadcrumb } from "../Breadcrumb";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

export const Appbar = () => {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="w-full flex justify-between p-4 bg-sidebar border-b border-b-border shadow-sm">
            <div className="flex gap-4 justify-start">
                <Button
                    variant="ghost"
                    onClick={toggleSidebar}
                    className="hover:cursor-pointer"
                    title="Toggle sidebar menu"
                >
                    <Menu />
                </Button>
                <Breadcrumb />
            </div>
            <div className="flex gap-4 justify-end">
                <ThemeSwitcher />
                <UserButton />
            </div>
        </div>
    );
};
