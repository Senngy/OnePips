import { useEffect, useState } from "react";
import { getTimeLeft } from "@/lib/utils/getEventTimeLeft";

export function useCountdown(targetDate?: string) {
    // Always start with null — avoids a server/client time mismatch during hydration.
    // The real value is computed exclusively inside useEffect (client-only).
    const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

    useEffect(() => {
        if (!targetDate) return;

        // Set immediately so the countdown appears without a 1s delay
        setTimeLeft(getTimeLeft(targetDate));

        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}