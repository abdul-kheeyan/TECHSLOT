import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { getPortfolioSettings } from '../services/api';

function getInstagramEmbedUrl(reelUrl) {
  try {
    const url = new URL(reelUrl);
    const match = url.pathname.match(/^\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)\/?$/);
    if (!['www.instagram.com', 'instagram.com'].includes(url.hostname) || !match) {
      return null;
    }
    return `https://www.instagram.com/reel/${match[1]}/embed/`;
  } catch {
    return null;
  }
}

export default function InstagramReelSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeReel, setActiveReel] = useState(null);

  useEffect(() => {
    let active = true;

    getPortfolioSettings()
      .then(({ data }) => {
        if (active) {
          const savedReels = data.data.instagramReels
            || (data.data.instagramReelUrl ? [data.data.instagramReelUrl] : []);
          setReels(savedReels);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!reels.length) return undefined;

    let active = true;
    const processEmbeds = () => {
      if (active) window.instgrm?.Embeds?.process();
    };

    if (window.instgrm?.Embeds) {
      processEmbeds();
      return () => {
        active = false;
      };
    }

    let script = document.querySelector('script[data-instagram-embed]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.dataset.instagramEmbed = 'true';
      document.body.appendChild(script);
    }

    script.addEventListener('load', processEmbeds);
    return () => {
      active = false;
      script.removeEventListener('load', processEmbeds);
    };
  }, [reels]);

  useEffect(() => {
    if (!activeReel) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveReel(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeReel]);

  if (loading || (!error && !reels.length)) return null;

  const tileSpeed = 4;
  const duration = `${Math.max(reels.length, 1) * tileSpeed}s`;

  return (
    <section className="section instagram-reel-section">
      <div className="container">
        <div className="section-header center">
          <span className="section-label">Instagram</span>
          <h2 className="section-title">Latest <span className="text-gradient">Reels</span></h2>
          <p className="section-subtitle">
            A quick look at what we are creating.
          </p>
        </div>

        {error ? (
          <p className="instagram-reel-error" role="alert">
            Instagram Reels could not be loaded right now. Please try again later.
          </p>
        ) : (
          <div className="instagram-reel-carousel">
            {reels.map((reelUrl, index) => (
              <article
                className={`instagram-reel-card${reels.length === 1 ? ' is-static' : ''}`}
                key={reelUrl}
                style={{
                  '--reel-duration': duration,
                  '--reel-delay': `-${index * tileSpeed}s`,
                }}
              >
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={reelUrl}
                  data-instgrm-version="14"
                >
                  <a href={reelUrl} tabIndex={-1} aria-hidden="true">
                    Watch Reel {index + 1}
                  </a>
                </blockquote>
                <button
                  className="instagram-reel-play"
                  type="button"
                  aria-label={`Play Reel ${index + 1}`}
                  onClick={() => setActiveReel(reelUrl)}
                >
                  <span className="instagram-reel-play-icon"><Play size={26} fill="currentColor" /></span>
                </button>
              </article>
            ))}
          </div>
        )}
        {!error && reels.length > 0 && (
          <p className="instagram-reel-caption">
            A glimpse into the work, ideas, and moments behind each project.
          </p>
        )}
      </div>
      {activeReel && (
        <div
          className="instagram-reel-modal-backdrop"
          role="presentation"
          onClick={() => setActiveReel(null)}
        >
          <div
            className="instagram-reel-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Instagram Reel player"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="instagram-reel-modal-close"
              type="button"
              aria-label="Close Reel"
              onClick={() => setActiveReel(null)}
            >
              &times;
            </button>
            {getInstagramEmbedUrl(activeReel) ? (
              <iframe
                className="instagram-reel-player"
                src={getInstagramEmbedUrl(activeReel)}
                title="Instagram Reel"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="eager"
              />
            ) : (
              <p className="instagram-reel-modal-error" role="alert">
                This Instagram Reel link is invalid and cannot be played.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
