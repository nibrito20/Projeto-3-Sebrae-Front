import type { Pagina } from '../types';
import type { FeatureIconName } from '../components/icons/FeatureIcon';

export interface FeatureItem {
  id: Pagina;
  label: string;
  iconName: FeatureIconName;
}

export const FEATURE_ITEMS: FeatureItem[] = [
  { id: 'home', label: 'Início', iconName: 'home' },
  { id: 'engajamento', label: 'Score de Engajamento', iconName: 'wave' },
  { id: 'services', label: 'Análise de Conclusão de Serviços', iconName: 'refresh' },
  { id: 'dashboard', label: 'Sinais Implícitos de Valor Percebido', iconName: 'thermometer' },
  { id: 'heatmap', label: 'Mapa de Calor de Interações', iconName: 'dot' },
  { id: 'retorno', label: 'Taxa de Retorno do Usuário', iconName: 'percent' },
  { id: 'alertas', label: 'Alertas de Comportamento Atípico', iconName: 'alert' },
  { id: 'abandono', label: 'Detector de Abandono Inteligente', iconName: 'hide' },
  { id: 'conversa', label: 'Na Conversa', iconName: 'wave' },
];
