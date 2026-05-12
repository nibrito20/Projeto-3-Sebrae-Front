import type {
  Client,
  ClientEnriched,
  ClientsPayload,
  Ctx,
  RiskLabel,
  TimelineEvent,
} from '../types';

import { classifyRisk } from './risk';
import { daysBetween } from './format';

const RISK_ORDER: Record<RiskLabel, number> = {
  alto: 0,
  'médio': 1,
  baixo: 2,
};

// Mantém esta para a Home
export async function fetchPayload(): Promise<ClientsPayload> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes`);
  return await response.json();
}

// Cria esta nova para a aba de serviços
export async function fetchSimulatedServices(): Promise<Service[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dados-completos`);
  const data = await response.json();
  return data.servicos || []; 
}

export function buildContext(p: ClientsPayload): Ctx {
  return {
    today: p.meta.today,
    platformAverages: p.platformAverages,
  };
}

export function enrichAllClients(p: ClientsPayload): ClientEnriched[] {
  const ctxForRisk = {
    today: p.meta.today,
    platformAverages: p.platformAverages,
  };
  return p.clients.map((c) => classifyRisk(c, ctxForRisk));
}

export interface FilterOptions {
  searchText: string;
  periodDays: number;
  today: string;
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
}

export function filterClients(clients: ClientEnriched[], opts: FilterOptions): ClientEnriched[] {
  const search = opts.searchText.trim().toLowerCase();
  let result = clients;

  if (search) {
    result = result.filter(
      (c) =>
        c.nome.toLowerCase().includes(search) ||
        c.cnpj.toLowerCase().includes(search),
    );
  }

  if (opts.periodDays > 0 && Number.isFinite(opts.periodDays)) {
    result = result.filter(
      (c) => daysBetween(c.lastAccessDate, opts.today) <= opts.periodDays,
    );
  }

  return result;
}

export function sortByRiskAndScore(clients: ClientEnriched[]): ClientEnriched[] {
  return clients.slice().sort((a, b) => {
    const dRisk = RISK_ORDER[a.risk] - RISK_ORDER[b.risk];
    if (dRisk !== 0) return dRisk;
    return a.healthScore - b.healthScore;
  });
}

export function aggregateRiskCounts(clients: ClientEnriched[]): Record<RiskLabel, number> {
  return clients.reduce<Record<RiskLabel, number>>(
    (acc, c) => {
      acc[c.risk] = (acc[c.risk] ?? 0) + 1;
      return acc;
    },
    { alto: 0, 'médio': 0, baixo: 0 },
  );
}

export function averageHealthScore(clients: ClientEnriched[]): number {
  if (!clients.length) return 0;
  const sum = clients.reduce((s, c) => s + c.healthScore, 0);
  return Math.round(sum / clients.length);
}

export function activeAlertsCount(clients: ClientEnriched[]): number {
  return clients.filter((c) => c.daysSinceLastAccess >= 15).length;
}

export function sortTimelineDesc(timeline: TimelineEvent[]): TimelineEvent[] {
  return timeline
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function findClientById(
  clients: ClientEnriched[],
  id: string | null,
): ClientEnriched | null {
  if (!id) return null;
  return clients.find((c) => c.id === id) ?? null;
}

export function rebuildEnriched(rawClients: Client[], ctx: Ctx): ClientEnriched[] {
  return rawClients.map((c) => classifyRisk(c, ctx));
}

export function getServices(p: ClientsPayload) {
  return p.servicos || [];
}

export function findServiceById(p: ClientsPayload, id: number) {
  return p.servicos.find(s => s.id === id) || null;
}