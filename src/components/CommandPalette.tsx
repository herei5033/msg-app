import React, { useState, useEffect, useRef } from 'react';
import { Channel, User, Workspace } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Hash,
  Radio,
  Lock,
  Settings,
  Mic,
  Activity,
  UserCheck,
  Flame,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  workspaces: Workspace[];
  onSelectChannel: (channelId: string) => void;
  onSelectWorkspace: (workspace: Workspace) => void;
  onOpenSettings: () => void;
  onToggleVoice: () => void;
  onToggleInspector: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  channels,
  workspaces,
  onSelectChannel,
  onSelectWorkspace,
  onOpenSettings,
  onToggleVoice,
  onToggleInspector,
}) => {
  const { allUsers, switchUser, updateStatus, lockTerminal } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build command items
  const items = [
    // Channels
    ...channels.map((c) => ({
      id: `chn-${c.id}`,
      type: 'channel' as const,
      title: `${c.type === 'channel' ? '#' : '@'}${c.name}`,
      subtitle: c.topic || c.description,
      icon: c.type === 'channel' ? Hash : Radio,
      action: () => {
        onSelectChannel(c.id);
        onClose();
      },
    })),
    // Status Actions
    {
      id: 'st-active',
      type: 'action' as const,
      title: 'Set Status: Active (Ready)',
      subtitle: 'Signal mesh availability with green pulse',
      icon: Activity,
      action: () => {
        updateStatus('active');
        onClose();
      },
    },
    {
      id: 'st-busy',
      type: 'action' as const,
      title: 'Set Status: Busy (DND)',
      subtitle: 'Mute broadcast notifications',
      icon: Activity,
      action: () => {
        updateStatus('busy');
        onClose();
      },
    },
    {
      id: 'st-urgent',
      type: 'action' as const,
      title: 'Set Status: Incident Commander (P1)',
      subtitle: 'Flag urgent incident triage attention',
      icon: Flame,
      action: () => {
        updateStatus('urgent');
        onClose();
      },
    },
    // Switch Station Operators
    ...allUsers.map((u) => ({
      id: `user-${u.id}`,
      type: 'operator' as const,
      title: `Switch Station to @${u.handle} (${u.name})`,
      subtitle: u.role,
      icon: UserCheck,
      action: () => {
        switchUser(u.id);
        onClose();
      },
    })),
    // Workspaces
    ...workspaces.map((ws) => ({
      id: `ws-${ws.id}`,
      type: 'workspace' as const,
      title: `Switch Workspace: ${ws.name}`,
      subtitle: `${ws.region} · ${ws.cluster}`,
      icon: Layers,
      action: () => {
        onSelectWorkspace(ws);
        onClose();
      },
    })),
    // Voice
    {
      id: 'act-voice',
      type: 'action' as const,
      title: 'Toggle Tactical Voice War Room',
      subtitle: 'Connect/disconnect low-latency Opus audio stream',
      icon: Mic,
      action: () => {
        onToggleVoice();
        onClose();
      },
    },
    // Toggle Inspector
    {
      id: 'act-inspector',
      type: 'action' as const,
      title: 'Toggle Channel Inspector / Telemetry',
      subtitle: 'Open or close right-side diagnostic panel',
      icon: Shield,
      action: () => {
        onToggleInspector();
        onClose();
      },
    },
    // Lock Terminal
    {
      id: 'act-lock',
      type: 'action' as const,
      title: 'Lock Console Terminal',
      subtitle: 'Secure workstation with PIN/Biometric lock',
      icon: Lock,
      action: () => {
        lockTerminal();
        onClose();
      },
    },
    // Settings
    {
      id: 'act-settings',
      type: 'action' as const,
      title: 'Open Tactical Settings & Cryptography Vault',
      subtitle: 'Manage Curve25519 keys, audio routing, and mesh pings',
      icon: Settings,
      action: () => {
        onOpenSettings();
        onClose();
      },
    },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#090A0F]/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#11131A] border border-[#2E3445] rounded-xl shadow-2xl overflow-hidden glow-overlay"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#232733] bg-[#181B24]">
          <Search className="w-4 h-4 text-[#38BDF8] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, channel, operator, or setting..."
            className="w-full bg-transparent border-none text-sm text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#6B7280] bg-[#090A0F] border border-[#232733] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-0.5">
          {filtered.map((item, index) => {
            const isSelected = index === selectedIndex;
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#181B24] border-l-2 border-[#3B82F6]' : 'hover:bg-[#181B24]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#3B82F6] text-white' : 'bg-[#1F232E] text-[#9CA3AF]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-medium truncate ${
                        isSelected ? 'text-[#F3F4F6]' : 'text-[#9CA3AF]'
                      }`}
                    >
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className="text-[10px] font-mono text-[#6B7280] truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#38BDF8] shrink-0 ml-2">
                    <span>Execute</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-[#6B7280]">
              No actions match &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-[#232733] bg-[#0C0E15] flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#38BDF8]">OBSIDIAN RUNNER</span>
        </div>
      </div>
    </div>
  );
};
