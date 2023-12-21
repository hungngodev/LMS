import { FC, ReactNode } from "react";

export const Blockquote: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<blockquote className="mt-6 border-l-2 pl-6 italic">
			{children}
		</blockquote>
	);
};
