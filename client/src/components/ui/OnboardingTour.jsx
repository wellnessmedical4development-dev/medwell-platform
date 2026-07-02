import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'medwell_tour_completed';

const steps = [
  {
    title: 'Bienvenue sur MedWell !',
    desc: 'Découvrez votre tableau de bord. Commencez par personnaliser votre profil et consulter votre carte de membre.',
    target: 'top-bar-area',
  },
  {
    title: 'Votre Portefeuille Wellness Coin',
    desc: 'Gérez vos coins wellness, consultez votre historique et transférez à d\'autres membres.',
    target: 'wallet-area',
  },
  {
    title: 'Programme de Parrainage',
    desc: 'Invitez vos amis et gagnez 50 WMC à chaque inscription à un programme. Votre code unique est prêt !',
    target: 'referral-area',
  },
];

export default function OnboardingTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setActive(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const complete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setActive(false);
  }, []);

  if (!active) return null;

  const current = steps[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={complete} />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-champagne-400/20 p-6 max-w-sm w-full"
        >
          <div className="flex items-center gap-2 mb-4">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                i === step ? 'bg-champagne-400' : 'bg-dark-200 dark:bg-dark-700'
              }`} />
            ))}
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
            {current.desc}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={complete}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Passer
            </button>
            <button
              onClick={() => {
                if (step < steps.length - 1) setStep(step + 1);
                else complete();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-champagne-400 text-dark-900 rounded-full text-xs font-bold tracking-wider hover:bg-champagne-500 transition-all duration-200"
            >
              {step < steps.length - 1 ? 'Suivant' : 'Terminer'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={complete}
            className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
