import type { UserTrophyProfileSummaryResponse } from 'psn-api';

export type PsnTrophySummary = {
  accountId: string;
  trophyLevel: string;
  progress: number;
  tier: number;
  earnedTrophies: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
  profile?: {
    onlineId: string;
    avatarUrl: string | null;
  };
  updatedAt: string;
};

export function mapUserTrophyProfileSummary(
  input: UserTrophyProfileSummaryResponse,
  now: Date = new Date()
): PsnTrophySummary {
  return {
    accountId: input.accountId,
    trophyLevel: input.trophyLevel,
    progress: input.progress,
    tier: input.tier,
    earnedTrophies: {
      bronze: input.earnedTrophies.bronze,
      silver: input.earnedTrophies.silver,
      gold: input.earnedTrophies.gold,
      platinum: Number(input.earnedTrophies.platinum),
    },
    updatedAt: now.toISOString(),
  };
}
