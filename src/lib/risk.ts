import type {
  Client,
  ClientEnriched,
  Ctx,
  EfficiencyLevel,
  InactivityLevel,
  RiskFactors,
  RiskLabel,
} from '../types';
import { clamp, daysBetween } from './format';

interface FactorBreakdown {
  daysSinceLastAccess: number;
  platformAvgMinutes: number;
  userMinutes: number;
  ratio: number;
  factors: RiskFactors;
}

export function computeFactors(client: Client, ctx: Ctx): FactorBreakdown {
  const avgs = ctx.platformAverages.taskDurationsMinutes ?? {};
  const daysSinceLastAccess = daysBetween(client.lastAccessDate, ctx.today);
  const platformAvgMinutes = avgs[client.worstTask.id] ?? 0;
  const userMinutes = client.worstTask.userMinutes ?? 0;
  const ratio = platformAvgMinutes > 0 ? userMinutes / platformAvgMinutes : 0;

  const inactivity = clamp(daysSinceLastAccess / 30, 0, 1);
  const efficiency = clamp((ratio - 1) / 2, 0, 1);
  const loginCount = typeof client.loginCountLast30d === 'number' ? client.loginCountLast30d : 0;
  const engagement = clamp(1 - loginCount / 10, 0, 1);

  return {
    daysSinceLastAccess,
    platformAvgMinutes,
    userMinutes,
    ratio,
    factors: { inactivity, efficiency, engagement },
  };
}

export function classifyRisk(client: Client, ctx: Ctx): ClientEnriched {
  const f = computeFactors(client, ctx);
  const riskScore =
    0.5 * f.factors.inactivity +
    0.3 * f.factors.efficiency +
    0.2 * f.factors.engagement;

  let risk: RiskLabel;
  if (riskScore >= 0.66) risk = 'alto';
  else if (riskScore >= 0.33) risk = 'médio';
  else risk = 'baixo';

  const healthScore = Math.round((1 - riskScore) * 100);

  return {
    ...client,
    daysSinceLastAccess: f.daysSinceLastAccess,
    platformAvgMinutes: f.platformAvgMinutes,
    userMinutes: f.userMinutes,
    ratio: f.ratio,
    factors: f.factors,
    riskScore,
    risk,
    healthScore,
  };
}

export function inactivityLevel(daysSinceLastAccess: number): InactivityLevel {
  if (daysSinceLastAccess >= 15) return 'high';
  if (daysSinceLastAccess >= 7) return 'med';
  return 'low';
}

export function efficiencyLevel(ratio: number): EfficiencyLevel {
  if (ratio > 3) return 'alert';
  if (ratio > 2) return 'warn';
  return 'ok';
}
