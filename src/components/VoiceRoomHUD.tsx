import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Radio,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Activity,
  Users,
  ShieldCheck,
  Share2,
} from 'lucide-react';

interface VoiceRoomHUDProps {
  onDisconnect: () => void;
}

export const VoiceRoomHUD: React.FC<VoiceRoomHUDProps> = ({ onDisconnect }) => {
  const { currentUser, allUsers } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(0);

  // Active room participants
  const roomMembers = [currentUser, allUsers[1], allUsers[2]].filter(Boolean);

  // Simulate subtle alternating speaker activity
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeakingIndex((prev) => (prev + 1) % roomMembers.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [roomMembers.length]);

  return (
    <div className="bg-[#11131A] border-b border-[#232733] px-4 py-2 flex items-center justify-between text-xs z-20">
      {/* Left: Room Status & Waveform */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#181B24] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.3)]">
          <Radio className="w-4 h-4 animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F3F4F6] text-xs">WAR ROOM 01</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              VOICE MESH LIVE
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#6B7280] mt-0.5">
            <span className="flex items-center gap-1 text-[#10B981]">
              <Activity className="w-3 h-3" />
              14ms (0% LOSS)
            </span>
            <span>·</span>
            <span>OPUS 48kHz</span>
          </div>
        </div>
      </div>

      {/* Middle: Active Participants Avatars with Speaking Glow */}
      <div className="hidden md:flex items-center gap-2">
        {roomMembers.map((member, idx) => {
          const isSpeaking = speakingIndex === idx && !isMuted;
          return (
            <div
              key={member.id}
              className={`relative flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                isSpeaking ? 'bg-[#181B24] border border-[#10B981]/50' : 'bg-[#11131A]'
              }`}
              title={`${member.name} ${isSpeaking ? '(Speaking)' : ''}`}
            >
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className={`w-6 h-6 rounded-full object-cover transition-all ${
                    isSpeaking ? 'ring-2 ring-[#10B981]' : 'border border-[#2E3445]'
                  }`}
                />
                {isSpeaking && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                )}
              </div>
              <span className="text-[11px] text-[#9CA3AF] max-w-[80px] truncate">
                {member.handle}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right: Quick In-Room Audio Controls & Leave Button */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-1.5 rounded-md transition-colors ${
            isMuted
              ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
              : 'text-[#9CA3AF] hover:text-white bg-[#181B24] border border-[#232733]'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setIsDeafened(!isDeafened)}
          className={`p-1.5 rounded-md transition-colors ${
            isDeafened
              ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
              : 'text-[#9CA3AF] hover:text-white bg-[#181B24] border border-[#232733]'
          }`}
          title={isDeafened ? 'Undeafen' : 'Deafen'}
        >
          {isDeafened ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onDisconnect}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/40 text-xs font-medium transition-colors ml-1"
          title="Disconnect from War Room"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    </div>
  );
};
