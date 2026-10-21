import { Volume2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { canSpeak, speak } from '@/lib/study';

type SpeakButtonProps = { text: string; lang?: string };

export function SpeakButton({ text, lang }: SpeakButtonProps) {
  if (!lang || !canSpeak(text)) return null;
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Escuchar la pronunciación"
      onClick={(event) => {
        event.stopPropagation();
        speak(text, lang);
      }}
    >
      <Volume2Icon />
    </Button>
  );
}
