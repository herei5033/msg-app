import React, { useState, useMemo } from 'react';
import { Channel, User, Workspace } from '../types';
import {
  Hash,
  Lock,
  Plus,
  Search,
  BellOff,
  Flame,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  ShieldCheck,
  Activity,
} from 'lucide-react';

interface ConversationIndexProps {
  workspace: Workspace;
  channels: Channel[];
  users: User[];
  activeChannelId: string;
  onSelectChannel: (channelId: string) => void;
  onAddChannel: (channel: { name: string; description: string; isPrivate: boolean }) => void;
  onOpenCommandPalette: () => void;
}

export const ConversationIndex: React.FC<ConversationIndexProps> = ({
  workspace,
  channels,
  users,
  activeChannelId,
  onSelectChannel,
  onAddChannel,
  onOpenCommandPalette,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'channels' | 'dms'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [newChannelPrivate, setNewChannelPrivate] = useState(false);

  // Group channels and DMs
  const filteredItems = useMemo(() => {
    return channels.filter((item) => {
      // Search text match
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Filter category
      if (filterType === 'unread') return item.unreadCount > 0;
      if (filterType === 'channels') return item.type === 'channel';
      if (filterType === 'dms') return item.type === 'dm';
      return true;
    });
  }, [channels, searchQuery, filterType]);

  const channelList = filteredItems.filter((i) => i.type === 'channel');
  const dmList = filteredItems.filter((i) => i.type === 'dm');

  const getUserForDm = (dmUserId?: string) => {
    if (!dmUserId) return null;
    return users.find((u) => u.id === dmUserId);
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    onAddChannel({
      name: newChannelName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: newChannelDesc.trim() || 'General tactical channel',
      isPrivate: newChannelPrivate,
    });
    setNewChannelName('');
    setNewChannelDesc('');
    setNewChannelPrivate(false);
    setIsAddModalOpen(false);
  };

  return (
    <div className="w-80 h-screen flex flex-col bg-[#11131A] border-r border-[#232733] select-none shrink-0">
      {/* Workspace Header Banner */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#232733] bg-[#11131A]">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F3F4F6] truncate">
            <span>{workspace.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block shadow-[0_0_6px_#10B981]" />
          </div>
          <div className="text-[10px] font-mono text-[#6B7280] truncate mt-0.5">
            {workspace.cluster} · {workspace.activeCount} nodes active
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-7 h-7 rounded bg-[#181B24] hover:bg-[#1F232E] border border-[#232733] hover:border-[#3B82F6]/50 text-[#9CA3AF] hover:text-[#F3F4F6] flex items-center justify-center transition-colors"
          title="Create New Channel"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar with Tactical shortcut */}
      <div className="p-3 pb-2 border-b border-[#232733]/60">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-[#6B7280]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter channels & direct threads..."
            className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-xs text-[#F3F4F6] placeholder-[#6B7280] rounded-lg pl-8 pr-12 py-1.5 transition-all"
          />
          <button
            onClick={onOpenCommandPalette}
            className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono text-[#6B7280] hover:text-[#38BDF8] bg-[#090A0F] border border-[#232733] rounded"
            title="Open Command Palette"
          >
            ⌘K
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mt-2">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'channels', label: 'Channels' },
              { id: 'dms', label: 'DMs' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                filterType === tab.id
                  ? 'bg-[#181B24] text-[#38BDF8] border border-[#2E3445]'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stream List (Channels & DMs) */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Channels Section */}
        {channelList.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase">
                Active Channels ({channelList.length})
              </span>
            </div>

            <div className="space-y-0.5">
              {channelList.map((channel) => {
                const isActive = channel.id === activeChannelId;
                return (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                    className={`w-full h-14 px-2.5 rounded-md flex items-center justify-between transition-colors text-left group ${
                      isActive
                        ? 'bg-[#181B24] border-l-2 border-[#3B82F6]'
                        : 'bg-transparent hover:bg-[#181B24]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                            : 'bg-[#181B24] text-[#6B7280] group-hover:text-[#9CA3AF]'
                        }`}
                      >
                        {channel.isPrivate ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Hash className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isActive ? 'text-[#F3F4F6]' : 'text-[#9CA3AF] group-hover:text-[#F3F4F6]'
                            }`}
                          >
                            {channel.name}
                          </span>
                          {channel.isMuted && (
                            <BellOff className="w-3 h-3 text-[#6B7280] shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                          {channel.topic || channel.description}
                        </p>
                      </div>
                    </div>

                    {/* Unread badge */}
                    {channel.unreadCount > 0 && (
                      <span
                        className={`ml-2 min-w-[18px] h-[18px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-mono font-semibold shrink-0 ${
                          channel.isMuted
                            ? 'bg-[#232733] text-[#9CA3AF]'
                            : 'bg-[#3B82F6] text-white'
                        }`}
                      >
                        {channel.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Direct Messages Section */}
        {dmList.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-mono text-[#6B7280] tracking-wider uppercase">
                Encrypted Direct Threads ({dmList.length})
              </span>
            </div>

            <div className="space-y-0.5">
              {dmList.map((dm) => {
                const isActive = dm.id === activeChannelId;
                const dmUser = getUserForDm(dm.dmUserId);
                const statusColor =
                  dmUser?.status === 'active'
                    ? 'bg-[#10B981]'
                    : dmUser?.status === 'busy'
                    ? 'bg-[#F59E0B]'
                    : dmUser?.status === 'urgent'
                    ? 'bg-[#EF4444]'
                    : 'bg-[#64748B]';

                return (
                  <button
                    key={dm.id}
                    onClick={() => onSelectChannel(dm.id)}
                    className={`w-full h-14 px-2.5 rounded-md flex items-center justify-between transition-colors text-left group ${
                      isActive
                        ? 'bg-[#181B24] border-l-2 border-[#3B82F6]'
                        : 'bg-transparent hover:bg-[#181B24]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        {dmUser ? (
                          <img
                            src={dmUser.avatar}
                            alt={dmUser.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#2E3445]"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#181B24] border border-[#2E3445] flex items-center justify-center text-xs font-mono text-[#38BDF8]">
                            @
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#11131A] ${statusColor}`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isActive ? 'text-[#F3F4F6]' : 'text-[#9CA3AF] group-hover:text-[#F3F4F6]'
                            }`}
                          >
                            {dmUser ? dmUser.name : dm.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#38BDF8]">
                            @{dmUser?.handle || dm.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] truncate mt-0.5">
                          {dm.topic || 'E2EE Signal session'}
                        </p>
                      </div>
                    </div>

                    {dm.unreadCount > 0 && (
                      <span className="ml-2 min-w-[18px] h-[18px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-mono font-semibold shrink-0 bg-[#3B82F6] text-white">
                        {dm.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="p-6 text-center text-xs text-[#6B7280]">
            No channels or direct messages match &quot;{searchQuery}&quot;
          </div>
        )}
      </div>

      {/* Network Mesh Telemetry Footer */}
      <div className="p-2.5 border-t border-[#232733] bg-[#0C0E15] flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-[#10B981]" />
          <span>MESH: 14ms</span>
        </div>
        <div className="flex items-center gap-1 text-[#38BDF8]">
          <ShieldCheck className="w-3 h-3" />
          <span>E2EE ACTIVE</span>
        </div>
      </div>

      {/* Modal: Create Channel */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#090A0F]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#11131A] border border-[#2E3445] rounded-xl p-5 shadow-2xl glow-overlay">
            <h3 className="text-sm font-semibold text-[#F3F4F6] mb-1">PROVISION NEW CHANNEL</h3>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Allocate an encrypted discussion stream on cluster {workspace.cluster}
            </p>

            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-[#c2c6d6] block mb-1">
                  CHANNEL NAME
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono text-[#6B7280]">#</span>
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="e.g. edge-cache-v2"
                    required
                    autoFocus
                    className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-7 pr-3 py-2 text-xs text-[#F3F4F6] placeholder-[#6B7280] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#c2c6d6] block mb-1">
                  PURPOSE / TOPIC
                </label>
                <input
                  type="text"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  placeholder="e.g. Cache invalidation race condition triage"
                  className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg px-3 py-2 text-xs text-[#F3F4F6] placeholder-[#6B7280]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="private-check"
                  checked={newChannelPrivate}
                  onChange={(e) => setNewChannelPrivate(e.target.checked)}
                  className="rounded border-[#232733] bg-[#181B24] text-[#3B82F6] focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="private-check" className="text-xs text-[#9CA3AF] select-none">
                  Confidential / Air-gapped (Private invitation only)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#232733]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#9CA3AF] hover:text-[#F3F4F6] rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium rounded-md transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                >
                  Provision Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
