'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
  const check = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile) return;

    if (profile.role === 'admin') {
      router.replace('/admin');
    } else if (profile.role === 'therapist') {
      router.replace('/therapist');
    } else {
      router.replace('/patient');
    }
  };

  check();
}, []);

  const handleLogin = async () => {
  setLoading(true);
  setError(null);

  if (!email || !password) {
    setError('Veuillez remplir tous les champs');
    setLoading(false);
    return;
  }

  // 1. LOGIN AUTH
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    setError('Email ou mot de passe incorrect');
    setLoading(false);
    return;
  }

  // 2. GET PROFILE (IMPORTANT)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    setError('Erreur profil utilisateur');
    setLoading(false);
    return;
  }

  // 3. SMART ROUTING
  if (profile.role === 'admin') {
    router.push('/admin');
  } else if (profile.role === 'therapist') {
    router.push('/therapist');
  } else {
    router.push('/patient');
  }

  setLoading(false);
};
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  const handleAppleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#f6f9fc]">

      {/* LEFT - IMAGE */}
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1400&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-semibold mb-4">
            AMHC
          </div>

          <h1 className="text-3xl font-semibold">
            Aurion Mental Health Clinic
          </h1>

          <p className="mt-3 text-sm text-white/80 max-w-sm leading-relaxed">
            Plateforme clinique moderne pour un suivi psychologique sécurisé et humain.
          </p>
        </div>
      </div>

      {/* RIGHT - LOGIN */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">

            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Connexion
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Accédez à votre espace patient
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* INPUTS */}
            <div className="space-y-4">

              {/* EMAIL */}
              <div>
                <label className="text-xs text-gray-500">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="mt-1 w-full h-11 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]/30"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-xs text-gray-500">Mot de passe</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-3 pr-10 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-6 h-11 rounded-lg text-sm font-medium text-white bg-[#6B9AC4] hover:bg-[#5a89b1] transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">ou</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* OAUTH */}
            <button
              onClick={handleGoogleLogin}
              className="w-full h-11 flex items-center justify-center gap-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              <img src="/google.svg" className="w-4 h-4" />
              Continuer avec Google
            </button>

            <button
              onClick={handleAppleLogin}
              className="w-full mt-3 h-11 flex items-center justify-center gap-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition"
            >
               Continuer avec Apple
            </button>

            {/* FOOTER */}
            <p className="text-center text-sm text-gray-400 mt-6 hover:text-gray-600 cursor-pointer transition">
              Mot de passe oublié ?
            </p>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
