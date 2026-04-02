export const formatDateLeads = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatDateApplicants = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatInterest = (interest: string[]) => {
    const interests = interest.map((interest) => {
        switch (interest) {
            case "PRIVATE_COACHING":
                return "Coaching privé";
            case "ONE_TO_ONE":
                return "1 vs 1";
            case "LIVES_SUBSCRIPTION":
                return "Abonnement";
            default:
                return interest;
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