"use client";

import { Logo } from "../Logo";
import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { ChartPie, CreditCard, HandCoins, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: <Home />,
    },
    {
        title: "Income",
        url: "/income",
        icon: <HandCoins />,
    },
    {
        title: "Expenses",
        url: "/expenses",
        icon: <CreditCard />,
    },
    {
        title: "Budget",
        url: "/budget",
        icon: <ChartPie />,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: <Settings />,
    },
];

export const Sidebar = () => {
    const { open } = useSidebar();
    const pathname = usePathname();

    return (
        <ShadcnSidebar collapsible="icon">
            <SidebarHeader>
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.div
                            key="logo"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <Logo size="sm" className="text-primary" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="icon"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            <ChartPie
                                className="text-primary m-auto h-6 w-6"
                                aria-hidden="true"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarItems.map(({ url, icon, title }) => (
                                <SidebarMenuItem key={url}>
                                    <SidebarMenuButton
                                        isActive={pathname === url}
                                        asChild
                                    >
                                        <Link href={url}>
                                            {icon}
                                            <span>{title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </ShadcnSidebar>
    );
};
