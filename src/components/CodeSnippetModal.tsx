import React, { useState } from 'react';
import { CodeSnippet } from '../types';
import { FileCode, X, Check } from 'lucide-react';

interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (snippet: CodeSnippet) => void;
}

const LANGUAGES = [
  { id: 'rust', label: 'Rust' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'go', label: 'Go' },
  { id: 'python', label: 'Python' },
  { id: 'bash', label: 'Bash / Shell' },
  { id: 'json', label: 'JSON' },
  { id: 'sql', label: 'SQL' },
  { id: 'yaml', label: 'YAML / K8s' },
];

export const CodeSnippetModal: React.FC<CodeSnippetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('rust');
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    onSubmit({
      title: title.trim() || `snippet.${language}`,
      language,
      code,
    });
    setTitle('');
    setCode('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#11131A] border border-[#2E3445] rounded-xl p-5 shadow-2xl glow-overlay">
        <div className="flex items-center justify-between pb-3 border-b border-[#232733] mb-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-semibold text-[#F3F4F6]">COMPOSE CODE / TELEMETRY SNIPPET</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9CA3AF] hover:text-white hover:bg-[#181B24]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#c2c6d6] block mb-1">
                FILE TITLE / PATH
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ebpf_filter.rs"
                className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg px-3 py-2 text-xs text-[#F3F4F6] placeholder-[#6B7280] font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#c2c6d6] block mb-1">
                SYNTAX LANGUAGE
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#181B24] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg px-3 py-2 text-xs text-[#F3F4F6]"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#c2c6d6] block mb-1">
              CODE SOURCE (FORMATTED)
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste low-level code, stack trace, or kernel log here..."
              rows={10}
              required
              className="w-full bg-[#0D0E14] border border-[#232733] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] rounded-lg p-3 text-xs text-[#E2E2EC] font-mono leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#232733]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#9CA3AF] hover:text-[#F3F4F6] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-medium rounded-md transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
            >
              Attach Snippet to Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
