interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <div className="loading-screen__spinner" aria-hidden="true">
        <span className="loading-screen__crescent" />
      </div>
      <p className="loading-screen__message">{message}</p>
    </div>
  );
}
