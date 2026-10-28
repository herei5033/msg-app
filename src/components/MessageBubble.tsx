import React, { useState } from 'react';
import { Message, User } from '../types';
import {
  Smile,
  MessageSquare,
  Pin,
  Copy,
  Check,
  Play,
  Pause,
  FileCode,
  FileText,
  ExternalLink,
  Flame,
  AlertTriangle,
  Volume2,
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  sender?: User;
  isCurrentUser: boolean;
  isConsecutive: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onReplyThread: (message: Message) => void;
  onTogglePin: (messageId: string) => void;
  onImagePreview?: (url: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  isCurrentUser,
  isConsecutive,
  onReact,
  onReplyThread,
  onTogglePin,
  onImagePreview,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const quickEmojis = ['⚡', '👍', '🚀', '🔥', '👀', '🎯', '❤️'];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 1500);
  };

  // Render text with @mention highlights
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9._]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span
            key={index}
            className="inline-block bg-[rgba(56,189,248,0.12)] border border-[rgba(56,189,248,0.25)] text-[#38BDF8] text-[12px] font-medium font-label rounded px-1.5 py-0.5 mx-0.5"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div
      className={`group relative flex gap-3 px-4 py-1 transition-colors hover:bg-[#181B24]/40 ${
        isConsecutive ? 'mt-0.5' : 'mt-3.5'
      } ${message.isPinned ? 'bg-[#3B82F6]/5' : ''}`}
    >
      {/* Floating Actions Dock (On Hover) */}
      <div className="absolute right-4 -top-3 hidden group-hover:flex items-center gap-1 bg-[#1F232E] border border-[#2E3445] rounded-md px-1 py-0.5 shadow-lg z-20 glow-overlay">
        {/* Quick Reaction button */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1 rounded text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24] transition-colors"
            title="Add Reaction"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute right-0 bottom-full mb-1 flex items-center gap-1 bg-[#1F232E] border border-[#2E3445] rounded-lg p-1.5 shadow-xl z-30">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onReact(message.id, emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#181B24] text-sm transition-transform hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reply in thread */}
        <button
          onClick={() => onReplyThread(message)}
          className="p-1 rounded text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24] transition-colors"
          title="Reply in Thread"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>

        {/* Pin Message */}
        <button
          onClick={() => onTogglePin(message.id)}
          className={`p-1 rounded transition-colors ${
            message.isPinned
              ? 'text-[#38BDF8] bg-[#181B24]'
              : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24]'
          }`}
          title={message.isPinned ? 'Unpin from Channel' : 'Pin to Channel'}
        >
          <Pin className="w-3.5 h-3.5" />
        </button>

        {/* Copy text */}
        <button
          onClick={handleCopyMessage}
          className="p-1 rounded text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24] transition-colors"
          title="Copy Message Text"
        >
          {copiedText ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Avatar (Hidden for consecutive messages) */}
      <div className="w-9 shrink-0 flex items-start justify-center pt-0.5">
        {!isConsecutive ? (
          <img
            src={sender?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={sender?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover border border-[#2E3445]"
          />
        ) : (
          <span className="text-[10px] font-mono text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity">
            {message.timestamp}
          </span>
        )}
      </div>

      {/* Message Content Container */}
      <div className="flex-1 min-w-0">
        {/* Header row with Author name, role, timestamp (only non-consecutive) */}
        {!isConsecutive && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-[#F3F4F6] hover:underline cursor-pointer">
              {sender?.name || 'Operator'}
            </span>
            <span className="text-[10px] font-mono text-[#38BDF8]">
              @{sender?.handle || 'user'}
            </span>
            {sender?.role && (
              <span className="text-[10px] font-label text-[#6B7280] uppercase tracking-wider hidden sm:inline-block">
                · {sender.role}
              </span>
            )}
            <span className="text-[10px] font-mono text-[#6B7280] ml-auto">
              {message.timestamp}
            </span>
            {message.isPinned && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded border border-[#38BDF8]/20">
                <Pin className="w-2.5 h-2.5" />
                PINNED
              </span>
            )}
          </div>
        )}

        {/* Message Bubble Box */}
        <div
          className={`relative max-w-3xl p-3 text-[13.5px] leading-relaxed transition-all ${
            isCurrentUser
              ? message.isPriority
                ? 'bg-[#1D4ED8] text-white border border-[#3B82F6]/60 shadow-[0_0_15px_rgba(29,78,216,0.3)]'
                : 'bg-[#1E293B] text-white border border-[#3B82F6]/30'
              : 'bg-[#181B24] text-[#F3F4F6] border border-[#232733]'
          } ${
            isCurrentUser
              ? isConsecutive
                ? 'rounded-lg rounded-tr-[2px]'
                : 'rounded-lg'
              : isConsecutive
              ? 'rounded-lg rounded-tl-[2px]'
              : 'rounded-lg'
          }`}
        >
          {/* Priority indicator if emergency dispatch */}
          {message.isPriority && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider font-bold text-[#FFDADA] mb-1.5 pb-1 border-b border-white/20 uppercase">
              <AlertTriangle className="w-3 h-3 text-[#EF4444]" />
              <span>HIGH PRIORITY DISPATCH // IMMEDIATE ATTENTION</span>
            </div>
          )}

          {/* Main message text */}
          <div className="break-words select-text">
            {renderFormattedText(message.text)}
          </div>

          {/* Code Snippet Embed if present */}
          {message.codeSnippet && (
            <div className="mt-2.5 rounded-md overflow-hidden border border-[#232733] bg-[#0D0E14] font-mono-code text-[12.5px]">
              {/* Code header bar */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#11131A] border-b border-[#232733] text-[11px] text-[#9CA3AF]">
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span className="font-semibold text-[#F3F4F6]">
                    {message.codeSnippet.title || 'snippet'}
                  </span>
                  <span className="text-[10px] uppercase text-[#6B7280] font-mono">
                    {message.codeSnippet.language}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(message.codeSnippet!.code)}
                  className="flex items-center gap-1 text-[11px] hover:text-white transition-colors p-1"
                  title="Copy Code"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-[#10B981]" />
                      <span className="text-[#10B981]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code lines */}
              <div className="p-3 overflow-x-auto text-[#E2E2EC] leading-5">
                <pre className="font-mono">
                  <code>{message.codeSnippet.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Attachments if present */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2.5 space-y-2">
              {message.attachments.map((att) => (
                <div key={att.id}>
                  {att.type === 'image' ? (
                    <div
                      onClick={() => onImagePreview?.(att.url)}
                      className="group/img relative rounded-lg overflow-hidden border border-[#232733] max-w-md cursor-pointer hover:border-[#3B82F6]/50 transition-colors"
                    >
                      <img
                        src={att.url}
                        alt={att.name}
                        className="w-full h-48 object-cover group-hover/img:scale-[1.02] transition-transform duration-200"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-xs text-white flex items-center justify-between">
                        <span className="truncate">{att.name}</span>
                        <span className="text-[10px] font-mono text-[#9CA3AF] shrink-0 ml-2">
                          {att.size}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#11131A] border border-[#232733] max-w-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-[#38BDF8] shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[#F3F4F6] truncate">
                            {att.name}
                          </div>
                          <div className="text-[10px] font-mono text-[#6B7280]">{att.size}</div>
                        </div>
                      </div>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-[#9CA3AF] hover:text-[#38BDF8]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Audio memo player if present */}
          {message.audioMemo && (
            <div className="mt-2 p-2.5 rounded-lg bg-[#11131A] border border-[#232733] flex items-center gap-3 max-w-xs">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-8 h-8 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-md transition-colors"
              >
                {isPlayingAudio ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                {/* Waveform bars */}
                <div className="flex items-center gap-0.5 h-6">
                  {message.audioMemo.waveform.map((val, idx) => {
                    const isPlayed = (idx / message.audioMemo!.waveform.length) * 100 <= audioProgress;
                    return (
                      <span
                        key={idx}
                        style={{ height: `${Math.max(15, val)}%` }}
                        className={`w-1 rounded-full transition-colors ${
                          isPlayed ? 'bg-[#38BDF8]' : 'bg-[#2E3445]'
                        } ${isPlayingAudio ? 'animate-pulse' : ''}`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
                  <span>VOICE MEMO</span>
                  <span>{message.audioMemo.duration}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reactions row */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {message.reactions.map((react, i) => {
              const hasReacted = react.users.includes(sender?.id || '');
              return (
                <button
                  key={i}
                  onClick={() => onReact(message.id, react.emoji)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono transition-all ${
                    hasReacted
                      ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#38BDF8]'
                      : 'bg-[#181B24] border border-[#232733] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#2E3445]'
                  }`}
                >
                  <span>{react.emoji}</span>
                  <span className="text-[11px] font-semibold">{react.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Thread replies footer button */}
        {message.replyCount !== undefined && message.replyCount > 0 && (
          <button
            onClick={() => onReplyThread(message)}
            className="flex items-center gap-2 text-xs font-medium text-[#38BDF8] hover:underline mt-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>
              {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'} in thread
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
