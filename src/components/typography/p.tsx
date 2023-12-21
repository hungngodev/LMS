import { cn } from "@/utils/cn";
import { FC, ReactNode } from "react";

export const Paragraph: FC<{ children: ReactNode; className?: string }> = ({
	children,
	className
}) => {
	return (
		<p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
			{children}
		</p>
	);
};
