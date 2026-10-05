import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { askChatbot } from '../../services/api';
import './chatbot.css';

const initialQuickReplies = [
  'What services do you offer?',
  'How does the project process work?',
  'What are your pricing plans?',
  'How can I start a project?',
];

const initialMessage = {
  id: 0,
  role: 'assistant',
  content: 'Hi! How can I help you?',
  quickReplies: initialQuickReplies,
};

const followUpQuickReplies = (question, answer, contactCta) => {
  if (contactCta) return ['What services do you offer?', 'How can I start a project?'];

  const topic = `${question} ${answer}`.toLowerCase();
  if (topic.includes('pricing') || topic.includes('price') || topic.includes('quote') || topic.includes('budget')) {
    return ['What budget ranges can I select?', 'How can I start a project?'];
  }
  if (topic.includes('timeline') || topic.includes('delivery') || topic.includes('weeks')) {
    return ['How does the project process work?', 'How can I start a project?'];
  }
  if (topic.includes('maintenance') || topic.includes('support')) {
    return ['What services do you offer?', 'How can I start a project?'];
  }
  if (topic.includes('process') || topic.includes('discovery') || topic.includes('planning')) {
    return ['What services do you offer?', 'What technologies do you use?'];
  }
  if (topic.includes('technolog') || topic.includes('stack') || topic.includes('react') || topic.includes('mongodb')) {
    return ['What services do you offer?', 'How does the project process work?'];
  }
  if (topic.includes('contact form') || topic.includes('start a project')) {
    return ['What services do you offer?', 'What are your pricing plans?'];
  }
  return ['How does the project process work?', 'What are your pricing plans?'];
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function Chatbot() {
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(0);
  const geometryRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    const updateVisualViewport = () => {
      const viewport = window.visualViewport;
      const visibleHeight = viewport?.height ?? window.innerHeight;
      const visibleTop = viewport?.offsetTop ?? 0;
      const bottomInset = Math.max(0, window.innerHeight - visibleTop - visibleHeight);
      const rootStyle = document.documentElement.style;

      rootStyle.setProperty('--chatbot-visual-height', `${visibleHeight}px`);
      rootStyle.setProperty('--chatbot-visual-bottom-inset', `${bottomInset}px`);
    };

    updateVisualViewport();
    window.addEventListener('resize', updateVisualViewport);
    window.visualViewport?.addEventListener('resize', updateVisualViewport);
    window.visualViewport?.addEventListener('scroll', updateVisualViewport);

    return () => {
      window.removeEventListener('resize', updateVisualViewport);
      window.visualViewport?.removeEventListener('resize', updateVisualViewport);
      window.visualViewport?.removeEventListener('scroll', updateVisualViewport);
      document.documentElement.style.removeProperty('--chatbot-visual-height');
      document.documentElement.style.removeProperty('--chatbot-visual-bottom-inset');
    };
  }, []);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [isOpen, messages, loading, error]);

  useEffect(() => {
    const fitPanel = () => {
      if (window.innerWidth < 768) {
        geometryRef.current = null;
        setGeometry(null);
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const current = geometryRef.current;
      const maxWidth = Math.max(1, viewportWidth - 24);
      const maxHeight = Math.max(1, viewportHeight - 120);
      const width = clamp(current?.width ?? 390, Math.min(320, maxWidth), Math.min(560, maxWidth));
      const height = clamp(
        current?.height ?? 590,
        Math.min(360, maxHeight),
        Math.min(760, maxHeight)
      );
      const next = {
        width,
        height,
        left: current
          ? clamp(current.left, 8, Math.max(8, viewportWidth - width - 8))
          : Math.max(8, viewportWidth - width - 24),
        top: current
          ? clamp(current.top, 8, Math.max(8, viewportHeight - height - 8))
          : Math.max(8, viewportHeight - height - 96),
      };
      geometryRef.current = next;
      setGeometry(next);
    };

    if (isOpen) {
      fitPanel();
      window.addEventListener('resize', fitPanel);
      return () => window.removeEventListener('resize', fitPanel);
    }
    return undefined;
  }, [isOpen]);

  const resizePanel = (event, edges) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.innerWidth < 768 || !geometryRef.current) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const start = geometryRef.current;
    const right = start.left + start.width;
    const bottom = start.top + start.height;
    const maxWidth = Math.min(560, window.innerWidth - 24);
    const maxHeight = Math.min(760, window.innerHeight - 24);
    const minWidth = Math.min(320, maxWidth);
    const minHeight = Math.min(360, maxHeight);
    const handle = event.currentTarget;

    handle.setPointerCapture(event.pointerId);

    const onPointerMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      let left = start.left;
      let top = start.top;
      let width = start.width;
      let height = start.height;

      if (edges.includes('e')) {
        width = clamp(start.width + dx, minWidth, Math.min(maxWidth, window.innerWidth - start.left - 8));
      } else if (edges.includes('w')) {
        width = clamp(start.width - dx, minWidth, Math.min(maxWidth, right - 8));
        left = right - width;
      }

      if (edges.includes('s')) {
        height = clamp(start.height + dy, minHeight, Math.min(maxHeight, window.innerHeight - start.top - 8));
      } else if (edges.includes('n')) {
        height = clamp(start.height - dy, minHeight, Math.min(maxHeight, bottom - 8));
        top = bottom - height;
      }

      const next = { left, top, width, height };
      geometryRef.current = next;
      setGeometry(next);
    };

    const stopResize = () => {
      handle.removeEventListener('pointermove', onPointerMove);
      handle.removeEventListener('pointerup', stopResize);
      handle.removeEventListener('pointercancel', stopResize);
    };

    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', stopResize);
    handle.addEventListener('pointercancel', stopResize);
  };

  const sendMessage = async (value) => {
    const message = value.trim();
    if (!message || loading) return;

    setMessages((current) => [
      ...current,
      { id: ++messageIdRef.current, role: 'user', content: message },
    ]);
    setDraft('');
    setError('');
    setLoading(true);

    try {
      const { data } = await askChatbot(message);
      setMessages((current) => [
        ...current,
        {
          id: ++messageIdRef.current,
          role: 'assistant',
          content: data.data.answer,
          contactCta: data.data.contactCta,
          quickReplies: followUpQuickReplies(message, data.data.answer, data.data.contactCta),
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

  return createPortal(
    <div className="chatbot">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="chatbot-panel"
            style={geometry ? {
              right: 'auto',
              bottom: 'auto',
              left: geometry.left,
              top: geometry.top,
              width: geometry.width,
              height: geometry.height,
            } : undefined}
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

            <div className="chatbot-conversation" aria-live="polite">
              {messages.map((message) => (
                <div className="chatbot-turn" key={message.id}>
                  <div className={`chatbot-message-row ${message.role}`}>
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
                  {message.role === 'assistant' && message.quickReplies?.length > 0 && (
                    <div className="chatbot-quick-replies" aria-label="Suggested questions">
                      {message.quickReplies.map((reply) => (
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
                  )}
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

            <div className="chatbot-resize-handles" aria-hidden="true">
              {['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((edge) => (
                <div
                  key={edge}
                  className={`chatbot-resize-handle ${edge}`}
                  onPointerDown={(event) => resizePanel(event, edge)}
                />
              ))}
            </div>
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
    </div>,
    document.body
  );
}
