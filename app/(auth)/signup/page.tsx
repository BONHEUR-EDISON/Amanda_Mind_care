'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError('Impossible de créer le compte');
      setLoading(false);
      return;
    }

    setSuccess('Compte créé ! Vérifiez votre email pour confirmer.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#f6f9fc]">

      {/* LEFT IMAGE */}
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1400&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-10">

          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-semibold mb-4">
            AMC
          </div>

          <h1 className="text-3xl font-semibold">
            Rejoignez Amanda Mind Care
          </h1>

          <p className="mt-3 text-sm text-white/80 max-w-sm">
            Créez votre espace patient sécurisé et commencez votre accompagnement psychologique.
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >

          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">

            {/* HEADER */}
            <h2 className="text-xl font-semibold text-gray-800">
              Créer un compte
            </h2>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              Accédez à votre espace patient sécurisé
            </p>

            {/* ERROR */}
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
                {success}
              </div>
            )}

            {/* INPUTS */}
            <div className="space-y-4">

              <input
                type="text"
                placeholder="Nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]/30"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]/30"
              />

              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B9AC4]/30"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full mt-6 h-11 rounded-lg text-sm font-medium text-white bg-[#6B9AC4] hover:bg-[#5a89b1] transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Création...' : 'Créer un compte'}
            </button>

            {/* FOOTER */}
            <p className="text-center text-xs text-gray-400 mt-6">
              En créant un compte, vous acceptez notre politique de confidentialité
            </p>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
