import * as React from 'react';
import './ai-loader.css';

export const Component = ({ size = 180, text = 'Waking up Techslot' }) => {
  const letters = Array.from(text);

  return (
    <div className="ai-loader" role="status" aria-label={text}>
      <div
        className="ai-loader__visual"
        style={{ '--ai-loader-size': `${size}px` }}
        aria-hidden="true"
      >
        <div className="ai-loader__letters">
          {letters.map((letter, index) => (
            <span
              className="ai-loader__letter"
              key={`${letter}-${index}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="ai-loader__circle" />
      </div>
      <p className="ai-loader__message">{text}</p>
      <p className="ai-loader__hint">Starting things up for you</p>
    </div>
  );
};
