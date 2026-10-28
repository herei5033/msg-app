import React, { useState } from 'react';
import { Channel, User, Message } from '../types';
import {
  Shield,
  Key,
  Users,
  Pin,
  FileCode,
  FileText,
  Activity,
  Cpu,
  X,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Radio,
} from 'lucide-react';

interface FlyoutInspectorProps {
  channel: Channel;
  users: User[];
  pinnedMessages: Message[];
  allChannelMessages: Message[];
  onClose: () => void;
  onOpenDm: (userId: string) => void;
}

export const FlyoutInspector: React.FC<FlyoutInspectorProps> = ({
  channel,
  users,
  pinnedMessages,
  allChannelMessages,
  onClose,
  onOpenDm,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'pinned' | 'files'>('info');
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFingerprint(true);
    setTimeout(() => setCopiedFingerprint(false), 1500);
  };

  // Collect snippets and attachments from all messages
  const codeSnippets = allChannelMessages.filter((m) => m.codeSnippet);
  const attachments = allChannelMessages.flatMap((m) => m.attachments || []);

  return (
    <div className="w-80 sm:w-[340px] h-screen flex flex-col bg-[#11131A] border-l border-[#232733] select-none z-20 shrink-0">
      {/* Top Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#232733]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-xs font-semibold text-[#F3F4F6] tracking-wider uppercase">
            CHANNEL INSPECTOR
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24] transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-0.5 p-1 bg-[#090A0F] border-b border-[#232733] text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-1.5 rounded transition-colors ${
            activeTab === 'info'
              ? 'bg-[#181B24] text-[#38BDF8] border border-[#2E3445]'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`py-1.5 rounded transition-colors ${
            activeTab === 'members'
              ? 'bg-[#181B24] text-[#38BDF8] border border-[#2E3445]'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Roster ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('pinned')}
          className={`py-1.5 rounded transition-colors ${
            activeTab === 'pinned'
              ? 'bg-[#181B24] text-[#38BDF8] border border-[#2E3445]'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Pins ({pinnedMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`py-1.5 rounded transition-colors ${
            activeTab === 'files'
              ? 'bg-[#181B24] text-[#38BDF8] border border-[#2E3445]'
              : 'text-[#9CA3AF] hover:text-white'
          }`}
        >
          Assets
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Tab 1: Telemetry & Security */}
        {activeTab === 'info' && (
          <div className="space-y-4 text-xs">
            {/* Channel metadata tile */}
            <div className="p-3 rounded-lg bg-[#181B24] border border-[#232733] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                <span>STREAM IDENTIFIER</span>
                <span className="font-mono text-[#38BDF8]">#{channel.name}</span>
              </div>
              <p className="text-xs text-[#E2E2EC] font-normal leading-relaxed">
                {channel.topic || channel.description}
              </p>
            </div>

            {/* Cryptographic Encryption Enclave */}
            <div className="p-3 rounded-lg bg-[#181B24] border border-[#232733] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#6B7280] uppercase">
                  Encryption Handshake
                </span>
                <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  E2EE ACTIVE
                </span>
              </div>

              <div className="text-[11px] font-mono text-[#9CA3AF] bg-[#090A0F] p-2 rounded border border-[#232733] flex items-center justify-between">
                <span className="truncate">{channel.encryptionFingerprint}</span>
                <button
                  onClick={() => handleCopy(channel.encryptionFingerprint)}
                  className="p-1 hover:text-[#38BDF8]"
                  title="Copy Fingerprint"
                >
                  {copiedFingerprint ? (
                    <Check className="w-3 h-3 text-[#10B981]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <div className="text-[10px] text-[#6B7280] space-y-1 pt-1 font-mono">
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="text-[#c2c6d6]">Signal Double Ratchet</span>
                </div>
                <div className="flex justify-between">
                  <span>Key Derivation:</span>
                  <span className="text-[#c2c6d6]">HKDF-SHA256</span>
                </div>
                <div className="flex justify-between">
                  <span>Symmetric Cipher:</span>
                  <span className="text-[#c2c6d6]">ChaCha20-Poly1305</span>
                </div>
              </div>
            </div>

            {/* Mesh Node Status */}
            <div className="p-3 rounded-lg bg-[#181B24] border border-[#232733] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] uppercase">
                <span>Cluster Node Route</span>
                <span className="text-[#10B981] flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  ONLINE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div className="bg-[#090A0F] p-2 rounded border border-[#232733]">
                  <div className="text-[#6B7280] text-[9px]">PING LATENCY</div>
                  <div className="text-[#10B981] font-bold">14.2 ms</div>
                </div>
                <div className="bg-[#090A0F] p-2 rounded border border-[#232733]">
                  <div className="text-[#6B7280] text-[9px]">PACKET LOSS</div>
                  <div className="text-[#38BDF8] font-bold">0.00 %</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Operators Roster */}
        {activeTab === 'members' && (
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-2">
              AUTHORIZED OPERATORS IN STREAM
            </div>

            <div className="space-y-1">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#181B24] border border-[#232733] hover:border-[#2E3445] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#2E3445]"
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#181B24] ${
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
                      <div className="text-xs font-semibold text-[#F3F4F6] truncate">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] truncate">{user.role}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenDm(user.id)}
                    className="p-1.5 rounded text-[#9CA3AF] hover:text-[#38BDF8] hover:bg-[#11131A] transition-colors"
                    title={`Direct Message @${user.handle}`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Pinned Messages */}
        {activeTab === 'pinned' && (
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-[#6B7280] uppercase">
              PINNED CRITICAL DISPATCHES ({pinnedMessages.length})
            </div>

            {pinnedMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3 rounded-lg bg-[#181B24] border border-[#3B82F6]/30 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                  <span className="text-[#38BDF8] flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    PINNED ITEM
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="text-xs text-[#E2E2EC] line-clamp-3 leading-relaxed">{msg.text}</p>
              </div>
            ))}

            {pinnedMessages.length === 0 && (
              <div className="p-6 text-center text-xs text-[#6B7280]">
                No dispatches pinned in this stream.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Assets & Snippets */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            {/* Code snippets */}
            <div>
              <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-2">
                CODE SNIPPETS ({codeSnippets.length})
              </div>
              <div className="space-y-1.5">
                {codeSnippets.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-lg bg-[#181B24] border border-[#232733] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-mono font-medium text-[#F3F4F6] truncate">
                          {msg.codeSnippet?.title || 'snippet'}
                        </div>
                        <div className="text-[10px] uppercase text-[#6B7280] font-mono">
                          {msg.codeSnippet?.language}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(msg.codeSnippet!.code)}
                      className="p-1 text-[#9CA3AF] hover:text-white"
                      title="Copy code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {codeSnippets.length === 0 && (
                  <div className="text-xs text-[#6B7280] p-2">No code snippets posted yet.</div>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-2">
                SHARED MEDIA & LOGS ({attachments.length})
              </div>
              <div className="space-y-1.5">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-2.5 rounded-lg bg-[#181B24] border border-[#232733] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#10B981] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs text-[#F3F4F6] truncate">{att.name}</div>
                        <div className="text-[10px] font-mono text-[#6B7280]">{att.size}</div>
                      </div>
                    </div>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-[#9CA3AF] hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
