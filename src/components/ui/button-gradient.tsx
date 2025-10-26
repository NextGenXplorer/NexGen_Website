import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonGradientProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    icon?: React.ReactNode;
    asChild?: boolean;
}

export function ButtonGradient({
    className,
    label,
    icon,
    children,
    ...props
}: ButtonGradientProps) {
    return (
        <Button
            className={cn(
                "relative h-10 px-6 overflow-hidden",
                "bg-zinc-900 dark:bg-zinc-100",
                "transition-all duration-200",
                "group",
                className
            )}
            {...props}
        >
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500",
                    "opacity-40 group-hover:opacity-80",
                    "blur transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <span className="text-white dark:text-zinc-900">
                    {children || label}
                </span>
                {icon || <ArrowUpRight className="w-3.5 h-3.5 text-white/90 dark:text-zinc-900/90" />}
            </div>
        </Button>
    );
}
