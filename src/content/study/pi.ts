import type { Subject } from '@/content/study/types';

export const pi: Subject = {
  slug: 'proyecto',
  code: 'PI',
  title: 'Proyecto intermodular',
  tab: 'Proyecto intermodular',
  lead: 'No hay temario que memorizar ni examen: es un proyecto turístico propio que se construye en cuatro entregas. Aquí está lo que pide cada una, traducido del cronograma y la programación.',
  grading: [
    'Lliurament 1: 20%. Lliurament 2: 20%. Lliurament 3: obligatorio y sin nota. Lliurament 4 (proyecto y vídeo): 60%.',
    'Todas las entregas son obligatorias: si una no se entrega ni en el período adicional, no se puede presentar el final ni aprobar.',
    'Lo entregado en el período adicional tiene nota máxima de 5.',
    'Hay cuatro convocatorias para aprobar el módulo.',
  ],
  units: [
    {
      id: 'proyecto',
      title: 'El proyecto y sus cuatro entregas',
      source: 'Cronograma, programación del módulo e instrucciones del Lliurament 1',
      summary:
        'Un proyecto turístico de base territorial y muy especializado, ligado a guiar, informar o asistir, justificado con datos reales. Dura 50 horas y une lo aprendido en todo el ciclo.',
      sections: [
        {
          title: 'Qué hay que hacer',
          points: [
            'Ejemplos (no obligatorios): una **ruta cultural interpretada**, un **producto ecoturístico**, un **itinerario activo** de senderismo o bici, un **servicio de asistencia en un evento**, congreso o feria, o un **programa de visitas** para un público concreto, como familias con niños.',
            'La elección **no puede ser arbitraria**: hay que justificarla con datos reales de tendencias, visitantes, demanda, recursos del territorio y competencia.',
            'Debe ser **viable, profesional, creativo y aplicable** al sector.',
            'Individual o en grupo pequeño, según indique el profesorado.',
            'Resultado final: proyecto escrito en **PDF**, producto definido, materiales visuales y promocionales propios, **presupuesto**, viabilidad, logística, permisos, protocolos, **plan de contingencias** y un **vídeo resumen de 5 a 7 minutos**.',
          ],
        },
        {
          title: 'Lliurament 1. Borrador inicial (24/11/2026, 20%)',
          points: [
            'Período adicional: 27/11/2026 (nota máxima 5). Extensión orientativa: **5 a 7 páginas**.',
            'Contenido mínimo: 1) portada, 2) introducción y **justificación**, 3) **objetivos** generales y específicos, 4) **misión, visión y valores**, 5) **perfil del visitante** con datos reales, 6) análisis del **territorio, mercado, recursos y competencia**, 7) primera definición del producto (itinerario, actividades, asistencia), 8) ámbito territorial, **agentes** y recursos, 9) reflexión sobre oportunidades y retos.',
            'Es la **base** del resto: el feedback que recibas se aplica en el Lliurament 2.',
          ],
        },
        {
          title: 'Lliurament 2. Desarrollo (25/01/2027, 20%)',
          points: [
            'Período adicional: 28/01/2027. Extensión: **10 a 15 páginas**.',
            'Contenido: revisión del L1 con el feedback, diseño provisional del producto (itinerario, actividades, guion), **estrategia de marketing** (canales, promociones, redes), plan de comunicación (eslogan, mensajes, idiomas), **logotipo** e imagen corporativa propios, muestra de material (folleto, mapa, ficha de ruta, cartel o web), **presupuesto** preliminar, cronograma inicial y reflexión sobre dificultades.',
          ],
        },
        {
          title: 'Lliurament 3. Borrador final (11/03/2027, sin nota)',
          points: [
            'Obligatorio aunque no tenga nota: sirve para recibir el **último feedback**.',
            'Proyecto casi completo con anexos visuales, técnicos y económicos, reflexiones preliminares, revisión de logística, permisos, protocolos y **riesgos**, e **indicadores de calidad** y gestión de incidencias.',
          ],
        },
        {
          title: 'Lliurament 4. Proyecto final y vídeo (19/03/2027, 60%)',
          points: [
            'Período adicional: 22/03/2027. Extensión: **20 a 30 páginas** más anexos (la programación habla de 20 a 25 sin contar portada, índice, anexos ni bibliografía).',
            'Apartados: portada e índice; introducción, justificación y objetivos; análisis; perfil completo del cliente; producto completo; marketing y comercialización; identidad corporativa y materiales; organización y recursos humanos; **presupuesto, precios y viabilidad**; cronograma, logística, permisos y **plan de contingencias**; anexos; **reflexión crítica de dos páginas**; bibliografía; y **vídeo de 5 a 7 minutos**.',
          ],
        },
        {
          title: 'Formato y evaluación',
          points: [
            'PDF paginado con encabezado y pie, **Arial 12**, interlineado sencillo, texto **justificado** y márgenes de **2,5 cm**.',
            'Fuentes citadas con **normas APA** o similares, y bibliografía final.',
            'Todo lo creado con **IA** (texto, imagen o tabla) se indica y se cita. No se acepta un trabajo hecho solo con respuestas de IA.',
            'Se valora: puntualidad, datos reales, coherencia y viabilidad, creatividad de los materiales, autonomía, aplicación del feedback, corrección formal y reflexión crítica.',
            'Lista antes de cada entrega: todos los apartados en orden, decisiones justificadas con fuentes, feedback aplicado, coherencia entre objetivos, actividades, recursos, presupuesto y cronograma, fuentes e IA citadas, ortografía y formato revisados, y **fecha y hora límite** comprobadas.',
          ],
        },
        {
          title: 'Los cuatro resultados de aprendizaje',
          points: [
            '**RA1**: identificar necesidades del sector y proyectos que les respondan. Sobre todo en el L1.',
            '**RA2**: diseñar el proyecto con sus fases, recursos, presupuesto y documentación. Sobre todo en el L2.',
            '**RA3**: planificar la ejecución: actividades, logística, permisos, riesgos y recursos. L2 y L3.',
            '**RA4**: definir el seguimiento y control: indicadores, incidencias, cambios, calidad y participación de los usuarios. L3 y L4.',
          ],
        },
      ],
      selfCheck: [
        [
          '¿Qué pasa si no entregas el Lliurament 3 porque no tiene nota?',
          'No podrás presentar el proyecto final ni aprobar: todas las entregas son obligatorias.',
        ],
        [
          '¿Qué nueve apartados pide el Lliurament 1?',
          'Portada, justificación, objetivos, misión-visión-valores, perfil del visitante, análisis, primera definición del producto, ámbito y agentes, y reflexión.',
        ],
        [
          '¿Cómo debes tratar el contenido hecho con IA?',
          'Indicarlo y citarlo claramente; el trabajo debe ser propio y creativo.',
        ],
      ],
      cards: [
        ['Peso del Lliurament 1', '20%'],
        ['Peso del Lliurament 2', '20%'],
        ['Peso del Lliurament 3', 'Sin nota, pero obligatorio'],
        ['Peso del Lliurament 4', '60% (proyecto final y vídeo)'],
        ['Fecha del Lliurament 1', '24 de noviembre de 2026 (adicional: 27/11)'],
        ['Fecha del Lliurament 2', '25 de enero de 2027 (adicional: 28/01)'],
        ['Fecha del Lliurament 3', '11 de marzo de 2027'],
        ['Fecha del Lliurament 4', '19 de marzo de 2027 (adicional: 22/03)'],
        ['Nota máxima en período adicional', '5'],
        ['Duración del vídeo final', 'De 5 a 7 minutos'],
        ['Extensión del Lliurament 1', 'De 5 a 7 páginas'],
        ['Extensión del Lliurament 2', 'De 10 a 15 páginas'],
        [
          'Formato del texto',
          'PDF, Arial 12, interlineado sencillo, justificado, márgenes de 2,5 cm',
        ],
        ['Normas de citas', 'APA o equivalente'],
        ['Contenido creado con IA', 'Se indica y se cita; no vale un trabajo solo de IA'],
        ['Horas del módulo', '50 horas'],
        ['RA1', 'Identificar necesidades del sector (L1)'],
        ['RA2', 'Diseñar el proyecto: fases, recursos, presupuesto (L2)'],
        ['RA3', 'Planificar la ejecución: logística, permisos, riesgos (L2 y L3)'],
        ['RA4', 'Seguimiento y control: indicadores y calidad (L3 y L4)'],
        ['Plan de contingencias', 'Qué harás si algo falla (lluvia, cancelaciones, accidentes)'],
        ['Reflexión crítica final', 'Dos páginas que explican y valoran tus decisiones'],
      ],
      quiz: [
        {
          q: '¿Cuánto vale el proyecto final con vídeo?',
          right: '60%',
          wrong: ['20%', '40%', '100%'],
          why: 'L1 y L2 valen 20% cada uno; el L3 no tiene nota.',
        },
        {
          q: '¿Qué pasa si una entrega no se presenta ni en el período adicional?',
          right: 'No se puede presentar el final ni aprobar el módulo',
          wrong: [
            'Se pierde solo esa nota',
            'Se recupera en junio con examen',
            'Nada, si el final está bien',
          ],
          why: 'Todas las entregas son obligatorias.',
        },
        {
          q: '¿Qué nota máxima tiene lo entregado en el período adicional?',
          right: '5',
          wrong: ['10', '7', '0'],
          why: 'Se puede recuperar mejorando la entrega, con un máximo de 5.',
        },
        {
          q: '¿Cuánto dura el vídeo resumen?',
          right: 'De 5 a 7 minutos',
          wrong: ['Hasta 2 minutos', 'De 15 a 20 minutos', 'No hay vídeo'],
          why: 'Va con el Lliurament 4.',
        },
        {
          q: '¿Qué apartado NO pide el Lliurament 1?',
          right: 'El vídeo resumen',
          wrong: [
            'Misión, visión y valores',
            'Perfil del visitante con datos reales',
            'Análisis de la competencia',
          ],
          why: 'El vídeo es del Lliurament 4.',
        },
        {
          q: '¿Cómo se justifica la especialización del proyecto?',
          right: 'Con datos reales de mercado, visitantes y recursos',
          wrong: [
            'Con tus gustos personales',
            'No hace falta justificarla',
            'Con la opinión de la familia',
          ],
          why: 'La elección no puede ser arbitraria.',
        },
      ],
      sequences: [
        {
          title: 'Las cuatro entregas',
          instruction: 'Ordena las entregas por fecha.',
          items: [
            ['Borrador inicial (20%)', '24/11/2026'],
            ['Desarrollo del proyecto (20%)', '25/01/2027'],
            ['Borrador final (sin nota)', '11/03/2027'],
            ['Proyecto final y vídeo (60%)', '19/03/2027'],
          ],
        },
        {
          title: 'Apartados del Lliurament 1',
          instruction: 'Ordena los apartados como pide el guion.',
          items: [
            ['Portada', 'Título, autoría y fecha'],
            ['Introducción y justificación', 'Por qué este proyecto'],
            ['Objetivos', 'Generales y específicos'],
            ['Misión, visión y valores', ''],
            ['Perfil del visitante', 'Con datos reales'],
            ['Análisis inicial', 'Territorio, mercado, recursos y competencia'],
            ['Primera definición del producto', 'Itinerario, actividades y asistencia'],
            ['Ámbito, agentes y recursos', ''],
            ['Reflexión', 'Oportunidades y retos'],
          ],
        },
      ],
    },
  ],
};
