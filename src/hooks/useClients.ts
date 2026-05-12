import { useState, useEffect } from 'react';
import type { ClientEnriched, ClientsPayload} from '../types';
import {
  enrichAllClients,
  fetchSimulatedServices,
  fetchPayload,
  type Service
} from '../lib/data';

export interface UseClientsResult {
  ctx: any; // Use o tipo Ctx se o tiver definido
  clients: ClientEnriched[];
  servicos: Service[]; // Esta lista agora terá a 'taxaConclusao' vinda do Java
  loading: boolean;
}

export function useClients() {
  const [ctx, setCtx] = useState<ClientsPayload | null>(null);
  const [clients, setClients] = useState<ClientEnriched[]>([]);
  const [servicos, setServicos] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchPayload().then((payload) => {
      setCtx(payload);
      setClients(enrichAllClients(payload));
      
      fetchSimulatedServices()
      .then((dados: Service[]) => { // Force a tipagem aqui
        setServicos(dados);
      })
      .catch(() => setServicos([]));
      
      setLoading(false);
    });
  }, []);

  return { ctx, clients, servicos, loading, previousPeriodActiveAlerts: ctx?.meta.previousPeriodActiveAlerts ?? 0};
}
