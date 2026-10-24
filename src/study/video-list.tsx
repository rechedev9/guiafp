import { ExternalLinkIcon, PlayIcon } from 'lucide-react';
import { useState } from 'react';
import { ExternalLink } from '@/components/external-link';
import type { Unit, Video } from '@/content/study/types';

const languages: Record<Video['lang'], string> = {
  es: 'Español',
  ca: 'Catalán',
  en: 'Inglés',
  de: 'Alemán',
};

const watchUrl = (video: Video) =>
  `https://www.youtube.com/watch?v=${video.id}${video.start ? `&t=${video.start}s` : ''}`;

// The iframe loads only on click, so the tab does not pull a YouTube player per video.
function Player({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    const params = new URLSearchParams({ autoplay: '1', rel: '0' });
    if (video.start) params.set('start', String(video.start));
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}?${params}`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
        allowFullScreen
        className="aspect-video w-full rounded-md border bg-black"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Reproducir: ${video.title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-md border bg-muted"
    >
      <img
        src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 grid place-items-center bg-black/10 transition-colors group-hover:bg-black/25">
        <span className="grid size-12 place-items-center rounded-full bg-black/70 text-white transition-transform group-hover:scale-110 group-active:scale-95">
          <PlayIcon className="ml-0.5 size-5 fill-current" />
        </span>
      </span>
    </button>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <li className="flex flex-col gap-3">
      <Player video={video} />
      <div className="flex flex-col gap-1">
        <h4 className="leading-snug font-medium">{video.title}</h4>
        <p className="text-xs text-muted-foreground">
          {video.channel} · {languages[video.lang]}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{video.note}</p>
        <ExternalLink
          href={watchUrl(video)}
          className="flex w-fit items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Abrir en YouTube
          <ExternalLinkIcon className="size-3" />
        </ExternalLink>
      </div>
    </li>
  );
}

export function VideoList({ units }: { units: Unit[] }) {
  return (
    <div className="flex max-w-4xl flex-col gap-10">
      {units.map((unit) => (
        <section key={unit.id} className="flex flex-col gap-4">
          {units.length > 1 && (
            <h3 className="text-lg font-semibold tracking-tight text-balance">{unit.title}</h3>
          )}
          <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {unit.videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
