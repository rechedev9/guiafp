export const principles = [
  {
    icon: 'brain',
    title: 'Recuperar, no releer',
    text: 'Intentar recordar algo sin mirarlo lo fija mucho más que volver a leerlo o subrayarlo. Es el efecto de la práctica de recuperación.',
    here: 'Tarjetas, Test y Completar te obligan a sacar la respuesta de la memoria.',
  },
  {
    icon: 'calendar',
    title: 'Repasar espaciado',
    text: 'Repasar poco a poco en días distintos funciona mejor que estudiar todo de golpe la víspera. Lo ideal es repasar justo cuando empiezas a olvidar.',
    here: 'Cada tarjeta vuelve a los 1, 3, 7, 14, 30 y 60 días según cómo la valores.',
  },
  {
    icon: 'shuffle',
    title: 'Mezclar temas',
    text: 'Alternar asignaturas y tipos de pregunta cuesta más en el momento, pero enseña a distinguir cuándo usar cada cosa.',
    here: 'El Repaso mezclado junta las tarjetas de todas las asignaturas.',
  },
  {
    icon: 'message',
    title: 'Explicarlo con tus palabras',
    text: 'Preguntarte por qué y cómo, y explicarlo como si se lo contaras a alguien, conecta lo nuevo con lo que ya sabes.',
    here: 'Cada unidad del Temario acaba con preguntas para contestar en voz alta.',
  },
  {
    icon: 'pencil',
    title: 'Intentar antes de ver',
    text: 'Equivocarse al intentar una respuesta, y corregirlo enseguida, ayuda a recordar mejor la buena.',
    here: 'Escribe tu respuesta antes de girar la tarjeta y repite los fallos al final.',
  },
  {
    icon: 'moon',
    title: 'Sesiones cortas y dormir',
    text: 'Varias sesiones de 20 a 30 minutos rinden más que una maratón, y el sueño consolida lo estudiado.',
    here: 'Mejor un repaso al día que tres horas el domingo.',
  },
] as const;

export const weeklyPlan = [
  { when: 'Cada día, 15 minutos', what: 'Repaso mezclado: solo las tarjetas que tocan hoy.' },
  {
    when: 'Al abrir un bloque nuevo',
    what: 'Lee el Temario de la unidad y contesta sus preguntas en voz alta.',
  },
  { when: '2 o 3 días después', what: 'Test de esa asignatura y repite los fallos.' },
  {
    when: 'Fin de semana',
    what: 'Un juego de Emparejar u Ordenar por asignatura y una ronda de Completar en idiomas.',
  },
];
