import { useEffect, useState } from 'react';
import api from '../services/api';
import { Component as AiLoader } from './ui/ai-loader';

const STARTUP_TIMEOUT_MS = 90000;
const HEALTH_CHECK_TIMEOUT_MS = 15000;
const RETRY_DELAY_MS = 2000;

export default function ApiStartupGate({ children }) {
  const [status, setStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    let controller;

    const checkApi = async () => {
      setStatus('checking');
      const deadline = Date.now() + STARTUP_TIMEOUT_MS;

      while (active && Date.now() < deadline) {
        controller = new AbortController();

        try {
          await api.get('/health', {
            timeout: HEALTH_CHECK_TIMEOUT_MS,
            signal: controller.signal,
          });
          if (active) setStatus('ready');
          return;
        } catch {
          if (!active) return;
          if (Date.now() >= deadline) break;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }

      if (active) setStatus('error');
    };

    checkApi();
    return () => {
      active = false;
      controller?.abort();
    };
  }, [retryCount]);

  if (status === 'ready') return children;
  if (status === 'checking') {
    return <AiLoader text="Waking up Techslot" />;
  }

  return (
    <div className="ai-loader" role="alert">
      <div className="ai-loader-error">
        <h1 className="ai-loader-error__title">We could not connect just yet</h1>
        <p className="ai-loader-error__description">
          The service is taking longer than expected to start. Please try again
          in a moment.
        </p>
        <button
          className="ai-loader-error__retry"
          onClick={() => setRetryCount((count) => count + 1)}
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
