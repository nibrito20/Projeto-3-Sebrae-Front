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

export interface Service {
  id: number;
  nome: string;
  totalIniciados: number;
  totalConcluidos: number;
  totalAbandonados: number;
  tempoMedioMinutos: number;
  taxaConclusao: number;
  scoreConclusao: number;

  tempoMedioEtapa?: string;
  dispositivos?: string[];
  origensTrafego?: string[];
  ultimosUsuarios?: { id: string; data: string }[];
  gargalo?: string;
}

export interface EngagementRankingItem {
  clienteId: string;
  scoreFinal: number;
  nivel: string;
  frequencia: number;
  profundidade: number;
  reuso: number;
  nome?: string;
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
  servicos: Service[];
}

export interface HeatmapGrid {
  id: number;
  page: string;
  gridX: number;
  gridY: number;
  totalClicks: number;
  totalMoves: number;
}

export interface HeatmapPage {
  id: string;
  label: string;
  thumbnail: string;
  screenshot: string;
}

export type InactivityLevel = 'high' | 'med' | 'low';
export type EfficiencyLevel = 'alert' | 'warn' | 'ok';
export type Pagina = 'login' | 'cadastro' | 'dashboard' | 'home' | 'perfil' | 'services' | 'heatmap' | 'engajamento' | 'retorno' | 'abandono' | 'alertas' | 'conversa';