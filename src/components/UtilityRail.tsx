import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Workspace, UserStatus } from '../types';
import {
  Radio,
  Hash,
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Lock,
  LogOut,
  ChevronRight,
  Shield,
  Layers,
  Search,
  Check,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface UtilityRailProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  activeVoiceConnected: boolean;
  onToggleVoice: () => void;
  isRailExpanded: boolean;
  onToggleRailExpand: () => void;
}

export const UtilityRail: React.FC<UtilityRailProps> = ({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  onOpenSettings,
  onOpenCommandPalette,
  activeVoiceConnected,
  onToggleVoice,
  isRailExpanded,
  onToggleRailExpand,
}) => {
  const { currentUser, allUsers, switchUser, updateStatus, lockTerminal, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [audioDeafened, setAudioDeafened] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'bg-[#10B981]';
      case 'busy':
        return 'bg-[#F59E0B]';
      case 'urgent':
        return 'bg-[#EF4444] animate-pulse';
      case 'idle':
      default:
        return 'bg-[#64748B]';
    }
  };

  return (
    <aside
      className={`h-screen flex flex-col bg-[#11131A] border-r border-[#232733] select-none transition-all duration-200 z-30 shrink-0 ${
        isRailExpanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* Top Brand / Signal Logo */}
      <div className="h-14 flex items-center px-3 border-b border-[#232733] justify-between">
        <button
          onClick={onToggleRailExpand}
          className="flex items-center gap-3 w-full hover:opacity-90 focus:outline-none"
          title={isRailExpanded ? 'Collapse Navigation Rail' : 'Expand Navigation Rail'}
        >
          <div className="w-10 h-10 rounded-lg bg-[#181B24] border border-[#232733] flex items-center justify-center text-[#3B82F6] shrink-0 hover:border-[#3B82F6]/50 transition-colors">
            <Radio className="w-5 h-5" />
          </div>
          {isRailExpanded && (
            <div className="text-left overflow-hidden">
              <span className="text-sm font-semibold tracking-tight text-[#F3F4F6] block truncate">
                OBSIDIAN
              </span>
              <span className="text-[10px] font-mono text-[#38BDF8] block tracking-wider">
                TACTICAL MESH
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Workspace Stack */}
      <div className="p-2 space-y-2 border-b border-[#232733]">
        {isRailExpanded && (
          <div className="px-2 pt-1 pb-1 text-[10px] font-mono text-[#6B7280] uppercase tracking-wider flex items-center justify-between">
            <span>Workspaces</span>
            <Layers className="w-3 h-3 text-[#38BDF8]" />
          </div>
        )}

        <div className="space-y-1.5">
          {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspace.id;
            return (
              <button
                key={ws.id}
                onClick={() => onSelectWorkspace(ws)}
                className={`relative w-full rounded-lg transition-all flex items-center ${
                  isRailExpanded ? 'p-2 gap-3 text-left' : 'h-11 justify-center'
                } ${
                  isActive
                    ? 'bg-[#181B24] border border-[#3B82F6]/50 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24]/70 border border-transparent'
                }`}
                title={`${ws.name} (${ws.region})`}
              >
                {/* Active Indicator pip */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-[#3B82F6]" />
                )}

                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isActive
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-[#181B24] border border-[#232733] text-[#9CA3AF]'
                  }`}
                >
                  {ws.shortCode}
                </div>

                {isRailExpanded && (
                  <div className="min-w-0 overflow-hidden">
                    <div className="text-xs font-medium truncate text-[#F3F4F6]">{ws.name}</div>
                    <div className="text-[10px] font-mono text-[#6B7280] truncate">{ws.region}</div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="flex-1 p-2 space-y-1 overflow-y-auto">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full rounded-lg text-xs transition-colors flex items-center text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24] ${
            isRailExpanded ? 'px-3 py-2 gap-3' : 'h-10 justify-center'
          }`}
          title="Command Palette (Cmd+K)"
        >
          <Search className="w-4 h-4 text-[#38BDF8] shrink-0" />
          {isRailExpanded && (
            <div className="flex items-center justify-between w-full">
              <span>Command Palette</span>
              <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-[#090A0F] border border-[#232733] text-[#6B7280]">
                ⌘K
              </kbd>
            </div>
          )}
        </button>

        <button
          onClick={onToggleVoice}
          className={`w-full rounded-lg text-xs transition-all flex items-center ${
            isRailExpanded ? 'px-3 py-2 gap-3' : 'h-10 justify-center'
          } ${
            activeVoiceConnected
              ? 'bg-[#181B24] border border-[#10B981]/50 text-[#10B981]'
              : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24]'
          }`}
          title="Tactical Voice War Room"
        >
          <div className="relative shrink-0">
            <Radio className={`w-4 h-4 ${activeVoiceConnected ? 'text-[#10B981] animate-pulse' : ''}`} />
            {activeVoiceConnected && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            )}
          </div>
          {isRailExpanded && (
            <div className="flex items-center justify-between w-full">
              <span>War Room Voice</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  activeVoiceConnected
                    ? 'bg-[#10B981]/20 text-[#10B981]'
                    : 'bg-[#090A0F] text-[#6B7280]'
                }`}
              >
                {activeVoiceConnected ? 'LIVE' : 'STANDBY'}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Avionics Audio Controls (Mic & Audio Deafener) */}
      <div className="p-2 border-t border-[#232733] bg-[#0C0E15]">
        <div className={`flex items-center ${isRailExpanded ? 'justify-between px-2 py-1' : 'flex-col gap-1.5'}`}>
          <button
            onClick={() => setMicMuted(!micMuted)}
            className={`p-2 rounded-md transition-colors ${
              micMuted
                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24]'
            }`}
            title={micMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setAudioDeafened(!audioDeafened)}
            className={`p-2 rounded-md transition-colors ${
              audioDeafened
                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24]'
            }`}
            title={audioDeafened ? 'Undeafen Audio' : 'Deafen Audio'}
          >
            {audioDeafened ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-md text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24] transition-colors"
            title="Mesh & Enclave Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Operator Profile Tile & Status Popover */}
      <div className="p-2 border-t border-[#232733] relative" ref={menuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`w-full rounded-lg transition-all flex items-center hover:bg-[#181B24] ${
            isRailExpanded ? 'p-2 gap-3 text-left' : 'h-11 justify-center'
          } ${showUserMenu ? 'bg-[#181B24] border border-[#2E3445]' : ''}`}
          title={`Operator: ${currentUser.name} (@${currentUser.handle})`}
        >
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-[#2E3445]"
            />
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#11131A] ${getStatusColor(
                currentUser.status
              )}`}
            />
          </div>

          {isRailExpanded && (
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-[#F3F4F6] truncate">{currentUser.name}</div>
              <div className="text-[10px] font-mono text-[#38BDF8] truncate">@{currentUser.handle}</div>
            </div>
          )}
        </button>

        {/* User Context & Status Menu */}
        {showUserMenu && (
          <div className="absolute left-full bottom-2 ml-2 w-72 bg-[#1F232E] border border-[#2E3445] rounded-xl shadow-2xl p-3 z-50 glow-overlay animate-in fade-in duration-150">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#2E3445]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-[#3B82F6]/50"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white truncate">{currentUser.name}</div>
                <div className="text-xs text-[#9CA3AF] truncate">{currentUser.role}</div>
                <div className="text-[10px] font-mono text-[#38BDF8] truncate">
                  {currentUser.keyFingerprint}
                </div>
              </div>
            </div>

            {/* Set Operational Status */}
            <div className="py-2 border-b border-[#2E3445]">
              <div className="text-[10px] font-mono text-[#9CA3AF] uppercase mb-1.5">
                Operational Status
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {(
                  [
                    { id: 'active', label: 'Active', color: 'bg-[#10B981]' },
                    { id: 'busy', label: 'Busy (DND)', color: 'bg-[#F59E0B]' },
                    { id: 'idle', label: 'Away / Idle', color: 'bg-[#64748B]' },
                    { id: 'urgent', label: 'Incident P1', color: 'bg-[#EF4444]' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      updateStatus(st.id);
                    }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                      currentUser.status === st.id
                        ? 'bg-[#181B24] text-white border border-[#3B82F6]/40'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-[#181B24]/60'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${st.color}`} />
                    <span className="text-[11px] truncate">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Switch Operator */}
            <div className="py-2 border-b border-[#2E3445]">
              <div className="text-[10px] font-mono text-[#9CA3AF] uppercase mb-1.5 flex items-center justify-between">
                <span>Switch Station Operator</span>
                <UserCheck className="w-3 h-3 text-[#38BDF8]" />
              </div>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {allUsers
                  .filter((u) => u.id !== currentUser.id)
                  .map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded text-left text-xs text-[#9CA3AF] hover:text-white hover:bg-[#181B24] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="truncate">{user.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6B7280]">@{user.handle}</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 space-y-1">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  lockTerminal();
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-[#9CA3AF] hover:text-white hover:bg-[#181B24] transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Lock Console Terminal</span>
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect & Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
