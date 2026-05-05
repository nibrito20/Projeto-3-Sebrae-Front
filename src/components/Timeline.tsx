import { formatAbsoluteDate, relativeFromToday } from '../lib/format';
import type { TimelineEvent, TimelineEventType } from '../types';

const BULLET_CLASS: Record<TimelineEventType, string> = {
  alert: 'timeline__bullet--alert',
  warning: 'timeline__bullet--warning',
  positive: 'timeline__bullet--positive',
  neutral: 'timeline__bullet--neutral',
};

export interface TimelineProps {
  events: TimelineEvent[];
  today: string;
}

export function Timeline({ events, today }: TimelineProps) {
  return (
    <ol className="timeline">
      {events.map((ev, i) => {
        const rel = relativeFromToday(ev.date, today);
        const abs = formatAbsoluteDate(ev.date);
        return (
          <li key={`${ev.date}-${ev.type}-${i}`} className="timeline__item">
            <span
              className={`timeline__bullet ${BULLET_CLASS[ev.type]}`}
              aria-hidden="true"
            />
            <div className="timeline__title">{ev.title}</div>
            <div className="timeline__desc">{ev.description}</div>
            <time className="timeline__time" dateTime={ev.date} title={abs}>
              {rel} · {abs}
            </time>
          </li>
        );
      })}
    </ol>
  );
}
