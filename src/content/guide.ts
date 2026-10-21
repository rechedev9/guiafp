export type Marker = {
  n: number;
  box: [x: number, y: number, w: number, h: number];
  label: string;
};

export type Shot = {
  name: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  markers: Marker[];
};

export type CourseCode = 'TUT' | 'AP-2' | 'HCIB' | 'IPO-2' | 'PI' | 'SLEA-1' | 'SLEA-2';

type Course = {
  short: string;
  name: string;
  summary: string;
  structure: string;
  href: string;
};

export type Task = {
  id: string;
  course: CourseCode;
  title: string;
  deadline: string | null;
  href?: string;
};

const campus = 'https://fpadistancia.caib.es';

export const links = {
  areaPersonal: `${campus}/my/`,
  upcoming: `${campus}/calendar/view.php?view=upcoming`,
  tutoria: `${campus}/course/view.php?id=450`,
};

export const shots = {
  areaPersonal: {
    name: '01-area-personal',
    width: 1568,
    height: 749,
    alt: 'Área personal del campus',
    markers: [
      { n: 1, box: [283, 116, 84, 32], label: 'Cursos: la lista de todas tus asignaturas.' },
      {
        n: 2,
        box: [1253, 36, 34, 36],
        label: 'Campana: avisos de la plataforma, como notas nuevas o respuestas en foros.',
      },
      {
        n: 3,
        box: [1288, 36, 30, 36],
        label: 'Bocadillo: mensajes privados con el profesorado.',
      },
      {
        n: 4,
        box: [1402, 34, 132, 40],
        label: 'Tu nombre: menú con Calificaciones, Calendario y Perfil.',
      },
      { n: 5, box: [70, 284, 162, 40], label: 'Filtro de la Línea de tiempo. Cámbialo a "Todos".' },
      {
        n: 6,
        box: [64, 582, 1106, 167],
        label: 'Tarjetas de las asignaturas. Haz clic para entrar en una.',
      },
      {
        n: 7,
        box: [1236, 514, 314, 235],
        label: 'Próximos eventos: lo que vence pronto, con día y hora.',
      },
    ],
  },
  filtro: {
    name: '02-linea-tiempo-filtro',
    width: 1568,
    height: 749,
    alt: 'Desplegable del filtro de la Línea de tiempo',
    caption:
      'La Línea de tiempo viene en Próximos 7 días y parece vacía aunque haya entregas en 10 días. Cámbiala a Todos una vez y se queda así.',
    markers: [
      {
        n: 1,
        box: [84, 346, 72, 26],
        label: 'Todos: muestra todo lo pendiente, no solo los próximos 7 días.',
      },
      { n: 2, box: [84, 373, 92, 26], label: 'Atrasados: lo que se ha pasado de fecha.' },
    ],
  },
  menuUsuario: {
    name: '03-menu-usuario',
    width: 1568,
    height: 749,
    alt: 'Menú de usuario abierto',
    caption: 'Se abre pulsando tu nombre, arriba a la derecha.',
    markers: [
      {
        n: 1,
        box: [1372, 235, 162, 32],
        label: 'Calificaciones: tus notas de todas las asignaturas.',
      },
      { n: 2, box: [1372, 333, 162, 32], label: 'Calendario: todas las fechas en vista de mes.' },
      { n: 3, box: [1372, 614, 162, 32], label: 'Cerrar sesión, si usas un ordenador compartido.' },
    ],
  },
  cursoGeneral: {
    name: '04-curso-general',
    width: 1568,
    height: 749,
    alt: 'Sección General de una asignatura',
    markers: [
      {
        n: 1,
        box: [10, 124, 300, 622],
        label: 'Índice de la asignatura: salta a cualquier bloque o actividad.',
      },
      {
        n: 2,
        box: [380, 250, 700, 44],
        label: 'Normas de funcionamiento: cómo se evalúa. Léelas primero.',
      },
      {
        n: 3,
        box: [380, 322, 820, 72],
        label: 'Aceptación de normas: cuestionario obligatorio, con fecha de cierre.',
      },
      { n: 4, box: [380, 428, 200, 42], label: 'Foro de avisos: lo que publica el profesorado.' },
      {
        n: 5,
        box: [380, 578, 660, 42],
        label: 'Foro de dudas: aquí se preguntan las dudas del temario.',
      },
    ],
  },
  lliurament: {
    name: '05-lliurament',
    width: 1568,
    height: 749,
    alt: 'Bloque de contenidos con actividades evaluables',
    caption:
      'Lo que tiene fecha de cierre debajo cuenta para la nota. El resto es material de estudio.',
    markers: [
      {
        n: 1,
        box: [380, 114, 580, 44],
        label: 'Material para estudiar (un libro de la plataforma). No se entrega.',
      },
      { n: 2, box: [380, 256, 370, 72], label: 'Tarea evaluable, con su fecha de cierre debajo.' },
      { n: 3, box: [380, 358, 370, 72], label: 'Cuestionario evaluable, con su fecha de cierre.' },
    ],
  },
  tarea: {
    name: '06-tarea',
    width: 1568,
    height: 749,
    alt: 'Página de una tarea',
    caption: 'La página de la tarea.',
    markers: [
      { n: 1, box: [60, 152, 380, 34], label: 'Fecha y hora límite.' },
      { n: 2, box: [78, 224, 300, 34], label: 'Enunciado de la tarea en PDF. Descárgalo y léelo.' },
      {
        n: 3,
        box: [38, 285, 140, 42],
        label: 'Agregar entrega: abre el formulario para subir tu archivo.',
      },
      {
        n: 4,
        box: [40, 399, 1480, 46],
        label: 'Estado: cuando entregues debe cambiar a "Enviado para calificar".',
      },
    ],
  },
  agregarEntrega: {
    name: '07-agregar-entrega',
    width: 1568,
    height: 749,
    alt: 'Formulario para subir el archivo de una tarea',
    caption: 'El formulario para subir el archivo.',
    markers: [
      {
        n: 1,
        box: [430, 165, 1080, 134],
        label: 'Arrastra aquí tu archivo, o pulsa el botón de arriba a la izquierda para buscarlo.',
      },
      {
        n: 2,
        box: [1040, 70, 482, 26],
        label: 'Límites: en esta tarea, 1 archivo de 10 MB como máximo.',
      },
      { n: 3, box: [414, 308, 462, 98], label: 'Formatos aceptados: Word, LibreOffice o PDF.' },
      {
        n: 4,
        box: [414, 451, 148, 44],
        label: 'Guardar cambios. Sin este clic no se entrega nada.',
      },
    ],
  },
  cuestionario: {
    name: '08-cuestionario',
    width: 1568,
    height: 749,
    alt: 'Página de inicio de un cuestionario',
    caption:
      'Cuestionario UT01 de IPO-2: 3 intentos de 10 minutos, cuenta la nota más alta y se aprueba con un 5.',
    markers: [
      { n: 1, box: [60, 194, 380, 34], label: 'Fecha y hora de cierre.' },
      {
        n: 2,
        box: [38, 263, 182, 42],
        label: 'Empieza el intento. El reloj arranca en ese momento.',
      },
      { n: 3, box: [36, 315, 240, 60], label: 'Intentos permitidos y límite de tiempo.' },
      { n: 4, box: [36, 420, 300, 28], label: 'Nota mínima para aprobar el cuestionario.' },
    ],
  },
  foro: {
    name: '09-foro',
    width: 1568,
    height: 749,
    alt: 'Foro con la lista de debates',
    markers: [
      { n: 1, box: [365, 110, 242, 42], label: 'Añadir un nuevo tema: así se publica tu entrada.' },
      {
        n: 2,
        box: [1350, 110, 172, 42],
        label: 'Suscribirse: recibes por correo lo que se publique.',
      },
      {
        n: 3,
        box: [40, 250, 1480, 192],
        label: 'Entradas de los compañeros (nombres difuminados en esta guía).',
      },
    ],
  },
  foroAudio: {
    name: '10-foro-audio',
    width: 1568,
    height: 749,
    alt: 'Editor de un mensaje de foro con el botón de grabar audio',
    caption: 'El micrófono está en la barra del editor.',
    markers: [
      {
        n: 1,
        box: [416, 265, 458, 42],
        label: 'Asunto: un título corto, por ejemplo "Vorstellung".',
      },
      {
        n: 2,
        box: [802, 376, 40, 40],
        label: 'Grabar audio: pulsa, da permiso al micrófono y habla.',
      },
    ],
  },
  calendario: {
    name: '11-calendario',
    width: 1568,
    height: 749,
    alt: 'Lista de próximos eventos del calendario',
    caption: 'Próximos eventos (menú personal, Calendario).',
    markers: [
      { n: 1, box: [64, 110, 1456, 70], label: 'Qué vence. "es tanca" significa "se cierra".' },
      { n: 2, box: [200, 198, 212, 26], label: 'Día y hora límite.' },
      {
        n: 3,
        box: [1384, 296, 122, 28],
        label: 'Ir a la actividad: te lleva directa a la entrega.',
      },
    ],
  },
  calificaciones: {
    name: '12-calificaciones',
    width: 1568,
    height: 749,
    alt: 'Resumen de calificaciones por asignatura',
    caption: 'Calificaciones (menú personal, Calificaciones).',
    markers: [
      {
        n: 1,
        box: [64, 120, 500, 32],
        label: 'Haz clic en una asignatura para ver la nota de cada actividad.',
      },
      {
        n: 2,
        box: [1238, 74, 282, 352],
        label: 'Nota de la asignatura. El guion significa que aún no hay nota.',
      },
    ],
  },
} satisfies Record<string, Shot>;

const course = (id: number) => `${campus}/course/view.php?id=${id}`;

export const ipoNormsClose = '2026-11-05T23:59+01:00';
export const firstBlockClose = '2026-11-10T23:59+01:00';

export const courses: Record<CourseCode, Course> = {
  TUT: {
    short: 'Tutoría',
    name: 'Tutoría',
    summary:
      'No es una asignatura. Normativa, manual del campus, calendario de exámenes presenciales, correo del centro, notas y matrícula.',
    structure: 'Secciones informativas',
    href: links.tutoria,
  },
  'AP-2': {
    short: 'Inglés',
    name: 'Inglés profesional II',
    summary: 'Inglés para turismo, con sesiones guiadas interactivas y foros.',
    structure: '3 Lliuraments y 4 Work Units',
    href: course(407),
  },
  HCIB: {
    short: 'Historia',
    name: 'Historia y Cultura de las Illes Balears',
    summary: 'Historia de las islas con libros en la plataforma y un examen online por bloque.',
    structure: '5 Lliuraments',
    href: course(408),
  },
  'IPO-2': {
    short: 'IPO-2',
    name: 'Itinerario personal para la ocupabilidad II',
    summary: 'Empleo y emprendimiento. Una tarea y un cuestionario por unidad.',
    structure: 'Unidades UT01, UT02...',
    href: course(348),
  },
  PI: {
    short: 'Proyecto',
    name: 'Proyecto intermodular',
    summary: 'Un proyecto que se construye durante el curso en cuatro entregas.',
    structure: '4 Lliuraments',
    href: course(409),
  },
  'SLEA-1': {
    short: 'Alemán I',
    name: 'Alemán I',
    summary: 'Alemán A1 con el libro Menschen im Beruf Tourismus. Redacciones, foros y audios.',
    structure: '5 Abgaben y examen',
    href: course(143),
  },
  'SLEA-2': {
    short: 'Alemán II',
    name: 'Alemán II',
    summary: 'Alemán A2 con el mismo libro. Redacciones, foros y audios.',
    structure: '6 Abgaben y examen',
    href: course(426),
  },
};

export const normsTasks: Task[] = [
  {
    id: 'ipo-normas',
    course: 'IPO-2',
    title: 'Aceptación de normas',
    deadline: ipoNormsClose,
    href: `${campus}/mod/quiz/view.php?id=96710`,
  },
  {
    id: 'hcib-normas',
    course: 'HCIB',
    title: 'Formulario de aceptación de normas',
    deadline: firstBlockClose,
  },
  {
    id: 'ap-normas',
    course: 'AP-2',
    title: 'Cuestionario de aceptación de normas',
    deadline: null,
  },
  { id: 'pi-normas', course: 'PI', title: 'Cuestionario de aceptación de normas', deadline: null },
  {
    id: 'slea1-normas',
    course: 'SLEA-1',
    title: 'Formulario de aceptación de normas',
    deadline: null,
  },
  {
    id: 'slea2-normas',
    course: 'SLEA-2',
    title: 'Formulario de aceptación de normas',
    deadline: null,
  },
];

export const deliveryTasks: Task[] = [
  {
    id: 'ipo-tasca1',
    course: 'IPO-2',
    title: 'Tarea 1 de la UT01',
    deadline: firstBlockClose,
    href: `${campus}/mod/assign/view.php?id=96717`,
  },
  {
    id: 'ipo-quiz1',
    course: 'IPO-2',
    title: 'Cuestionario UT01',
    deadline: firstBlockClose,
    href: `${campus}/mod/quiz/view.php?id=124738`,
  },
  {
    id: 'hcib-tasca1',
    course: 'HCIB',
    title: 'Tarea 1: la Prehistoria de las Illes Balears',
    deadline: firstBlockClose,
  },
  { id: 'hcib-examen1', course: 'HCIB', title: 'Examen 1 (online)', deadline: firstBlockClose },
  {
    id: 'slea1-schreiben',
    course: 'SLEA-1',
    title: 'Schreiben 1.1: presentarte por escrito',
    deadline: firstBlockClose,
  },
  {
    id: 'slea1-audio',
    course: 'SLEA-1',
    title: 'Audio obligatorio: presentarte hablando',
    deadline: firstBlockClose,
    href: `${campus}/mod/forum/view.php?id=96127`,
  },
  {
    id: 'slea2-schreiben',
    course: 'SLEA-2',
    title: 'Schreiben 1.1: una casa, un piso y una habitación de hotel',
    deadline: firstBlockClose,
  },
  {
    id: 'slea2-audio',
    course: 'SLEA-2',
    title: 'Audio obligatorio: recuerdos de un viaje',
    deadline: firstBlockClose,
  },
  { id: 'ap-l1', course: 'AP-2', title: 'Lliurament 1: Unit 1 y Forum 1', deadline: null },
  {
    id: 'pi-l1',
    course: 'PI',
    title: 'Entrega inicial (borrador, 20% de la nota)',
    deadline: null,
  },
];

export const sections = {
  urgente: { nav: 'Lo urgente', title: 'Lo urgente' },
  campus: { nav: 'El campus', title: 'El campus por dentro' },
  asignaturas: { nav: 'Asignaturas', title: 'Las asignaturas' },
  dentro: { nav: 'Dentro de una asignatura', title: 'Dentro de una asignatura' },
  entregar: { nav: 'Cómo entregar', title: 'Cómo entregar' },
  fechas: { nav: 'Fechas y notas', title: 'Fechas y notas' },
  aprobar: { nav: 'Cómo se aprueba', title: 'Cómo se aprueba' },
  rutina: { nav: 'Rutina semanal', title: 'Rutina semanal' },
  glosario: { nav: 'Glosario', title: 'Glosario' },
  ayuda: { nav: 'Dónde preguntar', title: 'Dónde preguntar' },
};

export type SectionId = keyof typeof sections;

export const grading = [
  { value: '35%', label: 'Media de las tareas' },
  { value: '5%', label: 'Media de los cuestionarios' },
  { value: '60%', label: 'Examen presencial de mayo' },
];

export const routine = [
  {
    when: 'Cada día',
    what: 'Abre el Área personal. Mira la campana y la Línea de tiempo en Todos.',
  },
  { when: 'Lunes', what: 'Revisa Próximos eventos y apunta qué vence esta semana y la siguiente.' },
  {
    when: 'Entre semana',
    what: 'Estudia el bloque abierto y haz sus actividades, una asignatura por día.',
  },
  {
    when: '2 días antes del cierre',
    what: 'Entrega. Todo cierra a las 23:59 y la última noche la plataforma va lenta.',
  },
];

export const help = [
  {
    icon: 'book',
    title: 'Dudas del temario',
    text: 'El Fòrum de dubtes de esa asignatura. Mira antes si alguien ya lo ha preguntado.',
  },
  {
    icon: 'message',
    title: 'Algo personal',
    text: 'Mensaje privado al profesor con el bocadillo de arriba a la derecha.',
  },
  {
    icon: 'bell',
    title: 'Matrícula, correo del centro, notas oficiales',
    text: 'La asignatura Tutoría. Ahí también está el manual oficial del campus.',
  },
] as const;

export const glossary: [term: string, meaning: string][] = [
  ['Lliurament', 'Entrega o bloque de contenido'],
  ['Tasca', 'Tarea'],
  ['Qüestionari', 'Cuestionario'],
  ['Venciment', 'Vencimiento, fecha límite'],
  ["s'obre / es tanca", 'Se abre / se cierra'],
  ['Termini', 'Plazo'],
  ['Normes de funcionament', 'Normas de funcionamiento'],
  ["Tauler d'avisos", 'Tablón de anuncios'],
  ['Fòrum de dubtes', 'Foro de dudas'],
  ['Abgabe / Abgabefrist', 'Entrega / plazo de entrega (Alemán)'],
  ['Schreiben', 'Redacción escrita'],
  ['OBLIGATORISCH', 'Obligatorio'],
  ['Abschluss- und Nachprüfung', 'Examen final y recuperación'],
];
