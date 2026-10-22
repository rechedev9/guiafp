import { cn } from 'cn';
import { Maximize2Icon } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Marker, Shot } from '@/content/guide';

// Boxes narrower than this get their number below so it does not hide the target.
const SMALL_BOX_PX = 60;

type OverlayProps = {
  shot: Shot;
  active: number | null;
  sizes: string;
};

function Overlay({ shot, active, sizes }: OverlayProps) {
  return (
    <div className="relative">
      <img
        src={`/shots/${shot.name}.webp`}
        srcSet={`/shots/${shot.name}-800.webp 800w, /shots/${shot.name}.webp ${shot.width}w`}
        sizes={sizes}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        loading="lazy"
        className="block h-auto w-full"
      />
      {shot.markers.map((marker) => {
        const [x, y, w, h] = marker.box;
        return (
          <div
            key={marker.n}
            aria-hidden
            className={cn(
              'absolute rounded-md border-2 border-primary bg-primary/10 transition-shadow duration-150',
              active === marker.n && 'bg-primary/20 ring-4 ring-primary/30',
            )}
            style={{
              left: `${(x / shot.width) * 100}%`,
              top: `${(y / shot.height) * 100}%`,
              width: `${(w / shot.width) * 100}%`,
              height: `${(h / shot.height) * 100}%`,
            }}
          >
            <span
              className={cn(
                'absolute flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground shadow-sm sm:size-6 sm:text-xs',
                w < SMALL_BOX_PX
                  ? 'top-full left-1/2 mt-1 -translate-x-1/2'
                  : '-top-2.5 -left-2.5 sm:-top-3 sm:-left-3',
              )}
            >
              {marker.n}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type LegendProps = {
  markers: Marker[];
  onActive: (n: number | null) => void;
};

function Legend({ markers, onActive }: LegendProps) {
  return (
    <ol className="grid gap-2 p-4 sm:grid-cols-2">
      {markers.map((marker) => (
        <li
          key={marker.n}
          tabIndex={0}
          onMouseEnter={() => onActive(marker.n)}
          onMouseLeave={() => onActive(null)}
          onFocus={() => onActive(marker.n)}
          onBlur={() => onActive(null)}
          className="flex gap-3 rounded-lg p-2 text-sm leading-snug outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {marker.n}
          </span>
          <span className="pt-0.5">{marker.label}</span>
        </li>
      ))}
    </ol>
  );
}

export function AnnotatedShot({ shot }: { shot: Shot }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <figure className="overflow-hidden rounded-lg border bg-card">
      <Dialog onOpenChange={() => setActive(null)}>
        <DialogTrigger
          className="group relative block w-full cursor-zoom-in border-b"
          aria-label={`Ampliar captura: ${shot.alt}`}
        >
          <Overlay shot={shot} active={active} sizes="(min-width: 1024px) 900px, 100vw" />
          <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2Icon className="size-3.5" />
            Ampliar
          </span>
        </DialogTrigger>
        <DialogContent className="max-h-[94vh] overflow-auto p-2 pt-10 sm:max-w-[min(96vw,1500px)]">
          <DialogTitle className="sr-only">{shot.alt}</DialogTitle>
          <Overlay shot={shot} active={active} sizes="96vw" />
          <Legend markers={shot.markers} onActive={setActive} />
        </DialogContent>
      </Dialog>
      {shot.caption && (
        <figcaption className="px-4 pt-3 text-sm text-muted-foreground">{shot.caption}</figcaption>
      )}
      <Legend markers={shot.markers} onActive={setActive} />
    </figure>
  );
}
