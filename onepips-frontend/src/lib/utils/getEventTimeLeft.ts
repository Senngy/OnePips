export function getTimeLeft(targetDate: string | Date) {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();

    const diff = target - now;

    if (diff <= 0) {
        return null;
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}