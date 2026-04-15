import axios from 'axios';

const DEFAULT_WRONG_CREDS = "Nom d'utilisateur ou mot de passe incorrect.";

function firstString(val: unknown): string | null {
  if (typeof val === 'string' && val.trim()) return val;
  if (Array.isArray(val) && val[0] != null) return String(val[0]);
  return null;
}

/** Maps sign-in API errors to a short French message for the UI / toast. */
export function formatLoginApiError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Une erreur inattendue est survenue.';
  }
  if (!error.response) {
    return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
  }

  const { status, data } = error.response;
  const d = (data && typeof data === 'object' ? data : {}) as Record<
    string,
    unknown
  >;

  const detail = firstString(d.detail);
  if (detail) return detail;

  const apiError = firstString(d.error);
  if (apiError) return apiError;

  const nfe = firstString(d.non_field_errors);
  if (nfe) return nfe;

  for (const key of ['username', 'email', 'password']) {
    const v = firstString(d[key]);
    if (v) return v;
  }

  if (status === 429) {
    return 'Trop de tentatives de connexion. Réessayez plus tard.';
  }
  if (status === 401) return DEFAULT_WRONG_CREDS;
  if (status === 400) {
    return `${DEFAULT_WRONG_CREDS} (400 — voir l’onglet Réseau pour le détail du serveur.)`;
  }
  return DEFAULT_WRONG_CREDS;
}
