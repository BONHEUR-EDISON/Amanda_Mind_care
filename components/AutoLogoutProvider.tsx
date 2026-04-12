'use client';

import { useEffect, useRef, useState } from 'react';
import WarningModal from './admin/WarningModal';
import { supabase } from '@/lib/supabase';

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 min
const WARNING_TIME = 60 * 1000; // 1 min

export default function AutoLogoutProvider({ children }: { children: React.ReactNode }) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const isTabActive = useRef(true);

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // 🔐 Logout sécurisé
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // 🔁 Reset intelligent
  const resetTimer = () => {
    const now = Date.now();
    localStorage.setItem('lastActivity', now.toString());

    clearAllTimers();
    setShowWarning(false);

    // ⏳ Warning
    warningTimer.current = setTimeout(() => {
      if (!isTabActive.current) return;

      setShowWarning(true);
      startCountdown();
    }, INACTIVITY_LIMIT - WARNING_TIME);

    // ⛔ Logout
    timer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT);
  };

  // 🔢 Countdown UX premium
  const startCountdown = () => {
    let timeLeft = 60;
    setCountdown(timeLeft);

    countdownInterval.current = setInterval(() => {
      if (!isTabActive.current) return;

      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft <= 0 && countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    }, 1000);
  };

  // 🧹 Clear timers
  const clearAllTimers = () => {
    if (timer.current) clearTimeout(timer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  };

  // 👀 Gestion onglet actif/inactif (CLÉ DU PROBLÈME)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        isTabActive.current = false;
        clearAllTimers(); // pause

      } else {
        isTabActive.current = true;

        const now = Date.now();
        const lastActivity = Number(localStorage.getItem('lastActivity') || now);
        const elapsed = now - lastActivity;

        // 🔥 si vraiment expiré → logout direct
        if (elapsed >= INACTIVITY_LIMIT) {
          logout();
        } else {
          resetTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // 🖱️ Activité utilisateur réelle
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    const handleActivity = () => {
      if (!isTabActive.current) return;
      resetTimer();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, []);

  // 🔄 Sync multi-tabs (ULTRA IMPORTANT)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'lastActivity') {
        resetTimer();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // 🚀 Init
  useEffect(() => {
    const now = Date.now();
    const lastActivity = Number(localStorage.getItem('lastActivity') || now);
    const elapsed = now - lastActivity;

    if (elapsed >= INACTIVITY_LIMIT) {
      logout();
    } else {
      resetTimer();
    }

    return () => clearAllTimers();
  }, []);

  return (
    <>
      {children}

      {showWarning && (
        <WarningModal
          countdown={countdown}
          onStayConnected={resetTimer}
          onLogout={logout}
        />
      )}
    </>
  );
}