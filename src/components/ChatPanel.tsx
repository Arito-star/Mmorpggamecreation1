import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  player: string;
  message: string;
  timestamp: number;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (player: string, message: string) => void;
}

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage('Герой', inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-purple-400" />
        <h2 className="text-white">Чат</h2>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-3 h-48 overflow-y-auto mb-3">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-purple-400">{formatTime(msg.timestamp)}</span>
              <span className={`${
                msg.player === 'Система' ? 'text-yellow-400' : 'text-cyan-400'
              }`}>
                {msg.player}:
              </span>
            </div>
            <p className="text-purple-200 ml-16">{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-purple-500/30 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
