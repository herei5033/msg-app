export type UserStatus = 'active' | 'busy' | 'idle' | 'urgent';

export interface User {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatar: string;
  status: UserStatus;
  keyFingerprint: string;
  pingMs: number;
  bio?: string;
  department?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'code' | 'log' | 'doc';
  url: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
  title?: string;
}

export interface AudioMemo {
  duration: string;
  waveform: number[];
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user handles or ids
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isPriority?: boolean;
  codeSnippet?: CodeSnippet;
  attachments?: Attachment[];
  audioMemo?: AudioMemo;
  reactions: Reaction[];
  replyCount?: number;
  isPinned?: boolean;
  edited?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'channel' | 'dm';
  description: string;
  topic?: string;
  unreadCount: number;
  isMuted?: boolean;
  isPrivate?: boolean;
  memberCount?: number;
  encryptionFingerprint: string;
  dmUserId?: string; // If type === 'dm'
}

export interface Workspace {
  id: string;
  name: string;
  shortCode: string;
  region: string;
  cluster: string;
  activeCount: number;
}
