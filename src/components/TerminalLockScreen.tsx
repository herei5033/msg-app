import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Unlock, ShieldAlert, Cpu } from 'lucide-react';

export const TerminalLockScreen: React.FC = () => {
  const { currentUser, unlockTerminal } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockTerminal(pin);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F]/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#11131A] border border-[#232733] rounded-xl p-6 text-center shadow-2xl glow-overlay">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#181B24] border border-[#2E3445] flex items-center justify-center text-[#3B82F6] mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-base font-semibold text-[#F3F4F6]">TERMINAL SECURED</h2>
        <p className="text-xs text-[#9CA3AF] mt-1 mb-5">
          Console locked for <span className="text-[#38BDF8] font-mono">@{currentUser.handle}</span>
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN or press Unlock"
              className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg px-3 py-2 text-center text-sm text-[#F3F4F6] placeholder-[#6B7280] tracking-widest font-mono"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-[#EF4444] flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Invalid PIN authentication</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
          >
            <Unlock className="w-4 h-4" />
            Restore Tactical Session
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-[#232733] flex items-center justify-between text-[11px] text-[#6B7280] font-mono">
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#38BDF8]" />
            <span>ENCLAVE: ACTIVE</span>
          </div>
          <span>KEY: {currentUser.keyFingerprint.substring(0, 10)}</span>
        </div>
      </div>
    </div>
  );
};
