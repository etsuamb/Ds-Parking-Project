// Small helper to notify all auth listeners when login/logout happens
export const AUTH_CHANGED_EVENT = 'auth-changed';

export const emitAuthChanged = () => {
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
  }
}


