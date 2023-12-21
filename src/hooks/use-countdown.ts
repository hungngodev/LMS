import { useCallback, useEffect, useState } from "react";

export const useCountdown = (
	callback: (...args: any) => void,
	delay: number
) => {
	const [remainMillies, setRemainMillies] = useState<number | null>(null);

	// At the start, check if there's an end time stored in localStorage
	useEffect(() => {
		const endTime = localStorage.getItem(
			"seamless_lms_reset_password_end_time"
		);
		const now = Date.now();
		if (!endTime || new Date(endTime).getTime() < now) return;

		const remaining = Date.parse(endTime) - now;
		if (remaining > 0) setRemainMillies(remaining);
	}, []);

	const startCountdown = useCallback(() => {
		let endTime = localStorage.getItem(
			"seamless_lms_reset_password_end_time"
		);
		const now = Date.now();
		if (endTime === null || new Date(endTime).getTime() < now) {
			endTime = new Date(now + delay).toISOString();
			localStorage.setItem(
				"seamless_lms_reset_password_end_time",
				endTime
			);
		}
		const remainMillies = new Date(endTime).getTime() - Date.now();
		setRemainMillies(remainMillies);
	}, [delay]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (remainMillies && remainMillies > 0) {
			// Start a countdown
			intervalId = setInterval(() => {
				let endTime = localStorage.getItem(
					"seamless_lms_reset_password_end_time"
				);
				if (endTime === null) {
					endTime = new Date(Date.now() + delay).toISOString();
				}
				const remaining = Date.parse(endTime) - Date.now();
				if (remaining > 0) setRemainMillies(remaining);
				else {
					clearInterval(intervalId);
					callback();
					setRemainMillies(null);
					localStorage.removeItem(
						"seamless_lms_reset_password_end_time"
					);
				}
			}, 450); // 1 second
		}

		// Clear timeout if the component is unmounted or if delay changes
		return () => clearTimeout(intervalId);
	}, [callback, delay, remainMillies]);

	// Returns remaining time in case you want to display a countdown or something
	return { remainMillies, startCountdown };
};
