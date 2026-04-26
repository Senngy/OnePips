import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export function formatRelativeDate(date: string | Date) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
    })
}

export const formatInterest = (interest: string[] | string | undefined | null) => {
    if (!interest) return "N/A";

    // Ensure we always have an array to map over
    const interestArray = Array.isArray(interest) ? interest : [interest];

    const interests = interestArray.map((item) => {
        switch (item) {
            case "PRIVATE_COACHING":
                return "Coaching privé";
            case "ONE_TO_ONE":
                return "1 vs 1";
            case "LIVES_SUBSCRIPTION":
                return "Abonnement";
            default:
                return item;
        }
    });
    return interests.join(", ");
};

export const formatStatus = (status: string) => {
    switch (status) {
        case "HOT":
            return "🔥 Chaud";
        case "MID":
            return "🌡️ Moyen";
        case "COLD":
            return "❄️ Froid";
        case "PENDING":
            return "En attente";
        default:
            return status;
    }
};

export const formatSource = (source: string) => {
    switch (source) {
        case "funnel_multistep":
            return "Formulaire candidature";
        case "funnel_one_step":
            return "Formulaire rapide";
        default:
            return source;
    }
};

export const formatAccountType = (accountType: string) => {
    switch (accountType) {
        case "DEMO":
            return "Compte démo";
        case "PERSONAL":
            return "Compte propre";
        case "PROPFIRM":
            return "Prop Firm";
        default:
            return accountType;
    }
};