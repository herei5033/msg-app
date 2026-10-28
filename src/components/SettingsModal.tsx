import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Shield,
  Key,
  Volume2,
  Radio,
  Cpu,
  X,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Sliders,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'security' | 'audio' | 'mesh'>('security');
  const [copiedKey, setCopiedKey] = useState(false);
  const [keyRegenerated, setKeyRegenerated] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticSounds, setHapticSounds] = useState(true);
  const [autoRatchet, setAutoRatchet] = useState(true);
  const [region, setRegion] = useState('eu-central-1 (Frankfurt)');

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(currentUser.keyFingerprint);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1500);
  };

  const handleRegenerateKey = () => {
    setKeyRegenerated(true);
    setTimeout(() => setKeyRegenerated(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#11131A] border border-[#2E3445] rounded-xl shadow-2xl overflow-hidden glow-overlay">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232733] bg-[#181B24]">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h2 className="text-sm font-semibold text-[#F3F4F6]">SYSTEM & ENCLAVE CONFIGURATION</h2>
              <p className="text-[11px] text-[#6B7280]">Obsidian Signal Station Preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9CA3AF] hover:text-white hover:bg-[#11131A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-[#090A0F] border-b border-[#232733] text-xs">
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'security'
                ? 'bg-[#181B24] text-[#38BDF8] border border-[#2E3445]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Key Enclave & E2EE</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'audio'
                ? 'bg-[#181B24] text-[#38BDF8] border border-[#2E3445]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Tactical Avionics Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('mesh')}
            className={`py-2 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'mesh'
                ? 'bg-[#181B24] text-[#38BDF8] border border-[#2E3445]'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Mesh Telemetry</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[460px] overflow-y-auto text-xs">
          {/* Tab 1: Key Enclave */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-[#181B24] border border-[#232733] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F3F4F6]">Current Operator Public Fingerprint</span>
                  <span className="font-mono text-[10px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                    ED25519-VERIFIED
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#090A0F] p-2.5 rounded border border-[#232733] font-mono text-[11px] text-[#38BDF8]">
                  <span>{currentUser.keyFingerprint}</span>
                  <button
                    onClick={handleCopyKey}
                    className="p-1 hover:text-white transition-colors"
                    title="Copy Key Fingerprint"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  This cryptographic fingerprint authenticates all outgoing dispatches signed from station {currentUser.handle}.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#181B24] border border-[#232733] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#F3F4F6]">Signal Double Ratchet Auto-Rotation</h3>
                    <p className="text-[11px] text-[#9CA3AF]">Rotate ephemeral session keys every 50 dispatches</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRatchet}
                    onChange={(e) => setAutoRatchet(e.target.checked)}
                    className="rounded border-[#232733] bg-[#090A0F] text-[#3B82F6]"
                  />
                </div>

                <div className="pt-2 border-t border-[#232733] flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#F3F4F6]">Emergency Key Roll</h3>
                    <p className="text-[11px] text-[#6B7280]">Invalidate existing keypair and derive new station identity</p>
                  </div>
                  <button
                    onClick={handleRegenerateKey}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#232733] hover:bg-[#2E3445] text-white text-[11px] transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${keyRegenerated ? 'animate-spin text-[#38BDF8]' : ''}`} />
                    <span>{keyRegenerated ? 'Keys Deriving...' : 'Rotate Keypair'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Avionics Audio */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-[#181B24] border border-[#232733] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#F3F4F6]">High-Priority Audio Beep</h3>
                    <p className="text-[11px] text-[#9CA3AF]">Sound emergency tone when a P1 incident dispatch arrives</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="rounded border-[#232733] bg-[#090A0F] text-[#3B82F6]"
                  />
                </div>

                <div className="pt-2 border-t border-[#232733] flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#F3F4F6]">Tactical Avionics Interface Haptics</h3>
                    <p className="text-[11px] text-[#9CA3AF]">Play soft micro-tones on sending message or switching channels</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hapticSounds}
                    onChange={(e) => setHapticSounds(e.target.checked)}
                    className="rounded border-[#232733] bg-[#090A0F] text-[#3B82F6]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Mesh Telemetry */}
          {activeTab === 'mesh' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-[#181B24] border border-[#232733] space-y-3">
                <div>
                  <label className="font-medium text-[#F3F4F6] block mb-1">Preferred Edge Transit Gateway</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-[#090A0F] border border-[#232733] focus:border-[#3B82F6] rounded-lg px-3 py-2 text-xs text-[#F3F4F6]"
                  >
                    <option value="eu-central-1 (Frankfurt)">eu-central-1 (Frankfurt) · 14ms</option>
                    <option value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia) · 28ms</option>
                    <option value="ap-northeast-1 (Tokyo)">ap-northeast-1 (Tokyo) · 72ms</option>
                    <option value="sa-east-1 (São Paulo)">sa-east-1 (São Paulo) · 110ms</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-[#232733] grid grid-cols-2 gap-3 text-mono text-[11px]">
                  <div className="bg-[#090A0F] p-2.5 rounded border border-[#232733]">
                    <div className="text-[#6B7280]">TCP KEEPALIVE</div>
                    <div className="text-[#10B981] font-bold mt-1">15s / SO_KEEPALIVE</div>
                  </div>
                  <div className="bg-[#090A0F] p-2.5 rounded border border-[#232733]">
                    <div className="text-[#6B7280]">BUFFER CONGESTION</div>
                    <div className="text-[#38BDF8] font-bold mt-1">BBRv3 Algorithmic</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#232733] bg-[#0C0E15] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-1.5 text-xs text-[#EF4444] hover:underline"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Operator Session</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium rounded-md transition-colors"
          >
            Save & Return
          </button>
        </div>
      </div>
    </div>
  );
};
