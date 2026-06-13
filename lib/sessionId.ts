export function getSessionId(): string {
  const storageKey = 'watch_picker_session_id';
  
  if (typeof window === 'undefined') {
    return '';
  }

  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

export function hasSubmitted(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return localStorage.getItem('watch_picker_submitted') === 'true';
}

export function markAsSubmitted(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('watch_picker_submitted', 'true');
  }
}
