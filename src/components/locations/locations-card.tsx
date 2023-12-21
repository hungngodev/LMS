import { AspectRatio } from "@/components/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Skeleton } from "@/components/skeleton";
import { Header3 } from "@/components/typography/h3";
import { Location0Schema } from "@/models/cms/location-0";
import { ArrowRightToLine } from "lucide-react";
import Image from "next/image";
import qs from "qs";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useQuery } from "react-query";
import { z } from "zod";
import { LocationDetail } from "./location-detail";

interface LocationCardProps {
	location: Location0Schema;
	setLocationId: Dispatch<SetStateAction<string | null>>;
}

const LocationCard: FC<LocationCardProps> = (props) => {
	return (
		<Card
			className="rounded-lg flex max-h-80 w-full hover:bg-muted"
			onClick={() => props.setLocationId(props.location.id)}
		>
			<div className="h-full w-80 relative">
				<AspectRatio ratio={5 / 4} className="bg-muted">
					<Image
						src="https://cdn.leonardo.ai/users/ff3b8a94-d4d5-4d40-b6a6-07261a0346e5/generations/f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b/variations/Default_illustration_of_a_learning_management_system_0_f1ff3ab4-23e9-438c-bac7-8ba6b0b11c6b_1.jpg"
						alt=""
						fill
						className="rouned-md object-cover"
					/>
				</AspectRatio>
			</div>
			<CardHeader className="flex flex-col w-full">
				<div className="flex w-full justify-between items-center">
					<CardTitle>
						<Header3>{props.location.name}</Header3>
					</CardTitle>
					<ArrowRightToLine className="w-7 h-7" />
				</div>
				<CardContent className="flex flex-col justify-between h-full">
					<div className="flex flex-wrap">
						{/* <div className="pr-2">
							{subject ? (
								<Badge variant="default">{subject.name}</Badge>
							) : (
								<Skeleton className="h-10 w-16 rounded-lg" />
							)}
						</div>
						<div className="pr-2">
							{location ? (
								<Badge variant="secondary">
									{location.name}
								</Badge>
							) : (
								<Skeleton className="h-10 w-16 rounded-lg" />
							)}
						</div> */}
					</div>
				</CardContent>
			</CardHeader>
		</Card>
	);
};

interface Props {}

const useLocations = () => {
	const endpoint = `/api/locations${qs.stringify(
		{ depth: 0, limit: 1000 },
		{ addQueryPrefix: true }
	)}`;
	const { data: locations, refetch } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		const body = await resp.json();
		return z.array(Location0Schema).parse(body.docs);
	});
	return {
		locations,
		refetch: async () => {
			await refetch();
		}
	};
};

export const LocationsCard: FC<Props> = (props) => {
	const { locations } = useLocations();
	const [viewing, setViewing] = useState<string | null>(null);
	return (
		<>
			<div className="grid gap-4 pt-8">
				{locations ? (
					locations.length > 0 ? (
						locations.map((location) => (
							<LocationCard
								key={location.id}
								location={location}
								setLocationId={setViewing}
							/>
						))
					) : (
						<div className="w-full h-80 border-2 border-dashed flex justify-center items-center text-lg">
							No locations
						</div>
					)
				) : (
					<Skeleton className="w-full h-80" />
				)}
			</div>
			{viewing && (
				<LocationDetail
					locationId={viewing}
					setLocationId={setViewing}
				/>
			)}
		</>
	);
};
