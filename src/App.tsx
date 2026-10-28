import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { TerminalLockScreen } from './components/TerminalLockScreen';
import { UtilityRail } from './components/UtilityRail';
import { ConversationIndex } from './components/ConversationIndex';
import { PrimaryConversation } from './components/PrimaryConversation';
import { FlyoutInspector } from './components/FlyoutInspector';
import { ThreadView } from './components/ThreadView';
import { VoiceRoomHUD } from './components/VoiceRoomHUD';
import { CommandPalette } from './components/CommandPalette';
import { SettingsModal } from './components/SettingsModal';
import { ImageLightbox } from './components/ImageLightbox';
import {
  INITIAL_WORKSPACES,
  INITIAL_CHANNELS,
  INITIAL_MESSAGES,
} from './data/mockData';
import { Channel, Message, Workspace, CodeSnippet, Attachment } from './types';

const STORAGE_KEY_MESSAGES = 'obsidian_signal_messages';
const STORAGE_KEY_CHANNELS = 'obsidian_signal_channels';

const MainShell: React.FC = () => {
  const { currentUser, allUsers, isAuthenticated, isLocked, lockTerminal } = useAuth();

  // Workspaces
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(INITIAL_WORKSPACES[0]);

  // Channels
  const [channels, setChannels] = useState<Channel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CHANNELS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CHANNELS;
      }
    }
    return INITIAL_CHANNELS;
  });

  const [activeChannelId, setActiveChannelId] = useState<string>('chn-ops-telemetry');

  // Messages Map: channelId -> Message[]
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  // Thread replies: messageId -> Message[]
  const [threadRepliesMap, setThreadRepliesMap] = useState<Record<string, Message[]>>({
    'msg-inc-1': [
      {
        id: 'reply-1',
        channelId: 'chn-incident-response',
        senderId: 'usr-sara',
        text: 'Confirming: Frankfurt telemetry agent caught the 320ms latency jump at 11:14:02 UTC.',
        timestamp: '11:16 AM',
        reactions: [{ emoji: '👀', count: 2, users: ['usr-alex', 'usr-devin'] }],
      },
      {
        id: 'reply-2',
        channelId: 'chn-incident-response',
        senderId: 'usr-alex',
        text: 'Applying static BGP cost 200 on transit port 4 to suppress flapping.',
        timestamp: '11:18 AM',
        reactions: [{ emoji: '🚀', count: 3, users: ['usr-devin', 'usr-elena'] }],
      },
    ],
  });

  // UI Panels State
  const [isRailExpanded, setIsRailExpanded] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [activeThreadRootMessage, setActiveThreadRootMessage] = useState<Message | null>(null);
  const [isVoiceConnected, setIsVoiceConnected] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messagesMap));
  }, [messagesMap]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        lockTerminal();
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsSettingsOpen(false);
        setPreviewImageUrl(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lockTerminal]);

  // Active channel resolution
  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const activeMessages = messagesMap[activeChannelId] || [];

  // When switching channels, reset unread count
  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Send new dispatch
  const handleSendMessage = (params: {
    text: string;
    isPriority?: boolean;
    codeSnippet?: CodeSnippet;
    attachments?: Attachment[];
    audioMemo?: { duration: string; waveform: number[] };
  }) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderId: currentUser.id,
      text: params.text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPriority: params.isPriority,
      codeSnippet: params.codeSnippet,
      attachments: params.attachments,
      audioMemo: params.audioMemo,
      reactions: [],
      replyCount: 0,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));
  };

  // Send reply in thread
  const handleSendReply = (rootMessageId: string, text: string) => {
    const newReply: Message = {
      id: `rep-${Date.now()}`,
      channelId: activeChannelId,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };

    setThreadRepliesMap((prev) => ({
      ...prev,
      [rootMessageId]: [...(prev[rootMessageId] || []), newReply],
    }));

    // Update root message reply count
    setMessagesMap((prev) => ({
      ...prev,
      [activeChannelId]: (prev[activeChannelId] || []).map((m) =>
        m.id === rootMessageId ? { ...m, replyCount: (m.replyCount || 0) + 1 } : m
      ),
    }));

    if (activeThreadRootMessage?.id === rootMessageId) {
      setActiveThreadRootMessage((prev) =>
        prev ? { ...prev, replyCount: (prev.replyCount || 0) + 1 } : null
      );
    }
  };

  // React to a message
  const handleReact = (messageId: string, emoji: string) => {
    setMessagesMap((prev) => {
      const currentChannelMsgs = prev[activeChannelId] || [];
      const updated = currentChannelMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingReactionIndex = msg.reactions.findIndex((r) => r.emoji === emoji);
        let newReactions = [...msg.reactions];

        if (existingReactionIndex >= 0) {
          const current = newReactions[existingReactionIndex];
          const hasUser = current.users.includes(currentUser.id);
          if (hasUser) {
            // Remove user reaction
            if (current.count <= 1) {
              newReactions = newReactions.filter((r) => r.emoji !== emoji);
            } else {
              newReactions[existingReactionIndex] = {
                ...current,
                count: current.count - 1,
                users: current.users.filter((u) => u !== currentUser.id),
              };
            }
          } else {
            // Add user reaction
            newReactions[existingReactionIndex] = {
              ...current,
              count: current.count + 1,
              users: [...current.users, currentUser.id],
            };
          }
        } else {
          // New reaction
          newReactions.push({
            emoji,
            count: 1,
            users: [currentUser.id],
          });
        }

        return { ...msg, reactions: newReactions };
      });

      return { ...prev, [activeChannelId]: updated };
    });
  };

  // Toggle pin
  const handleTogglePin = (messageId: string) => {
    setMessagesMap((prev) => {
      const currentChannelMsgs = prev[activeChannelId] || [];
      const updated = currentChannelMsgs.map((msg) =>
        msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
      );
      return { ...prev, [activeChannelId]: updated };
    });
  };

  // Create Channel
  const handleAddChannel = (channelData: {
    name: string;
    description: string;
    isPrivate: boolean;
  }) => {
    const newChan: Channel = {
      id: `chn-${channelData.name.toLowerCase()}`,
      name: channelData.name,
      type: 'channel',
      description: channelData.description,
      topic: channelData.description,
      unreadCount: 0,
      isPrivate: channelData.isPrivate,
      memberCount: 6,
      encryptionFingerprint: `SHA256:${Math.random().toString(36).substring(2, 6)}..${Math.random()
        .toString(36)
        .substring(2, 6)}`,
    };

    setChannels((prev) => [...prev, newChan]);
    setActiveChannelId(newChan.id);
    setMessagesMap((prev) => ({
      ...prev,
      [newChan.id]: [
        {
          id: `msg-welcome-${Date.now()}`,
          channelId: newChan.id,
          senderId: currentUser.id,
          text: `Tactical channel #${newChan.name} provisioned on ${activeWorkspace.cluster}. Encrypted session established.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: [{ emoji: '⚡', count: 1, users: [currentUser.id] }],
        },
      ],
    }));
  };

  // Switch direct message
  const handleOpenDm = (userId: string) => {
    const existingDm = channels.find((c) => c.type === 'dm' && c.dmUserId === userId);
    if (existingDm) {
      handleSelectChannel(existingDm.id);
    } else {
      const targetUser = allUsers.find((u) => u.id === userId);
      const newDm: Channel = {
        id: `dm-${targetUser?.handle || userId}`,
        name: targetUser?.name || 'Operator',
        type: 'dm',
        description: 'Direct Encrypted Channel',
        topic: 'E2EE Signal session established',
        unreadCount: 0,
        dmUserId: userId,
        encryptionFingerprint: `SHA256:${Math.random().toString(36).substring(2, 6)}..${Math.random()
          .toString(36)
          .substring(2, 6)}`,
      };
      setChannels((prev) => [...prev, newDm]);
      setActiveChannelId(newDm.id);
    }
  };

  // If not authenticated, show AuthScreen
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // If locked, show TerminalLockScreen
  if (isLocked) {
    return <TerminalLockScreen />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090A0F] text-[#E2E2EC]">
      {/* 1. Left Utility & Channel Rail */}
      <UtilityRail
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={setActiveWorkspace}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        activeVoiceConnected={isVoiceConnected}
        onToggleVoice={() => setIsVoiceConnected(!isVoiceConnected)}
        isRailExpanded={isRailExpanded}
        onToggleRailExpand={() => setIsRailExpanded(!isRailExpanded)}
      />

      {/* 2. Conversation Index Pane (Width: 320px) */}
      <ConversationIndex
        workspace={activeWorkspace}
        channels={channels}
        users={allUsers}
        activeChannelId={activeChannelId}
        onSelectChannel={handleSelectChannel}
        onAddChannel={handleAddChannel}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Conversation Center Stream + Optional Overlays */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Tactical Voice War Room HUD (when connected) */}
        {isVoiceConnected && (
          <VoiceRoomHUD onDisconnect={() => setIsVoiceConnected(false)} />
        )}

        {/* 3. Primary Conversation View (Flex 1) */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          <PrimaryConversation
            channel={activeChannel}
            messages={activeMessages}
            allUsers={allUsers}
            onSendMessage={handleSendMessage}
            onReact={handleReact}
            onReplyThread={(msg) => setActiveThreadRootMessage(msg)}
            onTogglePin={handleTogglePin}
            isInspectorOpen={isInspectorOpen}
            onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
            onOpenVoice={() => setIsVoiceConnected(true)}
            isVoiceConnected={isVoiceConnected}
            onImagePreview={(url) => setPreviewImageUrl(url)}
          />

          {/* Thread Drawer (if a thread is inspected) */}
          {activeThreadRootMessage && (
            <ThreadView
              rootMessage={activeThreadRootMessage}
              replies={threadRepliesMap[activeThreadRootMessage.id] || []}
              allUsers={allUsers}
              onClose={() => setActiveThreadRootMessage(null)}
              onSendReply={handleSendReply}
              onReact={handleReact}
              onTogglePin={handleTogglePin}
            />
          )}

          {/* Right Flyout Inspector (Width: 340px) */}
          {isInspectorOpen && (
            <FlyoutInspector
              channel={activeChannel}
              users={allUsers}
              pinnedMessages={activeMessages.filter((m) => m.isPinned)}
              allChannelMessages={activeMessages}
              onClose={() => setIsInspectorOpen(false)}
              onOpenDm={handleOpenDm}
            />
          )}
        </div>
      </div>

      {/* Global Modals & Palettes */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        channels={channels}
        workspaces={workspaces}
        onSelectChannel={handleSelectChannel}
        onSelectWorkspace={setActiveWorkspace}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleVoice={() => setIsVoiceConnected(!isVoiceConnected)}
        onToggleInspector={() => setIsInspectorOpen(!isInspectorOpen)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ImageLightbox
        url={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainShell />
    </AuthProvider>
  );
}
