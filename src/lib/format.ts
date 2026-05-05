export function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

export function daysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso + 'T00:00:00Z').getTime();
  const b = new Date(toIso + 'T00:00:00Z').getTime();
  return Math.floor((b - a) / 86400000);
}

export function relativeFromToday(iso: string, today: string): string {
  const days = daysBetween(iso, today);
  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `há ${days} dias`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return w === 1 ? 'há 1 semana' : `há ${w} semanas`;
  }
  if (days < 365) {
    const m = Math.floor(days / 30);
    return m === 1 ? 'há 1 mês' : `há ${m} meses`;
  }
  return 'há mais de 1 ano';
}

export function formatAbsoluteDate(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function inactivityLabel(days: number): string {
  if (days === 0) return 'Hoje';
  if (days === 1) return '1 dia sem acesso';
  return `${days} dias sem acesso`;
}
