import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, RotateCcw, Bot, User as UserIcon, Info, CornerDownLeft,
} from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardBody, Disclaimer, EmptyState } from '@/components/ui';
import { generateReply, QUICK_PROMPTS } from '@/lib/assistant';
import type { SectionId } from '@/types';

export function Assistant({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const { state, addMessage, clearChat } = useStore();
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [state.chat, thinking]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    addMessage({ role: 'user', content: q });
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const reply = generateReply(q, state);
      addMessage({ role: 'assistant', content: reply.content });
      setThinking(false);
      // stash followups in dataset on the message element via state-less approach: handle in render
      lastFollowups.current = reply.followups || [];
    }, 550);
  };

  const lastFollowups = useRef<string[]>([]);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="AI Decision Assistant"
        subtitle="Ask about budgets, skills, careers, comparing options, or family discussions. Education-focused, family-friendly guidance."
        icon={<Sparkles size={18} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat column */}
        <Card className="lg:col-span-3 flex flex-col !p-0 overflow-hidden h-[calc(100vh-220px)] min-h-[480px]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-navy text-white">
                <Bot size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-900">EduFamily Assistant</p>
                <p className="text-xs text-slate-500">Demo · structured education-planning logic</p>
              </div>
            </div>
            {state.chat.length > 0 && (
              <button onClick={clearChat} className="btn-ghost text-xs !px-2.5 !py-1.5">
                <RotateCcw size={13} /> Clear
              </button>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50">
            {state.chat.length === 0 && !thinking && (
              <div className="h-full flex items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-navy text-white mb-3">
                    <Sparkles size={22} />
                  </div>
                  <p className="font-display text-base font-semibold text-navy-900">How can I help your family decide?</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Try one of the suggested prompts below, or ask your own question about budget, skills, careers, or comparing options.
                  </p>
                </div>
              </div>
            )}

            {state.chat.map((m, i) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                followups={m.role === 'assistant' && i === state.chat.length - 1 ? lastFollowups.current : undefined}
                onFollowup={send}
                onNavigate={onNavigate}
              />
            ))}

            {thinking && (
              <div className="flex items-start gap-3">
                <Avatar role="assistant" />
                <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-navy-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-navy-400 animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="h-2 w-2 rounded-full bg-navy-400 animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                rows={1}
                placeholder="Ask about budget, skills, careers, comparing options…"
                className="input resize-none min-h-[44px] max-h-32 flex-1"
              />
              <button type="submit" disabled={!input.trim() || thinking} className="btn-primary !px-3.5 !py-3" aria-label="Send">
                <Send size={16} />
              </button>
            </form>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <CornerDownLeft size={11} /> Enter to send · Shift+Enter for a new line
            </p>
          </div>
        </Card>

        {/* Side column */}
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-3">
              <p className="text-xs font-semibold text-navy-700 flex items-center gap-1.5"><Info size={13} /> Suggested prompts</p>
              <div className="space-y-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="w-full text-left text-xs rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-navy-50 hover:border-navy-200 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          <Disclaimer>
            This is a transparent demo assistant. It uses structured education-planning logic, not a live language model. Recommendations are general guidance — verify fees, scholarships, and placements with official sources. It does not make decisions for your family.
          </Disclaimer>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  role, content, followups, onFollowup, onNavigate,
}: {
  role: 'user' | 'assistant';
  content: string;
  followups?: string[];
  onFollowup: (text: string) => void;
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <div className={`flex items-start gap-3 animate-fade-in ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <Avatar role={role} />
      <div className={`max-w-[85%] ${role === 'user' ? 'items-end' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
            role === 'user'
              ? 'bg-navy-600 text-white rounded-tr-sm'
              : 'bg-white border border-slate-200 text-navy-800 rounded-tl-sm'
          }`}
        >
          {content}
        </div>
        {followups && followups.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {followups.map((f) => {
              const nav = f.toLowerCase().startsWith('open ');
              return (
                <button
                  key={f}
                  onClick={() => {
                    if (nav) {
                      const target = f.toLowerCase();
                      if (target.includes('cost')) onNavigate('cost');
                      else if (target.includes('family')) onNavigate('family');
                      else if (target.includes('career')) onNavigate('career');
                      else if (target.includes('simulator')) onNavigate('simulator');
                      else if (target.includes('action')) onNavigate('plan');
                    } else {
                      onFollowup(f);
                    }
                  }}
                  className={`chip text-xs border ${nav ? 'bg-navy-50 text-navy-700 border-navy-200 hover:bg-navy-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'} transition-colors`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ role }: { role: 'user' | 'assistant' }) {
  if (role === 'user') {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
        <UserIcon size={16} />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-navy text-white">
      <Bot size={16} />
    </div>
  );
}

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-600 text-white shrink-0">{icon}</div>
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
}
