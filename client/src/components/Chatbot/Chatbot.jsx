import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { askChatbot } from '../../services/api';
import './chatbot.css';

const quickReplies = [
  'What services do you offer?',
  'How does the project process work?',
  'What technologies do you use?',
  'How can I start a project?',
];

const initialMessage = {
  id: 0,
  role: 'assistant',
  content: 'Hi! I can answer questions about TechSlot’s services, process, and getting started.',
};

export default function Chatbot() {
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, loading, error]);

  const sendMessage = async (value) => {
    const message = value.trim();
    if (!message || loading) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: 'user', content: message },
    ]);
    setDraft('');
    setError('');
    setLoading(true);

    try {
      const { data } = await askChatbot(message);
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.data.answer,
          contactCta: data.data.contactCta,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
          || 'The chatbot is temporarily unavailable. Please use the contact form instead.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="chatbot-panel"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            aria-label="TechSlot FAQ chat"
          >
            <header className="chatbot-header">
              <div className="chatbot-header-icon"><Bot size={20} /></div>
              <div className="chatbot-heading">
                <strong>TechSlot Assistant</strong>
                <span>Answers based on this website</span>
              </div>
              <button
                className="chatbot-close"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </header>

            <div className="chatbot-messages" aria-live="polite">
              {messages.map((message) => (
                <div className={`chatbot-message-row ${message.role}`} key={message.id}>
                  {message.role === 'assistant' && (
                    <span className="chatbot-message-icon" aria-hidden="true"><Bot size={15} /></span>
                  )}
                  <div className={`chatbot-message ${message.role}`}>
                    <p>{message.content}</p>
                    {message.contactCta && (
                      <Link
                        className="chatbot-contact-link"
                        to="/contact"
                        onClick={() => setIsOpen(false)}
                      >
                        Go to the contact form
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chatbot-message-row assistant">
                  <span className="chatbot-message-icon" aria-hidden="true"><Bot size={15} /></span>
                  <div className="chatbot-message assistant chatbot-typing" aria-label="Assistant is responding">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              {error && (
                <div className="chatbot-error" role="alert">
                  <p>{error}</p>
                  <Link to="/contact" onClick={() => setIsOpen(false)}>Open the contact form</Link>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-quick-replies" aria-label="Suggested questions">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => sendMessage(reply)}
                  disabled={loading}
                >
                  {reply}
                </button>
              ))}
            </div>

            <form
              className="chatbot-composer"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(draft);
              }}
            >
              <label className="chatbot-sr-only" htmlFor="chatbot-message">Ask a question</label>
              <input
                id="chatbot-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about TechSlot..."
                maxLength={500}
                disabled={loading}
              />
              <button type="submit" aria-label="Send message" disabled={loading || !draft.trim()}>
                <Send size={17} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close TechSlot chat' : 'Open TechSlot chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}
