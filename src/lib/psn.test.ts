import { describe, expect, it } from 'vitest';

import { mapUserTrophyProfileSummary } from './psn';

describe('mapUserTrophyProfileSummary', () => {
  it('maps PSN trophy summary into chart payload', () => {
    const now = new Date('2026-01-16T00:00:00.000Z');
    const out = mapUserTrophyProfileSummary(
      {
        accountId: '123',
        trophyLevel: '250',
        progress: 42,
        tier: 3,
        earnedTrophies: { bronze: 10, silver: 5, gold: 2, platinum: 1 },
      },
      now
    );

    expect(out).toEqual({
      accountId: '123',
      trophyLevel: '250',
      progress: 42,
      tier: 3,
      earnedTrophies: { bronze: 10, silver: 5, gold: 2, platinum: 1 },
      updatedAt: '2026-01-16T00:00:00.000Z',
    });
  });
});

