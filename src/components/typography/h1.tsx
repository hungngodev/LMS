import { FC, ReactNode } from "react";

export const Header1: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			{children}
		</h1>
	);
};
