import { FC, ReactNode } from "react";

export const Muted: FC<{ children: ReactNode }> = ({ children }) => {
	return <p className="text-sm text-muted-foreground">{children}</p>;
};
