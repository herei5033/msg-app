import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Fingerprint, Cpu, Radio, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { allUsers, login, createAccount } = useAuth();
  const [tab, setTab] = useState<'profiles' | 'custom' | 'hardware'>('profiles');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState('');
  const [hardwareProgress, setHardwareProgress] = useState(false);
  const [hardwareSuccess, setHardwareSuccess] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) return;
    createAccount(name, handle, role);
  };

  const simulateHardwareKey = (userId: string) => {
    setHardwareProgress(true);
    setTimeout(() => {
      setHardwareProgress(false);
      setHardwareSuccess(true);
      setTimeout(() => {
        login(userId);
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F] flex items-center justify-center p-4">
      {/* Ambient background grid and subtle illumination */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#23273315_1px,transparent_1px),linear-gradient(to_bottom,#23273315_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative w-full max-w-xl bg-[#11131A] border border-[#232733] rounded-xl shadow-2xl p-6 sm:p-8 overflow-hidden glow-overlay">
        {/* Top Avionics Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#232733] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#181B24] border border-[#232733] flex items-center justify-center text-[#3B82F6]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-[#F3F4F6]">OBSIDIAN SIGNAL</h1>
                <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-[#181B24] border border-[#232733] text-[#38BDF8]">
                  v3.8.2
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5">High-Cadence Tactical Node Handshake</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#10B981] bg-[#181B24] border border-[#232733] px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            <span>MESH READY</span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#090A0F] border border-[#232733] rounded-lg mb-6">
          <button
            onClick={() => setTab('profiles')}
            className={`py-1.5 px-3 text-xs font-medium rounded transition-all ${
              tab === 'profiles'
                ? 'bg-[#181B24] text-[#F3F4F6] border border-[#2E3445] shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Operator Selection
          </button>
          <button
            onClick={() => setTab('hardware')}
            className={`py-1.5 px-3 text-xs font-medium rounded transition-all flex items-center justify-center gap-1.5 ${
              tab === 'hardware'
                ? 'bg-[#181B24] text-[#F3F4F6] border border-[#2E3445] shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-[#38BDF8]" />
            Passkey / FIDO2
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`py-1.5 px-3 text-xs font-medium rounded transition-all flex items-center justify-center gap-1.5 ${
              tab === 'custom'
                ? 'bg-[#181B24] text-[#F3F4F6] border border-[#2E3445] shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Enrol Identity
          </button>
        </div>

        {/* Tab 1: Operator Selection List */}
        {tab === 'profiles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <span>SELECT ACTIVE STATION OPERATOR</span>
              <span className="font-mono text-[11px] text-[#6B7280]">ED25519 VERIFIED</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => login(user.id)}
                  className="group flex items-center justify-between p-3 rounded-lg bg-[#181B24] hover:bg-[#1F232E] border border-[#232733] hover:border-[#3B82F6]/50 cursor-pointer transition-all duration-150"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#2E3445]"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#181B24] ${
                          user.status === 'active'
                            ? 'bg-[#10B981]'
                            : user.status === 'busy'
                            ? 'bg-[#F59E0B]'
                            : user.status === 'urgent'
                            ? 'bg-[#EF4444]'
                            : 'bg-[#64748B]'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#F3F4F6] group-hover:text-white truncate">
                          {user.name}
                        </span>
                        <span className="text-xs font-mono text-[#38BDF8]">@{user.handle}</span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="hidden sm:inline-block font-mono text-[11px] text-[#6B7280] group-hover:text-[#9CA3AF]">
                      {user.keyFingerprint.substring(0, 14)}...
                    </span>
                    <div className="w-7 h-7 rounded bg-[#232733] group-hover:bg-[#3B82F6] flex items-center justify-center text-[#9CA3AF] group-hover:text-white transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Passkey / Hardware Key simulation */}
        {tab === 'hardware' && (
          <div className="py-4 text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#181B24] border border-[#2E3445] flex items-center justify-center text-[#3B82F6] shadow-lg">
              <Fingerprint className={`w-8 h-8 ${hardwareProgress ? 'animate-pulse text-[#38BDF8]' : ''}`} />
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-[#F3F4F6]">Cryptographic Security Token</h2>
              <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto">
                Insert your hardware token or authorize via biometric security enclave to sign authentication challenge.
              </p>
            </div>

            {hardwareProgress && (
              <div className="space-y-2 p-3 bg-[#090A0F] border border-[#232733] rounded-lg text-xs font-mono text-[#38BDF8]">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
                  <span>NEGOTIATING ZERO-KNOWLEDGE HANDSHAKE...</span>
                </div>
                <div className="text-[11px] text-[#6B7280]">ECDH P-256 Key Exchange Verified</div>
              </div>
            )}

            {hardwareSuccess && (
              <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg text-xs text-[#10B981] flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Identity Authenticated. Opening Terminal...</span>
              </div>
            )}

            {!hardwareProgress && !hardwareSuccess && (
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => simulateHardwareKey('usr-alex')}
                  className="w-full py-2.5 px-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                >
                  <Fingerprint className="w-4 h-4" />
                  Tap Biometric Sensor / Key
                </button>
                <span className="text-[11px] font-mono text-[#6B7280]">
                  Target station: node-fra-mesh-01 (18ms)
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Enrol New Identity */}
        {tab === 'custom' && (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#c2c6d6]">OPERATOR FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rachel Sterling"
                required
                className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg px-3 py-2 text-sm text-[#F3F4F6] placeholder-[#6B7280]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#c2c6d6]">HANDLE / IDENTIFIER</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm font-mono text-[#6B7280]">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="rachel.s"
                  required
                  className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-7 pr-3 py-2 text-sm text-[#F3F4F6] placeholder-[#6B7280] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#c2c6d6]">ENGINEERING DISCIPLINE / ROLE</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Distributed Consensus Engineer"
                className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg px-3 py-2 text-sm text-[#F3F4F6] placeholder-[#6B7280]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-all mt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
            >
              <Shield className="w-4 h-4" />
              Generate Enclave Keys & Connect
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#232733] flex items-center justify-between text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Air-gap Protocol Curve25519</span>
          </div>
          <span className="font-mono">ENCRYPTION: HARDENED</span>
        </div>
      </div>
    </div>
  );
};
