import { useState, useEffect } from 'react';
import type { ClientEnriched, Ctx } from '../types';
import {
  buildContext,
  enrichAllClients,
  fetchPayload,
} from '../lib/data';

export interface UseClientsResult {
  ctx: Ctx | null;
  clients: ClientEnriched[];
  previousPeriodActiveAlerts: number;
  loading: boolean;
}

export function useClients(): UseClientsResult {
  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [clients, setClients] = useState<ClientEnriched[]>([]);
  const [previousPeriodActiveAlerts, setPreviousAlerts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayload().then((payload) => {
      setCtx(buildContext(payload));
      setClients(enrichAllClients(payload));
      setPreviousAlerts(payload.meta.previousPeriodActiveAlerts);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Erro ao buscar dados do servidor:', err);
      setLoading(false);
    });
  }, []);

  return { ctx, clients, previousPeriodActiveAlerts, loading };
}
