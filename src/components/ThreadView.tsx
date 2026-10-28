import React, { useState } from 'react';
import { Message, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { MessageBubble } from './MessageBubble';
import { X, Send, MessageSquare, CornerDownRight } from 'lucide-react';

interface ThreadViewProps {
  rootMessage: Message;
  replies: Message[];
  allUsers: User[];
  onClose: () => void;
  onSendReply: (rootMessageId: string, text: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onTogglePin: (messageId: string) => void;
}

export const ThreadView: React.FC<ThreadViewProps> = ({
  rootMessage,
  replies,
  allUsers,
  onClose,
  onSendReply,
  onReact,
  onTogglePin,
}) => {
  const { currentUser } = useAuth();
  const [replyText, setReplyText] = useState('');

  const getUser = (userId: string) => allUsers.find((u) => u.id === userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(rootMessage.id, replyText);
    setReplyText('');
  };

  return (
    <div className="w-88 sm:w-96 h-screen flex flex-col bg-[#11131A] border-l border-[#232733] select-none z-20 shrink-0">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#232733]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
          <div>
            <h3 className="text-xs font-semibold text-[#F3F4F6]">THREAD INSPECTION</h3>
            <span className="text-[10px] font-mono text-[#6B7280]">
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#181B24] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Thread Stream */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {/* Root Message Box */}
        <div className="border-b border-[#232733] pb-3 bg-[#181B24]/30">
          <div className="px-4 text-[10px] font-mono text-[#6B7280] uppercase mb-1">
            ORIGIN DISPATCH
          </div>
          <MessageBubble
            message={rootMessage}
            sender={getUser(rootMessage.senderId)}
            isCurrentUser={rootMessage.senderId === currentUser.id}
            isConsecutive={false}
            onReact={onReact}
            onReplyThread={() => {}}
            onTogglePin={onTogglePin}
          />
        </div>

        {/* Replies List */}
        <div className="px-2 space-y-2">
          {replies.map((reply, index) => (
            <MessageBubble
              key={reply.id}
              message={reply}
              sender={getUser(reply.senderId)}
              isCurrentUser={reply.senderId === currentUser.id}
              isConsecutive={index > 0 && replies[index - 1].senderId === reply.senderId}
              onReact={onReact}
              onReplyThread={() => {}}
              onTogglePin={onTogglePin}
            />
          ))}

          {replies.length === 0 && (
            <div className="p-6 text-center text-xs text-[#6B7280]">
              <CornerDownRight className="w-5 h-5 mx-auto mb-2 text-[#2E3445]" />
              No replies yet. Respond directly to coordinate.
            </div>
          )}
        </div>
      </div>

      {/* Reply Composer */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#232733] bg-[#0C0E15]">
        <div className="relative">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply in tactical thread..."
            className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg pl-3 pr-10 py-2 text-xs text-[#F3F4F6] placeholder-[#6B7280]"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded bg-[#3B82F6] disabled:opacity-30 disabled:bg-[#232733] hover:bg-[#2563EB] text-white flex items-center justify-center transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
