import { FC, ReactNode } from "react";

export const Header5: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<h5 className="scroll-m-20 text-md font-semibold tracking-tight">
			{children}
		</h5>
	);
};
