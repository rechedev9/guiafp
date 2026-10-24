import { cn } from 'cn';
import { CloudCheckIcon, CloudOffIcon, CloudUploadIcon } from 'lucide-react';
import { type SyncStatus, useSyncStatus } from '@/lib/sync';

const views: Record<SyncStatus, { icon: typeof CloudCheckIcon; label: string }> = {
  saving: { icon: CloudUploadIcon, label: 'Guardando tu progreso…' },
  saved: { icon: CloudCheckIcon, label: 'Progreso guardado en el servidor' },
  offline: {
    icon: CloudOffIcon,
    label: 'Sin conexión: tu progreso queda en este dispositivo y se subirá al volver',
  },
};

export function SyncIndicator() {
  const status = useSyncStatus((state) => state.status);
  const { icon: Icon, label } = views[status];
  return (
    <span
      role="img"
      title={label}
      aria-label={label}
      className={cn(
        'flex size-8 items-center justify-center',
        status === 'offline' ? 'text-warning' : 'text-muted-foreground',
      )}
    >
      <Icon className="size-4" />
    </span>
  );
}
