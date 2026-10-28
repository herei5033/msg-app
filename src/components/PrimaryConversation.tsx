import React, { useState, useRef, useEffect } from 'react';
import { Channel, User, Message, Attachment, CodeSnippet } from '../types';
import { useAuth } from '../context/AuthContext';
import { MessageBubble } from './MessageBubble';
import { CodeSnippetModal } from './CodeSnippetModal';
import {
  Hash,
  Lock,
  Radio,
  Search,
  Pin,
  PanelRight,
  Send,
  Paperclip,
  FileCode,
  Smile,
  Mic,
  AlertTriangle,
  Flame,
  ShieldCheck,
  ChevronDown,
  X,
  Volume2,
  PhoneCall,
  Terminal,
} from 'lucide-react';

interface PrimaryConversationProps {
  channel: Channel;
  messages: Message[];
  allUsers: User[];
  onSendMessage: (params: {
    text: string;
    isPriority?: boolean;
    codeSnippet?: CodeSnippet;
    attachments?: Attachment[];
    audioMemo?: { duration: string; waveform: number[] };
  }) => void;
  onReact: (messageId: string, emoji: string) => void;
  onReplyThread: (message: Message) => void;
  onTogglePin: (messageId: string) => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  onOpenVoice: () => void;
  isVoiceConnected: boolean;
  onImagePreview: (url: string) => void;
}

export const PrimaryConversation: React.FC<PrimaryConversationProps> = ({
  channel,
  messages,
  allUsers,
  onSendMessage,
  onReact,
  onReplyThread,
  onTogglePin,
  isInspectorOpen,
  onToggleInspector,
  onOpenVoice,
  isVoiceConnected,
  onImagePreview,
}) => {
  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isPriority, setIsPriority] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Attachment[]>([]);
  const [pendingSnippet, setPendingSnippet] = useState<CodeSnippet | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [slashCommandsOpen, setSlashCommandsOpen] = useState(false);
  const [composerFocused, setComposerFocused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Voice memo recording simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 6) {
            // Finish recording automatically after 6 seconds
            finishVoiceRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  const finishVoiceRecording = () => {
    setIsRecordingVoice(false);
    // Send voice memo
    onSendMessage({
      text: 'Voice transmission from workstation terminal:',
      audioMemo: {
        duration: `0:0${recordingSeconds || 4}`,
        waveform: [25, 40, 75, 90, 65, 80, 50, 95, 85, 45, 60, 70, 30, 20],
      },
    });
    setRecordingSeconds(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    if (val.startsWith('/') && !val.includes(' ')) {
      setSlashCommandsOpen(true);
    } else {
      setSlashCommandsOpen(false);
    }
  };

  const executeSlashCommand = (cmd: string) => {
    if (cmd === '/incident') {
      setIsPriority(true);
      setInputText('🚨 INCIDENT P1 DECLARED: Immediate triage underway. Join War Room 01.');
    } else if (cmd === '/shrug') {
      setInputText(inputText.replace('/shrug', '') + ' ¯\\_(ツ)_/¯');
    } else if (cmd === '/clear') {
      setInputText('');
    } else if (cmd === '/deploy') {
      setInputText('🚀 Dispatched automated release payload to cluster edge: tag v3.8.4-rc2');
    }
    setSlashCommandsOpen(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() && !pendingSnippet && attachedFiles.length === 0) return;

    onSendMessage({
      text: inputText.trim() || (pendingSnippet ? 'Attached code snippet:' : 'Dispatched file attachment:'),
      isPriority,
      codeSnippet: pendingSnippet || undefined,
      attachments: attachedFiles.length > 0 ? attachedFiles : undefined,
    });

    setInputText('');
    setIsPriority(false);
    setPendingSnippet(null);
    setAttachedFiles([]);
    setSlashCommandsOpen(false);
  };

  // Mock File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const newAtt: Attachment = {
      id: `att-${Date.now()}`,
      name: file.name,
      size: `${Math.max(12, Math.round(file.size / 1024))} KB`,
      type: isImg ? 'image' : 'log',
      url: isImg
        ? URL.createObjectURL(file)
        : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    };

    setAttachedFiles((prev) => [...prev, newAtt]);
  };

  // Sample quick images
  const addSampleImage = () => {
    const sample: Attachment = {
      id: `att-${Date.now()}`,
      name: 'network_flamegraph_trace.png',
      size: '284 KB',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
    };
    setAttachedFiles((prev) => [...prev, sample]);
  };

  const getUser = (userId: string) => allUsers.find((u) => u.id === userId);

  const pinnedList = messages.filter((m) => m.isPinned);

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#090A0F] min-w-0 select-none overflow-hidden relative">
      {/* 1. Channel Header */}
      <header className="h-14 px-5 flex items-center justify-between border-b border-[#232733] bg-[#11131A] z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#181B24] border border-[#232733] flex items-center justify-center text-[#3B82F6] shrink-0">
            {channel.type === 'dm' ? (
              <Radio className="w-4 h-4 text-[#38BDF8]" />
            ) : channel.isPrivate ? (
              <Lock className="w-4 h-4 text-[#F59E0B]" />
            ) : (
              <Hash className="w-4 h-4 text-[#3B82F6]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#F3F4F6] tracking-tight truncate">
                {channel.name}
              </h2>
              <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                <ShieldCheck className="w-3 h-3" />
                E2EE
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] truncate mt-0.5 max-w-md hidden md:block">
              {channel.topic || channel.description}
            </p>
          </div>
        </div>

        {/* Right Header Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Tactical Voice War Room Trigger */}
          <button
            onClick={onOpenVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isVoiceConnected
                ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6] bg-[#181B24] hover:bg-[#1F232E] border border-[#232733]'
            }`}
            title="Tactical Voice Stream"
          >
            <Radio className={`w-3.5 h-3.5 ${isVoiceConnected ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">War Room</span>
          </button>

          {/* Member avatars preview */}
          <div className="hidden lg:flex items-center -space-x-2 mr-2 ml-1">
            {allUsers.slice(0, 4).map((u) => (
              <img
                key={u.id}
                src={u.avatar}
                alt={u.name}
                className="w-6 h-6 rounded-full border-2 border-[#11131A] object-cover"
                title={`${u.name} (@${u.handle})`}
              />
            ))}
          </div>

          {/* Toggle Inspector Button */}
          <button
            onClick={onToggleInspector}
            className={`p-2 rounded-lg transition-colors border ${
              isInspectorOpen
                ? 'bg-[#181B24] text-[#38BDF8] border-[#3B82F6]/40'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6] bg-[#181B24] hover:bg-[#1F232E] border-[#232733]'
            }`}
            title="Toggle Right Inspector Panel"
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Pinned Messages Quick Banner (if any) */}
      {pinnedList.length > 0 && (
        <div className="bg-[#181B24]/90 border-b border-[#232733] px-5 py-2 flex items-center justify-between text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-2 min-w-0">
            <Pin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            <span className="font-mono text-[10px] text-[#38BDF8] uppercase tracking-wider">
              PINNED DISPATCH:
            </span>
            <span className="truncate text-[#F3F4F6]">{pinnedList[0].text}</span>
          </div>
          <span className="text-[10px] font-mono text-[#6B7280] ml-3 shrink-0">
            {pinnedList.length} pinned
          </span>
        </div>
      )}

      {/* 2. Messages Stream List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {/* Day Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#232733]" />
          <span className="px-3 text-[11px] font-mono text-[#6B7280] uppercase tracking-wider">
            Today · 28 October 2026 · Node {channel.encryptionFingerprint.substring(0, 8)}
          </span>
          <div className="flex-1 border-t border-[#232733]" />
        </div>

        {messages.map((message, index) => {
          const isConsecutive =
            index > 0 && messages[index - 1].senderId === message.senderId;
          const sender = getUser(message.senderId);
          const isCurrentUser = message.senderId === currentUser.id;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              sender={sender}
              isCurrentUser={isCurrentUser}
              isConsecutive={isConsecutive}
              onReact={onReact}
              onReplyThread={onReplyThread}
              onTogglePin={onTogglePin}
              onImagePreview={onImagePreview}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Message Input Composer Container */}
      <div className="p-4 pt-2 bg-[#090A0F] border-t border-[#232733] shrink-0 relative">
        {/* Slash Command Hints Popover */}
        {slashCommandsOpen && (
          <div className="absolute left-6 bottom-full mb-2 w-80 bg-[#1F232E] border border-[#2E3445] rounded-xl shadow-2xl p-2 z-30 glow-overlay">
            <div className="text-[10px] font-mono text-[#9CA3AF] px-2 py-1 uppercase border-b border-[#2E3445] mb-1">
              TACTICAL COMMANDS
            </div>
            <div className="space-y-0.5 text-xs">
              <button
                type="button"
                onClick={() => executeSlashCommand('/incident')}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#181B24] text-left text-[#EF4444]"
              >
                <span className="font-mono font-semibold">/incident</span>
                <span className="text-[10px] text-[#9CA3AF]">Declare P1 & Alert War Room</span>
              </button>
              <button
                type="button"
                onClick={() => executeSlashCommand('/deploy')}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#181B24] text-left text-[#38BDF8]"
              >
                <span className="font-mono font-semibold">/deploy</span>
                <span className="text-[10px] text-[#9CA3AF]">Trigger automated release</span>
              </button>
              <button
                type="button"
                onClick={() => executeSlashCommand('/shrug')}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#181B24] text-left text-[#F3F4F6]"
              >
                <span className="font-mono font-semibold">/shrug</span>
                <span className="text-[10px] text-[#9CA3AF]">Append ¯\_(ツ)_/¯</span>
              </button>
              <button
                type="button"
                onClick={() => executeSlashCommand('/clear')}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#181B24] text-left text-[#9CA3AF]"
              >
                <span className="font-mono font-semibold">/clear</span>
                <span className="text-[10px] text-[#9CA3AF]">Clear composer text</span>
              </button>
            </div>
          </div>
        )}

        {/* Pending Snippet / File Attachments Bar */}
        {(pendingSnippet || attachedFiles.length > 0) && (
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {pendingSnippet && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#181B24] border border-[#38BDF8]/40 text-xs font-mono text-[#38BDF8]">
                <FileCode className="w-3.5 h-3.5" />
                <span>{pendingSnippet.title}</span>
                <button
                  onClick={() => setPendingSnippet(null)}
                  className="hover:text-white ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {attachedFiles.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#181B24] border border-[#232733] text-xs text-[#F3F4F6]"
              >
                <Paperclip className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="max-w-[140px] truncate">{att.name}</span>
                <button
                  onClick={() =>
                    setAttachedFiles((prev) => prev.filter((a) => a.id !== att.id))
                  }
                  className="text-[#9CA3AF] hover:text-white ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active Voice Recording Bar */}
        {isRecordingVoice ? (
          <div className="bg-[#181B24] border border-[#EF4444] rounded-lg p-3 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#EF4444] animate-ping" />
              <span className="text-xs font-mono text-[#EF4444] font-bold">
                RECORDING AUDIO DISPATCH: 0:0{recordingSeconds}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecordingVoice(false)}
                className="px-2.5 py-1 rounded text-xs text-[#9CA3AF] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={finishVoiceRecording}
                className="px-3 py-1 rounded bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium"
              >
                Send Voice Memo
              </button>
            </div>
          </div>
        ) : (
          /* Main Composer Box */
          <div
            className={`bg-[#181B24] border rounded-lg transition-all ${
              composerFocused
                ? 'border-[#3B82F6] glow-electric'
                : 'border-[#232733]'
            } ${isPriority ? 'border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.2)]' : ''}`}
          >
            {/* Priority Banner if enabled */}
            {isPriority && (
              <div className="px-3 py-1 bg-[#EF4444]/15 border-b border-[#EF4444]/30 flex items-center justify-between text-[11px] text-[#EF4444] font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  EMERGENCY P1 DISPATCH ACTIVATED
                </span>
                <button
                  onClick={() => setIsPriority(false)}
                  className="hover:underline text-[10px]"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Multiline Input Textarea */}
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setComposerFocused(true)}
              onBlur={() => setComposerFocused(false)}
              rows={2}
              placeholder={`Dispatch message to #${channel.name}... (Press Enter to send, Shift+Enter for newline, '/' for commands)`}
              className="w-full bg-transparent border-none text-[13.5px] leading-relaxed text-[#F3F4F6] placeholder-[#6B7280] focus:outline-none p-3 resize-none select-text"
            />

            {/* Bottom Integrated Action Toolbar */}
            <div className="px-3 py-2 border-t border-[#232733]/60 flex items-center justify-between">
              {/* Left Toolbar Icons */}
              <div className="flex items-center gap-1 text-[#9CA3AF]">
                {/* File Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded hover:text-white hover:bg-[#1F232E] transition-colors"
                  title="Attach File or Log"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Sample Hotlinked Media Button */}
                <button
                  type="button"
                  onClick={addSampleImage}
                  className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono hover:text-[#38BDF8] hover:bg-[#1F232E] transition-colors"
                  title="Add Flamegraph / Metric Screenshot"
                >
                  + Telemetry Pic
                </button>

                {/* Code Snippet Modal Trigger */}
                <button
                  type="button"
                  onClick={() => setShowCodeModal(true)}
                  className="p-1.5 rounded hover:text-white hover:bg-[#1F232E] transition-colors"
                  title="Compose Code Block"
                >
                  <FileCode className="w-4 h-4 text-[#38BDF8]" />
                </button>

                {/* Voice Memo Trigger */}
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(true)}
                  className="p-1.5 rounded hover:text-white hover:bg-[#1F232E] transition-colors"
                  title="Record Voice Memo"
                >
                  <Mic className="w-4 h-4" />
                </button>

                {/* Emoji popover */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 rounded hover:text-white hover:bg-[#1F232E] transition-colors"
                    title="Insert Reaction Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute left-0 bottom-full mb-2 bg-[#1F232E] border border-[#2E3445] rounded-lg p-2 shadow-xl flex items-center gap-1 z-30">
                      {['⚡', '🚀', '🔥', '👀', '👍', '❤️', '⚠️', '🎯'].map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => {
                            setInputText((prev) => prev + ' ' + e);
                            setShowEmojiPicker(false);
                            textareaRef.current?.focus();
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#181B24] text-sm"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* P1 Incident Dispatch Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPriority(!isPriority)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ml-1 ${
                    isPriority
                      ? 'bg-[#EF4444] text-white'
                      : 'text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10'
                  }`}
                  title="Toggle P1 Emergency Dispatch"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">P1 Dispatch</span>
                </button>
              </div>

              {/* Right: Send Button */}
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-[10px] font-mono text-[#6B7280]">
                  Enter ↵
                </span>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!inputText.trim() && !pendingSnippet && attachedFiles.length === 0}
                  className="px-3.5 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-30 disabled:bg-[#232733] text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                >
                  <span>Dispatch</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Snippet Modal */}
      <CodeSnippetModal
        isOpen={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        onSubmit={(snippet) => setPendingSnippet(snippet)}
      />
    </div>
  );
};
