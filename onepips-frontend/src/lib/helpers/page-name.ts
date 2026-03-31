export const getPageName = (pathname: string) => {
    const map: Record<string, string> = {
        "/admin/dashboard": "Dashboard",
        "/admin/leads": "Leads",
        "/admin/applications": "Applications",
        "/admin/booking": "Booking",
        "/admin/payments": "Payments",
        "/admin/events": "Events",
        "/admin/analytics": "Analytics",
        "/admin/settings": "Settings",
    };

    return map[pathname] || "Dashboard";
};