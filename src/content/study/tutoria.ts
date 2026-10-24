import type { Deadline, Subject } from '@/content/study/types';

// From each course's calendar; the penalty window adds 3 days.
const deadlines: Deadline[] = [
  { date: '2026-11-05', course: 'IPO-2', what: 'Aceptación de normas' },
  { date: '2026-11-10', course: 'IPO-2', what: 'Lliurament 1 (UT01)' },
  { date: '2026-11-10', course: 'HCIB', what: 'Lliurament 1: Tarea 1 y Examen 1' },
  { date: '2026-11-10', course: 'SLEA-1', what: 'Abgabe 1' },
  { date: '2026-11-10', course: 'SLEA-2', what: 'Abgabe 1' },
  { date: '2026-11-24', course: 'PI', what: 'Lliurament 1: borrador inicial' },
  { date: '2026-12-01', course: 'SLEA-2', what: 'Abgabe 2' },
  { date: '2026-12-09', course: 'IPO-2', what: 'Lliurament 2 (UT02 y UT03)' },
  { date: '2026-12-15', course: 'SLEA-1', what: 'Abgabe 2' },
  { date: '2027-01-12', course: 'SLEA-2', what: 'Abgabe 3' },
  { date: '2027-01-19', course: 'IPO-2', what: 'Lliurament 3 (UT04)' },
  { date: '2027-01-25', course: 'PI', what: 'Lliurament 2: desarrollo' },
  { date: '2027-01-26', course: 'SLEA-1', what: 'Abgabe 3' },
  { date: '2027-02-09', course: 'SLEA-2', what: 'Abgabe 4' },
  { date: '2027-02-23', course: 'SLEA-1', what: 'Abgabe 4' },
  { date: '2027-03-09', course: 'SLEA-2', what: 'Abgabe 5' },
  { date: '2027-03-11', course: 'PI', what: 'Lliurament 3: borrador final' },
  { date: '2027-03-16', course: 'SLEA-1', what: 'Abgabe 5' },
  { date: '2027-03-19', course: 'IPO-2', what: 'Lliurament 4 (UT05)' },
  { date: '2027-03-19', course: 'PI', what: 'Lliurament 4: proyecto final y vídeo' },
  { date: '2027-04-06', course: 'SLEA-2', what: 'Abgabe 6' },
];

const venues = [
  ['Mallorca', 'CIFP Juníper Serra'],
  ['Menorca', 'CIFP Ciutadella'],
  ['Eivissa', 'IES Isidor Macabich'],
  ['Formentera', 'IES Marc Ferrer'],
] as const;

export const tutoria: Subject = {
  slug: 'tutoria',
  code: 'TUT',
  title: 'Tutoría',
  tab: 'Tutoría',
  calendar: { deadlines, venues },
  lead: 'No tiene temario: es el tablón del ciclo. Aquí tienes el calendario de exámenes presenciales de tus asignaturas, todas las fechas de entrega del curso y las normas que conviene saberse de memoria.',
  grading: [
    'No se evalúa. Contiene la normativa, el manual del campus y el calendario oficial de exámenes.',
  ],
  units: [
    {
      id: 'normas',
      title: 'Normas que conviene saberse',
      source: 'Normes de funcionament de cada asignatura y calendario de exámenes',
      summary:
        'Lo que más se olvida: cuánto vale el examen, qué pasa si entregas tarde y cuándo son los exámenes de mayo y junio.',
      sections: [
        {
          title: 'Exámenes presenciales',
          points: [
            'Primera convocatoria en **mayo de 2027** y segunda en **junio**, en dos turnos: de **15:20 a 17:10** y de **18:05 a 20:00**.',
            'Alemán I y Alemán II van el **mismo día** (martes), uno en cada turno.',
            'El examen vale el **60%** de la nota en IPO-2, Alemán I y Alemán II.',
            'Proyecto intermodular **no tiene examen**: se aprueba con las cuatro entregas.',
            'La segunda convocatoria es para quien no aprueba la primera o no pudo ir por un motivo justificado.',
          ],
        },
        {
          title: 'Entregas',
          points: [
            'Todo cierra a las **23:59** del día indicado.',
            'Casi todas las asignaturas dan **3 días más con penalización**.',
            'En Alemán las tareas y audios fuera de plazo **no se recuperan**.',
            'Las tareas no se corrigen hasta que cierra el plazo.',
          ],
        },
      ],
      videos: [
        {
          id: 'ROMAST_QNbM',
          title: "Com funciona l'aula de tutoria?",
          channel: 'IEDIB',
          lang: 'ca',
          note: 'Vídeo oficial del IEDIB: dónde están los calendarios y los horarios de exámenes.',
        },
        {
          id: 'Cn3exi9LZ9U',
          title: 'Com funciona una aula de matèria',
          channel: 'IEDIB',
          lang: 'ca',
          note: 'Vídeo oficial del IEDIB: cómo es el aula de cada asignatura y dónde se hacen las entregas.',
        },
        {
          id: 'QD-zwXc3dtQ',
          title: 'Cómo aplicar el Active Recall? La mejor técnica de estudio, según la ciencia',
          channel: 'Adrià Solà Pastor',
          lang: 'es',
          note: 'La práctica de recuperación, la técnica en la que se basan las Tarjetas y el Test.',
        },
        {
          id: 'fp_YbxuJJkQ',
          title:
            'Cómo aplicar la Repetición Espaciada? La mejor forma de estudiar, según la ciencia',
          channel: 'Adrià Solà Pastor',
          lang: 'es',
          note: 'Cómo repartir el repaso hasta los exámenes presenciales de mayo.',
        },
      ],
      selfCheck: [
        [
          '¿Qué dos exámenes caen el mismo día?',
          'Alemán I (15:20) y Alemán II (18:05), el martes 11 de mayo.',
        ],
        [
          '¿Qué necesitas para presentarte al examen de mayo en Alemán?',
          'Una media de 5 o más en tareas y audios.',
        ],
      ],
      cards: [
        ['Examen de Alemán I (1.ª convocatoria)', 'Martes 11 de mayo de 2027, 15:20 a 17:10'],
        ['Examen de Alemán II (1.ª convocatoria)', 'Martes 11 de mayo de 2027, 18:05 a 20:00'],
        ['Examen de IPO-2 (1.ª convocatoria)', 'Jueves 13 de mayo de 2027, 18:05 a 20:00'],
        ['Examen de Inglés II (1.ª convocatoria)', 'Viernes 14 de mayo de 2027, 18:05 a 20:00'],
        ['Examen de Historia (1.ª convocatoria)', 'Jueves 20 de mayo de 2027, 18:05 a 20:00'],
        [
          'Segunda convocatoria',
          'Junio de 2027: Alemán 8/06, IPO-2 10/06, Inglés 11/06, Historia 16/06',
        ],
        ['Sede de examen en Mallorca', 'CIFP Juníper Serra'],
        ['Peso del examen en Alemán e IPO-2', '60%'],
        ['¿Tiene examen el Proyecto intermodular?', 'No: se aprueba con las cuatro entregas'],
        ['Hora de cierre de las entregas', '23:59 del día indicado'],
        ['Margen con penalización', '3 días después del plazo'],
        ['Requisito para el examen de Alemán', 'Media de tareas y audios de 5 o más'],
        ['¿Hay examen oral en Alemán?', 'No: por eso cuentan tanto los audios'],
        [
          'Partes del examen de Alemán',
          'Gramática y vocabulario, comprensión lectora, comprensión auditiva y redacción',
        ],
        ['Partes del examen de Inglés', 'Listening, Vocabulary & Grammar, Reading y Writing'],
      ],
      quiz: [
        {
          q: '¿Qué día es el examen de Alemán II en mayo?',
          right: 'Martes 11, de 18:05 a 20:00',
          wrong: [
            'Jueves 13, de 15:20 a 17:10',
            'Viernes 14, de 18:05 a 20:00',
            'Jueves 20, de 18:05 a 20:00',
          ],
          why: 'Alemán I va el mismo martes a las 15:20.',
        },
        {
          q: '¿Qué asignatura no tiene examen presencial?',
          right: 'Proyecto intermodular',
          wrong: ['IPO-2', 'Historia', 'Inglés II'],
          why: 'Se evalúa con cuatro entregas y un vídeo.',
        },
        {
          q: '¿A qué hora cierran las entregas online?',
          right: 'A las 23:59',
          wrong: ['A las 20:00', 'A las 12:00', 'A medianoche del día siguiente'],
          why: 'La última noche la plataforma va lenta: mejor entregar antes.',
        },
      ],
    },
  ],
};
