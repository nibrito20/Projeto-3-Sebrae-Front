interface FeatureIconProps {
  name: 'alert' | 'refresh' | 'hide' | 'filter' | 'home' | 'wave' | 'percent' | 'thermometer' | 'dot';
}

export function FeatureIcon({ name }: FeatureIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'alert' && (
        <>
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <circle cx="12" cy="17" r="1" />
        </>
      )}
      {name === 'refresh' && (
        <>
          <path d="M21 10a9 9 0 1 0-3 6.71" />
          <polyline points="21 10 21 4 15 4" />
          <path d="M3 14a9 9 0 0 0 3 6.71" />
          <polyline points="3 14 3 20 9 20" />
        </>
      )}
      {name === 'hide' && (
        <>
          <path d="M1 1l22 22" />
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20a10 10 0 0 1-9-5.91" />
          <path d="M3.09 4.15A9.97 9.97 0 0 1 12 4c4.97 0 9.21 3.2 10.64 7.59" />
          <path d="M14.12 9.88a3 3 0 0 0-4.24 4.24" />
        </>
      )}
      {name === 'filter' && (
        <>
          <polygon points="22 3 2 3 10 12.72 10 19 14 21 14 12.72 22 3" />
        </>
      )}
      {name === 'home' && (
        <>
          <path d="M3 11.5L12 3l9 8.5" />
          <path d="M9 21V12h6v9" />
          <path d="M21 12.5V21H3v-8.5" />
        </>
      )}
      {name === 'wave' && (
        <>
          <path d="M2 12c2-5 3-9 6-9s4 4 6 9 3 9 6 9" />
          <path d="M18 3c1.5 0 2.5 4 4 9s2.5 9 4 9" />
        </>
      )}
      {name === 'percent' && (
        <>
          <circle cx="6" cy="6" r="2" />
          <circle cx="18" cy="18" r="2" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </>
      )}
      {name === 'thermometer' && (
        <>
          <path d="M14 14.76V5a2 2 0 1 0-4 0v9.76a4 4 0 1 0 4 0Z" />
          <line x1="12" y1="2" x2="12" y2="9" />
        </>
      )}
      {name === 'dot' && <circle cx="12" cy="12" r="4" />}
    </svg>
  );
}
