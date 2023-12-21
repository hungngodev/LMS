import Image from "next/image";
import { FC } from "react";

export const Logo: FC = () => {
	return (
		<>
			<Image src="/logo.png" width={50} height={50} alt="Seamless Tech" />
		</>
	);
};
