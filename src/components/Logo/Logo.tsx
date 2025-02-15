import { clsx } from "clsx";
import { ChartPie } from "lucide-react";
import Link from "next/link";
type LogoProps = {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
};

export const Logo = ({ size = "md", className }: LogoProps) => {
    const iconSizeMap = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-11 w-11",
        xl: "h-14 w-14",
    };

    const textSizeMap = {
        sm: "text-base",
        md: "text-lg",
        lg: "text-2xl",
        xl: "text-4xl",
    };

    return (
        <Link
            href="/"
            className={clsx(
                "flex items-center gap-2 transition-all duration-300 ease-in-out",
                className,
            )}
        >
            <ChartPie
                className={clsx(
                    "stroke stroke-primary stroke-[2.5]",
                    iconSizeMap[size],
                )}
            />
            <p className={clsx("text-primary font-bold", textSizeMap[size])}>
                SmartBudget
            </p>
        </Link>
    );
};
