import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { getPortfolioSettings } from '../services/api';

export default function InstagramReelSection() {
  const [reelUrl, setReelUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    getPortfolioSettings()
      .then(({ data }) => {
        if (active) setReelUrl(data.data.instagramReelUrl);
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

  if (loading || (!error && !reelUrl)) return null;

  const embedUrl = reelUrl.replace(/\/?$/, 'embed/');

  return (
    <section className="section instagram-reel-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Instagram</span>
          <h2 className="section-title">Latest <span className="text-gradient">Reel</span></h2>
          <p className="section-subtitle">
            A quick look at what we are creating.
          </p>
        </div>

        {error ? (
          <p className="instagram-reel-error" role="alert">
            The Instagram Reel could not be loaded right now. Please try again later.
          </p>
        ) : (
          <div className="instagram-reel-card">
            <iframe
              src={embedUrl}
              title="Instagram Reel"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a href={reelUrl} target="_blank" rel="noopener noreferrer">
              Watch on Instagram <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
