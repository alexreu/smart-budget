"use client";

import {
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
    Breadcrumb as ShadcnBreadcrumb,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export const Breadcrumb = () => {
    const pathname = usePathname();

    // Skip rendering breadcrumb on home page
    if (pathname === "/") return null;

    // Generate breadcrumb items from pathname
    const pathSegments = pathname
        .split("/")
        .filter((segment) => segment !== "");

    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

        return {
            label,
            path,
        };
    });

    return (
        <ShadcnBreadcrumb className="flex items-center">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link
                        href="/"
                        className="hover:text-primary transition-colors"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                {breadcrumbItems.map((item, index) => (
                    <Fragment key={item.path}>
                        <BreadcrumbItem>
                            {index === breadcrumbItems.length - 1 ? (
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.path}
                                    className="hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbItems.length - 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </ShadcnBreadcrumb>
    );
};
