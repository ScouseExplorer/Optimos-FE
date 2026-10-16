import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../api/authService';
import { userService } from '../api/userService';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

const AUTH_BOOTSTRAP_STATES = {
  idle: 'idle',
  loading: 'loading',
  ready: 'ready',
};

const hasAdminAccess = user => {
  if (!user || typeof user !== 'object') return false;

  if (user.is_admin === true || user.isAdmin === true) return true;

  const role = typeof user.role === 'string' ? user.role.toLowerCase() : '';
  if (role === 'admin' || role === 'superadmin' || role === 'super_admin') return true;

  if (Array.isArray(user.roles)) {
    return user.roles.some(item => {
      if (typeof item !== 'string') return false;
      const normalized = item.toLowerCase();
      return normalized === 'admin' || normalized === 'superadmin' || normalized === 'super_admin';
    });
  }

  return false;
};

const getErrorMessage = error => {
  if (!error) return 'Something went wrong.';
  if (error.status === 401) return error.message || 'Your session expired. Please log in again.';
  if (error.status === 422 && Array.isArray(error.fieldErrors) && error.fieldErrors.length > 0) {
    const first = error.fieldErrors[0];
    return `${first.field}: ${first.message}`;
  }

  if (error.requestId) {
    return `${error.message || 'Something went wrong.'} (Request ID: ${error.requestId})`;
  }

  return error.message || 'Something went wrong.';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapState, setBootstrapState] = useState(AUTH_BOOTSTRAP_STATES.idle);

  const hasStoredToken = Boolean(apiClient.authStorage.getStoredTokens().accessToken);

  const refreshCurrentUser = useCallback(async () => {
    const profile = await userService.getMe();
    setUser(profile);
    return profile;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!hasStoredToken) {
        if (isMounted) setBootstrapState(AUTH_BOOTSTRAP_STATES.ready);
        return;
      }

      if (isMounted) setBootstrapState(AUTH_BOOTSTRAP_STATES.loading);

      try {
        const me = await userService.getMe();
        if (isMounted) setUser(me);
      } catch (error) {
        apiClient.authStorage.clearStoredTokens();
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setBootstrapState(AUTH_BOOTSTRAP_STATES.ready);
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [hasStoredToken]);

  const login = useCallback(async credentials => {
    await authService.login(credentials);
    const me = await refreshCurrentUser();
    return me;
  }, [refreshCurrentUser]);

  const register = useCallback(async payload => {
    return authService.register(payload);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: hasAdminAccess(user),
      isBootstrapping: bootstrapState !== AUTH_BOOTSTRAP_STATES.ready,
      login,
      register,
      logout,
      refreshCurrentUser,
      getErrorMessage,
    }),
    [bootstrapState, login, logout, refreshCurrentUser, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
}
