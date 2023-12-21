"use client";

import { LocationsCard } from "@/components/locations/locations-card";
import { LocationsTable } from "@/components/locations/locations-table";
import { Skeleton } from "@/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { useAuth } from "@/hooks/use-auth";
import { User2Schema } from "@/models/cms/user-2";
import { ViewEnum } from "@/payload/models/view-enum";
import { getUserAllowedViews } from "@/payload/utils/get-user-allowed-views";
import { FC, useEffect, useState } from "react";

const useViews = (user: User2Schema | null) => {
	const [locationView, setLocationView] = useState<
		"card" | "table" | "both" | null
	>(null);
	useEffect(() => {
		if (!user) return;
		const views = getUserAllowedViews(user);
		// if user only has read permission
		if (
			views.has(ViewEnum["locations:table"]) &&
			views.has(ViewEnum["locations:card"])
		) {
			setLocationView("both");
		} else if (
			views.has(ViewEnum["locations:table"]) &&
			!views.has(ViewEnum["locations:card"])
		) {
			setLocationView("table");
		} else if (
			!views.has(ViewEnum["locations:table"]) &&
			views.has(ViewEnum["locations:card"])
		) {
			setLocationView("card");
		} else setLocationView(null);
	}, [user]);
	return { locationView, setLocationView };
};

const Locations: FC = () => {
	const { user } = useAuth();
	const { locationView } = useViews(user);

	if (!user)
		return (
			<div className="pt-8">
				<Skeleton className="w-full h-80" />
			</div>
		);
	if (locationView === "card") return <LocationsCard />;
	if (locationView === "table") return <LocationsTable />;
	if (locationView === "both")
		return (
			<Tabs defaultValue="table" className="w-full pt-8">
				<TabsList className="grid w-full grid-cols-2 max-w-xs">
					<TabsTrigger value="table">Table view</TabsTrigger>
					<TabsTrigger value="card">Cards view</TabsTrigger>
				</TabsList>
				<TabsContent value="table">
					<LocationsTable />
				</TabsContent>
				<TabsContent value="card">
					<LocationsCard />
				</TabsContent>
			</Tabs>
		);
	return <></>;
};

export default Locations;
