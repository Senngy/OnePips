export type ScoringData = {
  budgetFormation?: number;
  budgetTrading?: number;
  tradingYears?: number;
  interests?: string[];
  markets?: string[];
  accountType?: string[];
};

export function calculateScore(data: ScoringData): number {
  let score = 0;

  // Budget formation
  if (data.budgetFormation) {
    if (data.budgetFormation >= 5000) score += 20;
    else if (data.budgetFormation >= 1000) score += 15;
    else if (data.budgetFormation >= 150) score += 10;
    else if (data.budgetFormation >= 90) score += 5;
  }

  // Budget trading
  if (data.budgetTrading) {
    if (data.budgetTrading >= 1000) score += 20;
    else if (data.budgetTrading >= 500) score += 10;
  }

  // Expérience
  if (data.tradingYears) {
    if (data.tradingYears >= 5) score += 20;
    else if (data.tradingYears >= 3) score += 15;
    else if (data.tradingYears >= 1) score += 10;
  }

  // Intérêts (high ticket)
  if (data.interests?.includes('PRIVATE_COACHING')) score += 10;
  if (data.interests?.includes('ONE_TO_ONE')) score += 5;
  if (data.interests?.includes('LIVES_SUBSCRIPTION')) score += 3;
  if (data.interests?.includes('SIGNALS')) score += 2;

  // Marchés
  if (data.markets?.includes('FUTURES')) score += 7;
  if (data.markets?.includes('CFD')) score += 3;

  // Compte propfirm
  if (data.accountType?.includes('PROPFIRM')) score += 5;
  if (data.accountType?.includes('PERSONAL')) score += 3;
  if (data.accountType?.includes('DEMO')) score += 2;

  return score;
}

export function getLeadStatus(score: number): 'HOT' | 'MID' | 'COLD' {
  if (score >= 70) return 'HOT';
  if (score >= 40) return 'MID';
  return 'COLD';
}
