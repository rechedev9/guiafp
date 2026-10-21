import {
  BellIcon,
  BrainIcon,
  BookOpenIcon,
  CalendarClockIcon,
  CircleHelpIcon,
  ClipboardCheckIcon,
  ExternalLinkIcon,
  FileUpIcon,
  GraduationCapIcon,
  LanguagesIcon,
  ListChecksIcon,
  MessageCircleIcon,
  MicIcon,
  RepeatIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { AnnotatedShot } from '@/components/annotated-shot';
import { ExternalLink } from '@/components/external-link';
import { TaskList } from '@/components/task-list';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  courses,
  deliveryTasks,
  firstBlockClose,
  glossary,
  grading,
  help,
  ipoNormsClose,
  links,
  normsTasks,
  routine,
  sections,
  shots,
  type SectionId,
} from '@/content/guide';
import { formatDate } from '@/lib/dates';
import { studyHref } from '@/lib/route';

const helpIcons = { book: BookOpenIcon, message: MessageCircleIcon, bell: BellIcon };
const tabsListClass = 'w-full justify-start overflow-x-auto sm:w-fit';
const linkClass = 'text-primary underline underline-offset-4';
const courseList = Object.entries(courses);
const shortDay = (iso: string) => formatDate(iso, { day: 'numeric', month: 'short' });
const longDay = (iso: string) =>
  formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long' });

type SectionProps = {
  id: SectionId;
  icon: ReactNode;
  lead: string;
  children: ReactNode;
};

function Section({ id, icon, lead, children }: SectionProps) {
  return (
    <section id={id} className="flex flex-col gap-6 border-t pt-12">
      <header className="flex flex-col gap-2">
        <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&>svg]:size-5">
            {icon}
          </span>
          {sections[id].title}
        </h2>
        <p className="max-w-prose text-muted-foreground">{lead}</p>
      </header>
      {children}
    </section>
  );
}

function Tile({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border bg-card p-4">
      <div className="font-semibold">{title}</div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-primary text-sm font-semibold text-primary">
            {i + 1}
          </span>
          <span className="pt-0.5 leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-relaxed">
      <TriangleAlertIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>{children}</div>
    </div>
  );
}

function Key({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-medium whitespace-nowrap text-primary">
      {children}
    </span>
  );
}

export function GuidePage() {
  const stats = [
    { label: 'asignaturas', value: String(courseList.length) },
    { label: 'primer cierre', value: shortDay(ipoNormsClose) },
    { label: 'cierra casi todo', value: shortDay(firstBlockClose) },
  ];

  return (
    <>
      <header className="border-b bg-gradient-to-b from-primary/10 to-transparent">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:py-16">
          <Badge variant="outline" className="h-auto w-fit max-w-full py-1 whitespace-normal">
            CFGS Guía, Información y Asistencias Turísticas, curso 2026-2027
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Cómo seguir el curso en FP Virtual
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Todo lo que hay que saber para moverse por el campus, entregar a tiempo y aprobar, con
            capturas reales de la plataforma.
          </p>
          <div className="flex flex-wrap gap-3">
            <ExternalLink href={links.areaPersonal} className={buttonVariants({ size: 'lg' })}>
              Abrir el campus
              <ExternalLinkIcon />
            </ExternalLink>
            <a href="#urgente" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              Ver lo urgente
            </a>
            <a href={studyHref()} className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <BrainIcon />
              Estudiar el temario
            </a>
          </div>
          <dl className="grid max-w-2xl grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-3 sm:p-4">
                <dt className="text-xs text-muted-foreground sm:text-sm">{stat.label}</dt>
                <dd className="text-xl font-semibold tabular-nums sm:text-2xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[200px_1fr]">
        <nav className="hidden lg:block">
          <ul className="sticky top-20 flex flex-col gap-1 text-sm">
            {Object.entries(sections).map(([id, section]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {section.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex min-w-0 flex-col gap-12">
          <Section
            id="urgente"
            icon={<ListChecksIcon />}
            lead={`Casi todo el primer bloque cierra el ${longDay(firstBlockClose)} a las 23:59. La aceptación de normas de IPO-2 cierra antes, el ${longDay(ipoNormsClose)}. Marca cada cosa al entregarla: se guarda en este navegador.`}
          >
            <TaskList title="Primero: aceptar las normas de cada asignatura" tasks={normsTasks} />
            <TaskList title="Entregas del primer bloque" tasks={deliveryTasks} />
            <p className="text-sm text-muted-foreground">
              La lista completa y siempre al día está en{' '}
              <ExternalLink href={links.upcoming} className={linkClass}>
                Próximos eventos
              </ExternalLink>
              . Lo marcado como "Fecha dentro de la tarea" no sale en el calendario: mira la fecha
              dentro de la actividad o en el cronograma de la asignatura.
            </p>
          </Section>

          <Section
            id="campus"
            icon={<GraduationCapIcon />}
            lead="Al entrar llegas al Área personal: es el punto de partida de cada día. Pasa el ratón por cada número para resaltarlo, o pulsa la captura para verla en grande (en el móvil, tócala)."
          >
            <Tabs defaultValue="area">
              <TabsList className={tabsListClass}>
                <TabsTrigger value="area">Área personal</TabsTrigger>
                <TabsTrigger value="filtro">Ver todo lo pendiente</TabsTrigger>
                <TabsTrigger value="menu">Menú personal</TabsTrigger>
              </TabsList>
              <TabsContent value="area" className="pt-4">
                <AnnotatedShot shot={shots.areaPersonal} />
              </TabsContent>
              <TabsContent value="filtro" className="pt-4">
                <AnnotatedShot shot={shots.filtro} />
              </TabsContent>
              <TabsContent value="menu" className="pt-4">
                <AnnotatedShot shot={shots.menuUsuario} />
              </TabsContent>
            </Tabs>
          </Section>

          <Section
            id="asignaturas"
            icon={<BookOpenIcon />}
            lead={`Son ${courseList.length}. Tutoría es el tablón del ciclo: no se entrega nada, pero ahí está la información oficial.`}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {courseList.map(([code, course]) => (
                <ExternalLink
                  key={code}
                  href={course.href}
                  className="group flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-[border-color,transform] hover:border-primary/50 active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {code}
                    </Badge>
                    <ExternalLinkIcon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{course.summary}</p>
                  <p className="mt-auto text-xs font-medium text-primary">{course.structure}</p>
                </ExternalLink>
              ))}
            </div>
          </Section>

          <Section
            id="dentro"
            icon={<ClipboardCheckIcon />}
            lead="Todas siguen el mismo esquema: una sección General arriba y debajo los bloques (Lliurament, Abgabe o Unit), que se abren uno tras otro durante el curso. Un bloque vacío es que aún no lo han abierto."
          >
            <h3 className="text-lg font-semibold">
              La sección General: léela entera el primer día
            </h3>
            <AnnotatedShot shot={shots.cursoGeneral} />
            <h3 className="text-lg font-semibold">
              Un bloque: material para estudiar y actividades con nota
            </h3>
            <AnnotatedShot shot={shots.lliurament} />
          </Section>

          <Section
            id="entregar"
            icon={<FileUpIcon />}
            lead="Hay tres tipos de actividad con nota. Elige la que tengas delante."
          >
            <Tabs defaultValue="tarea">
              <TabsList className={tabsListClass}>
                <TabsTrigger value="tarea">
                  <FileUpIcon />
                  Tarea
                </TabsTrigger>
                <TabsTrigger value="quiz">
                  <ClipboardCheckIcon />
                  Cuestionario
                </TabsTrigger>
                <TabsTrigger value="audio">
                  <MicIcon />
                  Foro y audio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tarea" className="flex flex-col gap-6 pt-4">
                <Steps
                  items={[
                    'Entra en la tarea, descarga el enunciado y mira la fecha de cierre.',
                    'Haz el trabajo en tu ordenador y guárdalo en Word o PDF.',
                    <>
                      Vuelve a la tarea y pulsa <Key>Agregar entrega</Key>.
                    </>,
                    'Arrastra el archivo al recuadro punteado.',
                    <>
                      Pulsa <Key>Guardar cambios</Key>. Si después aparece <Key>Enviar tarea</Key>,
                      púlsalo también.
                    </>,
                    <>
                      Comprueba que el estado dice <strong>Enviado para calificar</strong>.
                    </>,
                  ]}
                />
                <AnnotatedShot shot={shots.tarea} />
                <AnnotatedShot shot={shots.agregarEntrega} />
                <Callout>
                  Las tareas no se corrigen hasta que cierra el plazo, y{' '}
                  <strong>las que no se entregan a tiempo no se pueden recuperar</strong>. Puedes
                  sustituir el archivo mientras el plazo siga abierto.
                </Callout>
              </TabsContent>

              <TabsContent value="quiz" className="flex flex-col gap-6 pt-4">
                <Steps
                  items={[
                    'Antes de empezar, mira cuántos intentos tienes y el límite de tiempo.',
                    'Estudia primero: el reloj empieza al pulsar el botón y no se para.',
                    <>
                      Pulsa <Key>Intento de cuestionario</Key> y responde.
                    </>,
                    <>
                      Al acabar, <Key>Terminar intento</Key> y luego{' '}
                      <Key>Enviar todo y terminar</Key>. Sin este último paso no cuenta.
                    </>,
                  ]}
                />
                <AnnotatedShot shot={shots.cuestionario} />
                <Callout>
                  En los cuestionarios tipo test de IPO-2 cada respuesta incorrecta resta un 33% de
                  la pregunta. Si no la sabes, mejor dejarla en blanco.
                </Callout>
              </TabsContent>

              <TabsContent value="audio" className="flex flex-col gap-6 pt-4">
                <Steps
                  items={[
                    'Entra en el foro del audio (en Alemán se llaman "Audio: ... (OBLIGATORISCH)").',
                    <>
                      Pulsa <Key>Añadir un nuevo tema de debate</Key>.
                    </>,
                    'Escribe un asunto corto.',
                    <>
                      En el editor, pulsa el micrófono (<Key>Grabar audio</Key>), deja que el
                      navegador use el micrófono y habla. Máximo 2 minutos.
                    </>,
                    <>
                      Pulsa <Key>Enviar al foro</Key>.
                    </>,
                  ]}
                />
                <AnnotatedShot shot={shots.foro} />
                <AnnotatedShot shot={shots.foroAudio} />
                <Callout>
                  En el audio de Alemán I no se puede leer la redacción Schreiben 1.1: hay que
                  hablar con tus palabras. El enunciado marca dos plazos, el 10 y el 13 de
                  noviembre.
                </Callout>
                <Tile title="Lo que piden en la redacción Schreiben 1.1 de Alemán I">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Al menos 200 palabras y 3 párrafos, con fotos.</li>
                    <li>Presentarte como si trabajaras en turismo en Baleares.</li>
                    <li>Sin traductores automáticos ni IA: trabaja con el material y el libro.</li>
                  </ul>
                </Tile>
              </TabsContent>
            </Tabs>
          </Section>

          <Section
            id="fechas"
            icon={<CalendarClockIcon />}
            lead="Dos páginas que conviene tener a mano: la lista de próximos eventos y el resumen de calificaciones."
          >
            <AnnotatedShot shot={shots.calendario} />
            <AnnotatedShot shot={shots.calificaciones} />
          </Section>

          <Section
            id="aprobar"
            icon={<GraduationCapIcon />}
            lead="La nota sale de las actividades online y de un examen presencial obligatorio en mayo. Cada asignatura fija sus porcentajes en sus Normes de funcionament."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {grading.map((part) => (
                <Tile
                  key={part.label}
                  title={<span className="text-3xl text-primary tabular-nums">{part.value}</span>}
                >
                  {part.label}
                </Tile>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Ejemplo de IPO-2. Hace falta un 5 de media en lo online para poder presentarse al
              examen.
            </p>
            <ul className="flex flex-col gap-2 leading-relaxed">
              <li>Hay que entregar todas las actividades evaluables.</li>
              <li>Lo que no se entrega en plazo no se recupera.</li>
              <li>
                Las fechas de los exámenes presenciales están en{' '}
                <ExternalLink href={links.tutoria} className={linkClass}>
                  Tutoría
                </ExternalLink>
                , sección Calendaris exàmens finals presencials.
              </li>
            </ul>
          </Section>

          <Section
            id="rutina"
            icon={<RepeatIcon />}
            lead="El profesorado insiste en conectarse cada día, aunque sean 15 minutos, para que no se acumule el trabajo."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {routine.map((step) => (
                <Tile key={step.when} title={step.when}>
                  {step.what}
                </Tile>
              ))}
            </div>
          </Section>

          <Section
            id="glosario"
            icon={<LanguagesIcon />}
            lead="Los menús del campus están en castellano, pero el contenido de las asignaturas está en catalán, y el de Alemán en alemán."
          >
            <dl className="grid gap-x-6 rounded-xl border bg-card p-4 sm:grid-cols-2">
              {glossary.map(([term, meaning]) => (
                <div
                  key={term}
                  className="flex justify-between gap-4 border-b py-2 last:border-0 sm:[&:nth-last-child(2)]:border-0"
                >
                  <dt className="font-medium">{term}</dt>
                  <dd className="text-right text-muted-foreground">{meaning}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section
            id="ayuda"
            icon={<CircleHelpIcon />}
            lead="Cada profesor es tutor de su asignatura, así que las dudas van a cada asignatura y no a la coordinación."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {help.map((item) => {
                const Icon = helpIcons[item.icon];
                return (
                  <Tile
                    key={item.title}
                    title={
                      <span className="flex flex-col gap-2">
                        <Icon className="size-5 text-primary" />
                        {item.title}
                      </span>
                    }
                  >
                    {item.text}
                  </Tile>
                );
              })}
            </div>
          </Section>

          <footer className="border-t pt-6 text-sm text-muted-foreground">
            Actualizada el 21 de octubre de 2026. Las capturas son del campus real; los nombres de
            otras personas están ocultos.
          </footer>
        </main>
      </div>
    </>
  );
}
