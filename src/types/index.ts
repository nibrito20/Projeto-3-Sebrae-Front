export type RiskLabel = 'alto' | 'médio' | 'baixo';

export type TimelineEventType = 'alert' | 'warning' | 'positive' | 'neutral';

export interface TimelineEvent {
  type: TimelineEventType;
  date: string;
  title: string;
  description: string;
}

export interface WorstTask {
  id: string;
  label: string;
  userMinutes: number;
}

export interface Client {
  id: string;
  nome: string;
  cnpj: string;
  lastAccessDate: string;
  loginCountLast30d: number;
  worstTask: WorstTask;
  timeline: TimelineEvent[];
}

export interface PlatformAverages {
  taskDurationsMinutes: Record<string, number>;
}

export interface Ctx {
  today: string;
  platformAverages: PlatformAverages;
}

export interface RiskFactors {
  inactivity: number;
  efficiency: number;
  engagement: number;
}

export interface ClientEnriched extends Client {
  daysSinceLastAccess: number;
  platformAvgMinutes: number;
  userMinutes: number;
  ratio: number;
  factors: RiskFactors;
  riskScore: number;
  risk: RiskLabel;
  healthScore: number;
}

export interface ClientsPayload {
  meta: {
    today: string;
    previousPeriodActiveAlerts: number;
  };
  platformAverages: PlatformAverages;
  clients: Client[];
}

export type InactivityLevel = 'high' | 'med' | 'low';
export type EfficiencyLevel = 'alert' | 'warn' | 'ok';
