import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';

const AuthCtx = createContext(null);

// ── Avatar stored in localStorage keyed by user id ───────────
export function getStoredAvatar(userId) {
  if (!userId) return null;
  return localStorage.getItem(`ss_avatar_${userId}`) || null;
}
export function saveStoredAvatar(userId, dataUrl) {
  if (!userId) return;
  localStorage.setItem(`ss_avatar_${userId}`, dataUrl);
}
export function removeStoredAvatar(userId) {
  if (!userId) return;
  localStorage.removeItem(`ss_avatar_${userId}`);
}

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [avatar, setAvatar]     = useState(null); // base64 dataURL
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then(u => {
        setUser(u);
        setAvatar(getStoredAvatar(u.id));
      })
      .catch(() => localStorage.removeItem('ss_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('ss_token', data.token);
    setUser(data.user);
    setAvatar(getStoredAvatar(data.user.id));
    return data.user;
  }, []);

  const register = useCallback(async (body) => {
    const data = await api.register(body);
    localStorage.setItem('ss_token', data.token);
    setUser(data.user);
    setAvatar(null);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ss_token');
    setUser(null);
    setAvatar(null);
  }, []);

  // Update name/email/phone in context after profile save
  const updateUser = useCallback((fields) => {
    setUser(prev => ({ ...prev, ...fields }));
  }, []);

  // Save avatar to localStorage + update context state
  const updateAvatar = useCallback((userId, dataUrl) => {
    saveStoredAvatar(userId, dataUrl);
    setAvatar(dataUrl);
  }, []);

  const removeAvatar = useCallback((userId) => {
    removeStoredAvatar(userId);
    setAvatar(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, avatar, loading, login, register, logout, updateUser, updateAvatar, removeAvatar }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
