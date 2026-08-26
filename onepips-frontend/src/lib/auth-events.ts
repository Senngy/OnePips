// Pont d'événements entre le client HTTP (api-client) et la couche auth.
// api-client n'importe ni React ni router : il notifie simplement un 401,
// et AuthProvider s'abonne pour invalider la session frontend.
type UnauthorizedListener = () => void;

const listeners = new Set<UnauthorizedListener>();

export function onUnauthorized(listener: UnauthorizedListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyUnauthorized(): void {
  for (const listener of listeners) {
    listener();
  }
}
