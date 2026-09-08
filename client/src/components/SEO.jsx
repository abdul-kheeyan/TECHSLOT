import { useEffect } from 'react';

export default function SEO({ title, description, path = '' }) {
  const fullTitle = title ? `${title} | techslot.dev` : 'techslot.dev — Professional Web Development';
  const desc = description || 'Building digital experiences that drive results. Fast, scalable and modern websites and web applications.';

  useEffect(() => {
    document.title = fullTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    if (path) {
      const canonical = `https://techslot.dev${path}`;
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [fullTitle, desc, path]);

  return null;
}
