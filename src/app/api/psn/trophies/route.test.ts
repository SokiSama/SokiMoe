import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('psn-api', () => {
  return {
    exchangeNpssoForAccessCode: vi.fn(async () => 'access-code'),
    exchangeAccessCodeForAuthTokens: vi.fn(async () => {
      return {
        accessToken: 'access-token',
        expiresIn: 3600,
        idToken: 'id',
        refreshToken: 'refresh-token',
        refreshTokenExpiresIn: 86400,
        scope: 'scope',
        tokenType: 'Bearer',
      };
    }),
    exchangeRefreshTokenForAuthTokens: vi.fn(async () => {
      return {
        accessToken: 'access-token-2',
        expiresIn: 3600,
        idToken: 'id',
        refreshToken: 'refresh-token-2',
        refreshTokenExpiresIn: 86400,
        scope: 'scope',
        tokenType: 'Bearer',
      };
    }),
    getUserTrophyProfileSummary: vi.fn(async () => {
      return {
        accountId: '1',
        trophyLevel: '100',
        progress: 50,
        tier: 2,
        earnedTrophies: { bronze: 10, silver: 3, gold: 1, platinum: 0 },
      };
    }),
    getProfileFromAccountId: vi.fn(async () => {
      return {
        onlineId: 'Soki',
        avatars: [
          {
            size: '40x40',
            url: 'https://example.com/avatar.png',
          },
        ],
      };
    }),
    getUserTitles: vi.fn(async () => ({ trophyTitles: [] })),
    getTitleTrophyGroups: vi.fn(async () => {
      return {
        trophySetVersion: '01.00',
        trophyTitleName: 'Demo Game',
        trophyTitleIconUrl: 'https://example.com/icon.png',
        trophyTitlePlatform: 'PS5',
        definedTrophies: { bronze: 1, silver: 1, gold: 1, platinum: 1 },
        trophyGroups: [
          {
            trophyGroupId: 'default',
            trophyGroupName: 'Base',
            trophyGroupIconUrl: 'https://example.com/group.png',
            definedTrophies: { bronze: 1, silver: 1, gold: 1, platinum: 1 },
          },
        ],
      };
    }),
    getUserTrophyGroupEarningsForTitle: vi.fn(async () => {
      return {
        trophySetVersion: '01.00',
        hiddenFlag: false,
        progress: 20,
        earnedTrophies: { bronze: 1, silver: 0, gold: 0, platinum: 0 },
        trophyGroups: [
          {
            trophyGroupId: 'default',
            progress: 20,
            earnedTrophies: { bronze: 1, silver: 0, gold: 0, platinum: 0 },
            lastUpdatedDateTime: '2026-01-16T00:00:00Z',
          },
        ],
        lastUpdatedDateTime: '2026-01-16T00:00:00Z',
      };
    }),
  };
});

describe('/api/psn/trophies', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => void 0);
    process.env.PSN_NPSSO = 'dummy';
  });

  it('returns mapped trophy summary', async () => {
    const { GET } = await import('./route');
    const res = await GET({ url: 'http://localhost/api/psn/trophies?mode=summary' } as any);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data).toMatchObject({
      accountId: '1',
      trophyLevel: '100',
      progress: 50,
      tier: 2,
      earnedTrophies: { bronze: 10, silver: 3, gold: 1, platinum: 0 },
      profile: { onlineId: 'Soki', avatarUrl: 'https://example.com/avatar.png' },
    });
    expect(typeof json.data.updatedAt).toBe('string');
  });

  it('returns title detail data', async () => {
    const { GET } = await import('./route');
    const res = await GET({
      url: 'http://localhost/api/psn/trophies?mode=title&npCommunicationId=abc&npServiceName=trophy2',
    } as any);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.data).toMatchObject({
      trophyTitleName: 'Demo Game',
      trophyTitlePlatform: 'PS5',
      progress: 20,
      trophyGroups: [
        {
          trophyGroupId: 'default',
          trophyGroupName: 'Base',
          progress: 20,
        },
      ],
    });
  });
});
