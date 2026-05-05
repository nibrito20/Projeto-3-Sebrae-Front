import { useMemo } from 'react';
import type { ClientEnriched, Ctx } from '../types';
import {
  buildContext,
  enrichAllClients,
  payload,
} from '../lib/data';

export interface UseClientsResult {
  ctx: Ctx;
  clients: ClientEnriched[];
  previousPeriodActiveAlerts: number;
}

export function useClients(): UseClientsResult {
  return useMemo(() => {
    const ctx = buildContext(payload);
    const clients = enrichAllClients(payload);
    return {
      ctx,
      clients,
      previousPeriodActiveAlerts: payload.meta.previousPeriodActiveAlerts,
    };
  }, []);
}
