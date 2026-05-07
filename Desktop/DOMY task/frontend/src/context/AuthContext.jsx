import React, { createContext, useContext, useEffect, useState } from 'react';
import API, { setToken } from '../api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);

  const refresh = async () => {
    try {
      const r = await API.get('/auth/me');
      setUser(r.data);
      return r.data;
    } catch (e) {
      setUser(null);
      return null;
    }
  };

  useEffect(()=>{
    const t = localStorage.getItem('token');
    if (t){
      setToken(t);
      refresh().catch(()=>{ localStorage.removeItem('token'); setToken(null); });
    }
  }, []);

  const login = async (identifier, password) => {
    const res = await API.post('/auth/login', { identifier, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    setToken(token);
    const userData = res.data.user || await refresh();
    setUser(userData);
    return userData;
  };
  const register = async (username, email, password) => {
    const res = await API.post('/auth/register', { username, email, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    setToken(token);
    const userData = res.data.user || await refresh();
    setUser(userData);
    return userData;
  };
  const logout = () => { localStorage.removeItem('token'); setToken(null); setUser(null); };

  return <AuthContext.Provider value={{ user, login, register, logout, refresh }}>{children}</AuthContext.Provider>;
}
