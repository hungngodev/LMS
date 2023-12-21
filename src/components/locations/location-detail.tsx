import { Location0Schema } from "@/models/cms/location-0";
import qs from "qs";
import { Dispatch, FC, SetStateAction } from "react";
import { useQuery } from "react-query";
import { Sheet, SheetContent, SheetHeader } from "../sheet";
import { Skeleton } from "../skeleton";
import { Header2 } from "../typography/h2";

interface Props {
	locationId: string;
	setLocationId: Dispatch<SetStateAction<string | null>>;
}

const useLocation = (locationId: string) => {
	const endpoint = `/api/locations/${locationId}${qs.stringify(
		{ depth: 0 },
		{ addQueryPrefix: true }
	)}`;
	const { data: location } = useQuery(endpoint, async () => {
		const resp = await fetch(endpoint);
		return Location0Schema.parse(await resp.json());
	});
	return { location };
};

export const LocationDetail: FC<Props> = (props) => {
	const { location } = useLocation(props.locationId);

	return (
		<Sheet open={!!props.locationId}>
			<SheetContent
				position="right"
				size="xl"
				onClickOutside={() => props.setLocationId(null)}
				onClickClose={() => props.setLocationId(null)}
			>
				<SheetHeader className="max-w-xs">
					{location ? (
						<Header2>{location.name}</Header2>
					) : (
						<Skeleton className="w-full h-12 rounded-lg" />
					)}
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};
