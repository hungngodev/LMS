import { FC, ReactNode } from "react";

export const Header4: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
			{children}
		</h4>
	);
};
