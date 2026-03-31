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