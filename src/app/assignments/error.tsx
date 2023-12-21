"use client";
import { Header4 } from "@/components/typography/h4";
import { Paragraph } from "@/components/typography/p";
import { useEffect } from "react";

export default function Error({
	error,
	_reset
}: {
	error: Error;
	_reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="w-full h-80 border-2 border-dashed flex flex-col justify-center items-center">
			<Header4>Something went wrong</Header4>
			<Paragraph>Pleas try again later</Paragraph>
		</div>
	);
}
