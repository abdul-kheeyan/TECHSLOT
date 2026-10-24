import { useEffect, useState } from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import { getPortfolioSettings } from '../services/api';

export default function InstagramReelSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading || (!error && !reels.length)) return null;

  return (
    <section className="section instagram-reel-section">
      <div className="container">
        <div className="section-header">
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
          <div className="instagram-reel-grid">
            {reels.map((reelUrl, index) => (
              <article className="instagram-reel-card" key={reelUrl}>
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={reelUrl}
                  data-instgrm-version="14"
                >
                  <a href={reelUrl} target="_blank" rel="noopener noreferrer">
                    <span className="instagram-reel-fallback-icon"><Camera size={28} /></span>
                    <span>Watch Reel {index + 1} on Instagram</span>
                    <ExternalLink size={14} />
                  </a>
                </blockquote>
                <a
                  className="instagram-reel-open"
                  href={reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open on Instagram <ExternalLink size={14} />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
