import { useEffect, useState } from 'react';

const fallbackFor = (project) => (
  project?.slug === 'veltrix' ? '/veltrix-cover.svg' : '/project-placeholder.svg'
);

/**
 * Keeps portfolio cards useful when a remote image is unavailable.
 * A locally served fallback avoids broken-image icons and works offline.
 */
export default function ProjectImage({ project, className, style, loading = 'lazy' }) {
  const [src, setSrc] = useState(project.image);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    setSrc(project.image);
    setUsingFallback(false);
  }, [project.image]);

  return (
    <img
      src={src}
      alt={project.title}
      className={className}
      style={style}
      loading={loading}
      onError={() => {
        if (!usingFallback) {
          setSrc(fallbackFor(project));
          setUsingFallback(true);
        }
      }}
    />
  );
}
