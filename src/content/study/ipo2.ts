import type { Subject } from '@/content/study/types';

export const ipo2: Subject = {
  slug: 'ipo-2',
  code: 'IPO-2',
  title: 'Itinerario personal para la ocupabilidad II',
  tab: 'IPO-2',
  lead: 'Cómo buscar trabajo, superar un proceso de selección y presentarte como profesional. Material traducido del libro UT01 del campus.',
  grading: [
    '35% media de las tareas y 5% media de los cuestionarios.',
    '60% examen presencial final.',
    'En los cuestionarios tipo test cada error resta un 33% de la pregunta.',
    'Entregas: L1 (UT01) 10/11, L2 (UT02 y UT03) 9/12, L3 (UT04) 19/01, L4 (UT05) 19/03. Con penalización, 3 días después.',
  ],
  exam: {
    first: '2027-05-13T18:05+02:00',
    second: '2027-06-10T18:05+02:00',
    parts: ['Preguntas sobre las cinco unidades del curso'],
  },
  units: [
    {
      id: 'ut01',
      title: 'UT01. El proceso de búsqueda de empleo',
      source: 'Libro "UT01 Els procés de recerca d\'ocupació" (Lliurament 01)',
      summary:
        'Dónde están las ofertas (mercado visible y oculto), cómo funciona un proceso de selección, cómo hacer el CV, la carta y el correo, cómo preparar la entrevista, el acceso al sector público y la marca personal.',
      sections: [
        {
          title: '1. El mercado de trabajo: visible y oculto',
          points: [
            'El **mercado visible** son las ofertas publicadas en canales abiertos, sobre todo portales de empleo.',
            '**Portales generalistas**: sirven para cualquier perfil. InfoJobs es el portal privado con más contratación en España; Indeed es un buscador que reúne ofertas de otras webs; LinkedIn también publica ofertas.',
            '**Portales específicos**: de un sector concreto. En hostelería y turismo destacan Turijobs y Hosteleo.',
            'El **mercado oculto** son las vacantes que nunca se publican: alrededor del 80% (el libro también da la cifra de más del 75%).',
            'Se accede al mercado oculto por cuatro vías: **red de contactos** (networking), **autocandidatura**, **bolsas de empleo** de centros de formación o colegios profesionales, y **headhunting** a través de la marca personal en LinkedIn.',
            'Las empresas prefieren el mercado oculto por tres motivos: **ahorran tiempo**, **reducen el riesgo** (candidatos recomendados, de confianza) y mantienen la **confidencialidad** frente a la competencia.',
          ],
        },
        {
          title: '1.1 El proceso de selección y el currículum',
          points: [
            'Las seis fases de un proceso de selección: 1) **detectar la necesidad**, 2) **definir el perfil**, 3) **publicar la oferta**, 4) **criba de candidaturas** (filtros ATS), 5) **entrevistas y pruebas**, 6) **elección y contratación**.',
            'Un **ATS** (Applicant Tracking System) es un programa que filtra currículums buscando palabras clave ligadas a los requisitos de la oferta.',
            'Un seleccionador dedica de media **30 segundos** a mirar un CV: claro, atractivo, mejor en **una página** y **adaptado a cada oferta**.',
            '**CV cronológico**: ordena la experiencia en el tiempo; el recomendado es el **cronológico inverso** (lo más reciente primero). Ideal con trayectoria estable.',
            '**CV funcional**: ordena por áreas de competencia, no por fechas. Útil si cambias de sector, tienes periodos sin trabajo o poca experiencia.',
            '**CV combinado o mixto**: empieza por habilidades y termina con un resumen cronológico. El más completo y flexible.',
            '**CV creativo**: diseño gráfico rompedor, propio de diseño, marketing o publicidad. Cuidado: muchos ATS no lo leen bien.',
            '**CV Europass**: plantilla oficial de la UE, usada en instituciones públicas y procesos internacionales. Ordenado, pero impersonal y largo.',
            '**Videocurrículum**: vídeo de 1 a 2 minutos que complementa el CV. Muy útil en atención al público, ventas o comunicación.',
            'Apartados del CV: datos de contacto, **perfil personal** (3 o 4 líneas), experiencia (cronológica inversa; las prácticas FEMPO cuentan), formación académica, formación complementaria, idiomas, informática, habilidades (**hard skills** técnicas y **soft skills** personales) y otros datos (carné de conducir, disponibilidad).',
            'Reglas: nunca dejes apartados vacíos (quítalos), **cero faltas de ortografía**, frases cortas con verbos de acción, y plantillas limpias que un ATS pueda leer (Canva, Novoresume, Microsoft Create, Google Drive, Doyoubuzz, Europass).',
          ],
        },
        {
          title: '1.2 Carta de presentación y correo electrónico',
          points: [
            'El CV dice **qué** sabes hacer; la carta y el correo dicen **por qué** quieres trabajar en **esa** empresa.',
            'La **carta de presentación** se usa al entregar el CV en mano o cuando la oferta la pide. Estructura: **encabezado**, **introducción** (motivo), **cuerpo** (qué aportas) y **cierre** (pedir una entrevista).',
            'Consejos: dirígela a una **persona concreta** (evita "A quien corresponda"), **no repitas el CV** y no pases de **una página** (3 o 4 párrafos).',
            'Regla clave: **si envías el CV por correo, el texto del correo sustituye a la carta**. No adjuntes una carta aparte: escribe la motivación en el cuerpo y adjunta solo el CV en PDF.',
          ],
        },
        {
          title: '1.3 La entrevista de trabajo',
          points: [
            'Es una conversación profesional en dos direcciones: se evalúa tu encaje técnico y tus competencias personales.',
            'Cuatro fases: 1) **acogida** y presentación, 2) **exploración del perfil** (el núcleo, con preguntas de comportamiento), 3) **información del puesto**, 4) **cierre y dudas** del candidato.',
            'Tipos: **individual**, **dinámica de grupo** (assessment center: casos prácticos en grupo) y **por competencias** (demostrar con hechos del pasado cómo resolviste algo).',
            'Preparación en tres ejes: **investiga la empresa**, **domina tu propio CV** y cuida la **logística** (llegar unos 10 minutos antes, nunca más de un cuarto de hora; en videollamada, luz, micro, conexión y fondo neutro).',
            'Primera impresión en 30 segundos: saludo con contacto visual y apretón breve y firme, ropa limpia y coherente con la empresa, higiene cuidada y sin perfume fuerte, **nada de chicle**, controlar tics y **móvil apagado** y fuera de la vista.',
            '**Método STAR** para preguntas sobre experiencias: **S**ituación, **T**area, **A**cción y **R**esultado.',
            'Comunicación: lenguaje positivo (nunca hables mal de jefes anteriores), respuestas claras ni monosílabas ni eternas; contacto visual, postura recta e inclinada hacia delante, sin cruzar los brazos.',
            '**No se miente** en una entrevista: si te pillan, quedas descartado. Sí puedes gestionar la información: no extenderte en fracasos si no te preguntan y, si preguntan, responder con honestidad y lo que aprendiste.',
            'Las preguntas sobre hijos, estado civil, orientación sexual, política, religión o edad son **ilegales y discriminatorias**. Tres salidas educadas: **reconducir** a lo profesional, **preguntar qué relación tiene** con el puesto o **negarte** a responder con cortesía.',
            'Al final: haz **preguntas inteligentes** (retos del equipo, un día normal, plazos del proceso) y envía un **correo de agradecimiento** unas 24 horas después.',
          ],
        },
        {
          title: '2. El mercado oculto: contactos, LinkedIn y autocandidatura',
          points: [
            'La red de contactos te da acceso a vacantes antes de que se publiquen, reduce el riesgo para la empresa, te mantiene informada del sector y permite intercambiar conocimiento.',
            'Cinco estrategias de networking: 1) **mapea tus contactos calientes** (profesorado, tutores de prácticas, compañeros, familia), 2) **reciprocidad** (ayuda antes de pedir), 3) **ve a eventos** del sector, 4) prepara tu **elevator pitch** (menos de un minuto: quién eres, tu especialidad y qué buscas), 5) **mantén el contacto** sin presionar.',
            'Dos canales: el **digital** (LinkedIn) y el **presencial** (gremios, asociaciones, ferias), clave en zonas pequeñas.',
            '**LinkedIn** no es un almacén de currículums ni una red de ocio: es tu **escaparate profesional 24 horas**, sirve para investigar empresas y para publicar contenido de valor.',
            'Perfil de LinkedIn desde cero: foto profesional con fondo neutro, **titular** que diga tu campo y tu valor, extracto "Acerca de", y **palabras clave** y competencias para salir en las búsquedas.',
            '**Autocandidatura**: contactar por iniciativa propia con empresas elegidas, haya o no proceso abierto.',
            'Diferencia: la **carta de presentación** responde a una oferta concreta; la **autocandidatura** es una estrategia proactiva para el mercado oculto, con una carta más amplia y motivacional.',
            'Para que funcione: **investiga** y elige empresas y responsables, **personaliza** cada mensaje (nada de envíos masivos), céntrate en **lo que aportas** y haz un **seguimiento** a las dos semanas.',
            'El networking da frutos con **paciencia**: el objetivo es que, cuando surja una vacante, tu nombre sea el primero que les venga a la cabeza.',
          ],
        },
        {
          title: '3. El sector público',
          points: [
            'Se accede por los principios de **igualdad, mérito y capacidad**.',
            'Grupos según la titulación: **A1 y A2** grado universitario; **B** Técnico Superior (FP de grado superior, el de este ciclo); **C1** Bachillerato o Técnico (FP grado medio); **C2** ESO.',
            '**Funcionario de carrera**: plaza fija, relación regulada por el Derecho Administrativo.',
            '**Funcionario interino**: ocupa una plaza de forma temporal por urgencia o necesidad (sustituciones, acumulación de tareas).',
            '**Personal laboral**: contrato regulado por el Derecho Laboral y el Estatuto de los Trabajadores (fijo, indefinido o temporal).',
            '**Personal eventual**: funciones de confianza o asesoramiento especial; cesa cuando cesa quien lo nombró.',
            'Sistemas de selección: **oposición** (solo pruebas), **concurso-oposición** (pruebas y después méritos) y **concurso** (solo méritos, excepcional).',
            'Requisitos habituales: nacionalidad española o de la UE, tener 16 años y no superar la edad de jubilación, la titulación exigida, capacidad funcional, no estar inhabilitado y, en Baleares, acreditar el **nivel de catalán**.',
            'Si apruebas algún examen sin conseguir plaza, sueles entrar en una **bolsa de trabajo**: la vía más común para empezar en lo público.',
          ],
        },
        {
          title: '4. La marca personal',
          points: [
            'La **marca personal** es la huella que dejas en los demás: tus competencias técnicas, tus soft skills y cómo te relacionas. No es un personaje inventado.',
            'Frase atribuida a Jeff Bezos: la marca personal es lo que dicen de ti cuando no estás en la sala.',
            'Tres pilares: **misión** (qué haces, a quién ayudas y qué problema resuelves hoy), **visión** (adónde quieres llegar a largo plazo) y **valores** (principios no negociables).',
            '**Identidad digital**: todo lo que hay sobre ti en internet; se crea sola y no la controlas del todo. **Marca personal**: la gestión intencionada de esa identidad para diferenciarte y conseguir oportunidades.',
            'Por qué importa: te **diferencia**, genera **confianza**, **atrae oportunidades** y te da **control** de tu huella digital.',
            'Cuatro fases para diseñarla: 1) **autoconocimiento**, 2) **definir la visión**, 3) **público objetivo** (qué empresas te necesitan y dónde están), 4) **comunicación** (LinkedIn, portafolio, contenido).',
            'La **ley de la coherencia**: misión, visión y valores deben verse igual en todo lo que haces.',
          ],
        },
      ],
      videos: [
        {
          id: 'toYqGCBi1gM',
          title: 'Masterclass: Elabora un CV de alto impacto | OBS Business School',
          channel: 'OBS Business School',
          lang: 'es',
          note: 'Tipos de CV, cómo funcionan los filtros ATS y cómo usar palabras clave.',
        },
        {
          id: '0Y1WzHGVBVs',
          title:
            'Cómo preparar y hacer bien una entrevista de trabajo | Cómo responder | Preguntas habituales, etc',
          channel: 'Humanos como recurso',
          lang: 'es',
          note: 'Una profesional de RRHH explica cómo preparar la entrevista, sus fases y las preguntas habituales.',
        },
        {
          id: 'oAUUFkzNfYo',
          title: 'El método STAR explicado por una ex-trabajadora de Amazon',
          channel: 'Andrea Pilan',
          lang: 'es',
          note: 'El método STAR (Situación, Tarea, Acción, Resultado) con ejemplos de respuestas.',
        },
        {
          id: 'bLZF3UsEwjI',
          title: 'Qué es el MERCADO LABORAL OCULTO y como acceder para conseguir trabajo',
          channel: 'Fernando Segarra',
          lang: 'es',
          note: 'Por qué la mayoría de vacantes no se publica y cómo llegar a ellas con contactos y autocandidatura.',
        },
        {
          id: 'O542nvq-FQI',
          title: 'La Marca Personal',
          channel: 'Multicanal de Orientación para el Empleo Cruz Roja',
          lang: 'es',
          note: 'Qué es la marca personal y por qué tus competencias te diferencian al buscar empleo.',
        },
      ],
      selfCheck: [
        [
          '¿Qué diferencia hay entre InfoJobs e Indeed?',
          'InfoJobs es un portal donde las empresas publican sus ofertas; Indeed es un buscador que recopila ofertas publicadas en otras webs.',
        ],
        [
          '¿Por qué la autocandidatura es del mercado oculto?',
          'Porque llegas a la empresa antes de que exista una oferta publicada: tu CV queda en su base de datos para cuando surja la necesidad.',
        ],
        [
          '¿Para qué sirve un ATS?',
          'Filtra de forma automática los CV buscando palabras clave de la oferta, antes de que los lea una persona.',
        ],
        [
          'Envías tu CV por correo. ¿Adjuntas también una carta de presentación?',
          'No. El cuerpo del correo hace de carta: ahí explicas tu motivación y adjuntas solo el CV en PDF.',
        ],
        [
          '¿Qué haces cuando el entrevistador pregunta "¿Tienes alguna duda?"',
          'Aprovecharlo con preguntas inteligentes: retos del equipo, cómo es un día normal o los plazos del proceso.',
        ],
        [
          '¿Qué titulación pide el grupo B de la función pública?',
          'El título de Técnico Superior (FP de grado superior).',
        ],
        [
          'Explica la diferencia entre misión y visión con tu propio ejemplo.',
          'Misión es lo que haces hoy y para quién; visión es dónde quieres estar dentro de unos años.',
        ],
      ],
      cards: [
        [
          'Mercado laboral visible',
          'Las ofertas que se publican en canales abiertos, sobre todo portales de empleo.',
        ],
        [
          'Mercado laboral oculto',
          'Las vacantes que nunca se publican, alrededor del 80%. Se llega por contactos, autocandidatura, bolsas y headhunting.',
        ],
        [
          '¿Qué porcentaje de vacantes no se publica nunca?',
          'Alrededor del 80% (el mercado oculto).',
        ],
        [
          'Portal generalista',
          'Portal para cualquier perfil y sector: InfoJobs, Indeed, LinkedIn.',
        ],
        ['Portal específico de turismo y hostelería', 'Turijobs u Hosteleo.'],
        ['InfoJobs', 'El portal privado con más contratación en España.'],
        ['Indeed', 'Buscador que rastrea y reúne ofertas de otras webs.'],
        [
          'Tres ventajas del mercado oculto para la empresa',
          'Ahorro de tiempo, menos riesgo (candidatos de confianza) y confidencialidad.',
        ],
        [
          'Las 6 fases de un proceso de selección',
          'Necesidad, definir perfil, publicar, criba (ATS), entrevistas y pruebas, contratación.',
        ],
        ['ATS', 'Applicant Tracking System: programa que filtra CV por palabras clave.'],
        ['Tiempo medio que un seleccionador mira un CV', 'Unos 30 segundos.'],
        [
          'CV cronológico inverso',
          'Experiencia ordenada de la más reciente a la más antigua. Es el más recomendado.',
        ],
        [
          'CV funcional',
          'Ordenado por competencias, no por fechas. Para cambios de sector, paro largo o poca experiencia.',
        ],
        [
          'CV mixto o combinado',
          'Primero habilidades, después un resumen cronológico. El más completo y flexible.',
        ],
        [
          'CV creativo',
          'Diseño gráfico propio de diseño o marketing. Riesgo: los ATS lo leen mal.',
        ],
        ['Europass', 'Modelo de CV oficial de la UE: ordenado pero impersonal y largo.'],
        [
          'Videocurrículum',
          'Vídeo de 1 a 2 minutos que complementa el CV; útil en atención al público.',
        ],
        [
          'Perfil personal del CV',
          'Resumen de 3 o 4 líneas: quién eres, formación, competencias y objetivo.',
        ],
        ['Hard skills', 'Habilidades técnicas del sector.'],
        [
          'Soft skills',
          'Competencias personales y sociales: iniciativa, trabajo en equipo, comunicación.',
        ],
        [
          '¿Qué haces con un apartado del CV que no puedes rellenar?',
          'Quitarlo y poner otro que aporte valor. Nunca dejarlo vacío.',
        ],
        [
          'Estructura de la carta de presentación',
          'Encabezado, introducción, cuerpo (qué aportas) y cierre (pedir entrevista).',
        ],
        ['Extensión máxima de la carta de presentación', 'Una página: 3 o 4 párrafos.'],
        [
          'CV enviado por correo',
          'El cuerpo del correo sustituye a la carta. Solo se adjunta el CV en PDF.',
        ],
        [
          'Las 4 fases de la entrevista',
          'Acogida, exploración del perfil, información del puesto, cierre y dudas.',
        ],
        [
          'Assessment center',
          'Dinámica de grupo: varios candidatos resuelven un caso mientras los evalúan.',
        ],
        [
          'Entrevista por competencias',
          'Te piden hechos del pasado que demuestren cómo resolviste situaciones.',
        ],
        ['Método STAR', 'Situación, Tarea, Acción, Resultado.'],
        [
          '¿Con cuánta antelación llegar a una entrevista presencial?',
          'Unos 10 minutos; nunca más de un cuarto de hora.',
        ],
        [
          'Tres formas de responder a una pregunta ilegal',
          'Reconducir a lo profesional, preguntar qué relación tiene con el puesto o negarse con educación.',
        ],
        ['¿Cuándo enviar el correo de agradecimiento?', 'Unas 24 horas después de la entrevista.'],
        [
          'Elevator pitch',
          'Presentación de menos de un minuto: quién eres, tu especialidad y qué buscas.',
        ],
        [
          'Principio de reciprocidad (networking)',
          'Pensar cómo ayudar al otro antes de pedirle nada.',
        ],
        [
          'Contactos calientes',
          'Profesorado, tutores de prácticas, compañeros, familia y excompañeros.',
        ],
        [
          'Autocandidatura',
          'Contactar por iniciativa propia con empresas elegidas, haya o no oferta.',
        ],
        [
          '¿Cuándo hacer seguimiento de una autocandidatura?',
          'A las dos semanas, con una llamada o un mensaje breve.',
        ],
        ['Grupo A1/A2 de la función pública', 'Título universitario de grado.'],
        ['Grupo B', 'Técnico Superior (FP de grado superior).'],
        ['Grupo C1', 'Bachillerato o Técnico (FP de grado medio).'],
        ['Grupo C2', 'Graduado en ESO.'],
        ['Funcionario de carrera', 'Plaza fija y permanente; relación de Derecho Administrativo.'],
        ['Funcionario interino', 'Ocupa una plaza de forma temporal por urgencia o sustitución.'],
        ['Personal laboral', 'Contrato del Derecho Laboral y el Estatuto de los Trabajadores.'],
        ['Personal eventual', 'Puestos de confianza o asesoramiento; cesa con quien lo nombró.'],
        ['Oposición', 'Selección solo con pruebas o exámenes.'],
        ['Concurso-oposición', 'Primero pruebas y después se valoran méritos.'],
        ['Concurso', 'Solo se valoran méritos, sin exámenes. Es excepcional.'],
        [
          'Bolsa de trabajo',
          'Lista de quienes aprobaron algo sin plaza; la vía más común para entrar en lo público.',
        ],
        ['Marca personal', 'La huella o reputación que dejas: lo que dicen de ti cuando no estás.'],
        ['Misión (marca personal)', 'Qué haces, a quién ayudas y qué problema resuelves hoy.'],
        ['Visión (marca personal)', 'Adónde quieres llegar a largo plazo.'],
        ['Valores (marca personal)', 'Principios éticos y profesionales no negociables.'],
        ['Identidad digital', 'Todo lo que hay sobre ti en internet; se crea sola.'],
        [
          'Las 4 fases de la marca personal',
          'Autoconocimiento, visión, público objetivo, comunicación.',
        ],
        [
          'Ley de la coherencia',
          'Misión, visión y valores se reflejan igual en todo lo que haces.',
        ],
      ],
      quiz: [
        {
          q: '¿Qué porcentaje aproximado de vacantes pertenece al mercado oculto?',
          right: 'Alrededor del 80%',
          wrong: ['Alrededor del 20%', 'La mitad', 'Menos del 10%'],
          why: 'La mayoría de vacantes nunca se publica; por eso hay que moverse con contactos y autocandidaturas.',
        },
        {
          q: '¿Cuál es un portal específico del sector turístico?',
          right: 'Turijobs',
          wrong: ['Indeed', 'InfoJobs', 'Europass'],
          why: 'Turijobs y Hosteleo son portales de nicho para hostelería y turismo.',
        },
        {
          q: 'Una persona que vuelve a trabajar tras un paro largo y quiere cambiar de sector. ¿Qué CV le conviene?',
          right: 'Funcional',
          wrong: ['Cronológico', 'Europass', 'Creativo'],
          why: 'El funcional pone el foco en lo que sabes hacer, no en las fechas.',
        },
        {
          q: '¿Qué orden se recomienda para la experiencia y la formación del CV?',
          right: 'Cronológico inverso: lo más reciente primero',
          wrong: [
            'Alfabético',
            'De lo más antiguo a lo más reciente',
            'Por importancia del puesto',
          ],
          why: 'El seleccionador quiere ver primero lo más actual.',
        },
        {
          q: '¿Por qué puede ser arriesgado un CV creativo?',
          right: 'Muchos filtros ATS no saben leerlo',
          wrong: [
            'Está prohibido en España',
            'Ocupa siempre más de tres páginas',
            'No admite foto',
          ],
          why: 'El diseño gráfico complica la lectura automática de palabras clave.',
        },
        {
          q: 'Envías tu candidatura por correo electrónico. ¿Qué haces con la carta de presentación?',
          right: 'El texto del correo hace de carta y solo adjuntas el CV',
          wrong: [
            'Adjuntas la carta y el CV en dos PDF',
            'No escribes nada en el cuerpo',
            'Pegas el CV entero en el correo',
          ],
          why: 'Regla del libro: si el CV va por correo, el correo sustituye a la carta.',
        },
        {
          q: 'En una entrevista por competencias te piden un caso complicado del pasado. ¿Qué estructura usas?',
          right: 'STAR: situación, tarea, acción y resultado',
          wrong: ['DAFO', 'AIDA', 'SMART'],
          why: 'STAR ordena la respuesta y muestra el resultado de tu acción.',
        },
        {
          q: '¿Cuándo conviene llegar a una entrevista presencial?',
          right: 'Unos 10 minutos antes',
          wrong: ['Media hora antes', 'Justo a la hora', 'Una hora antes para ver el ambiente'],
          why: 'Más de un cuarto de hora antes puede molestar.',
        },
        {
          q: 'Te preguntan si piensas tener hijos pronto. ¿Qué opción NO es adecuada?',
          right: 'Inventarte una respuesta para quedar bien',
          wrong: [
            'Reconducir hacia tu compromiso profesional',
            'Preguntar qué relación tiene con el puesto',
            'Negarte a responder con educación',
          ],
          why: 'La pregunta es ilegal; hay tres salidas educadas, pero mentir nunca es una opción.',
        },
        {
          q: '¿Cuándo se envía el correo de agradecimiento tras una entrevista?',
          right: 'Unas 24 horas después',
          wrong: ['Una semana después', 'Antes de la entrevista', 'Solo si te contratan'],
          why: 'Recuerda tu interés mientras la entrevista está reciente.',
        },
        {
          q: '¿Qué diferencia la autocandidatura de la carta de presentación?',
          right: 'La autocandidatura es una estrategia proactiva sin oferta publicada',
          wrong: [
            'La autocandidatura se entrega siempre en mano',
            'La carta solo sirve para el sector público',
            'Son lo mismo',
          ],
          why: 'La carta responde a una oferta concreta; la autocandidatura busca el mercado oculto.',
        },
        {
          q: '¿Qué título exige el grupo B de la función pública?',
          right: 'Técnico Superior de FP',
          wrong: ['Grado universitario', 'ESO', 'Bachillerato'],
          why: 'B corresponde a la FP de grado superior, como este ciclo.',
        },
        {
          q: 'Una persona cubre una baja en la Administración de forma temporal. ¿Qué es?',
          right: 'Funcionaria interina',
          wrong: ['Funcionaria de carrera', 'Personal eventual', 'Personal de confianza política'],
          why: 'El interino ocupa plazas de forma transitoria por urgencia o sustitución.',
        },
        {
          q: '¿Qué sistema de selección valora solo méritos, sin exámenes?',
          right: 'Concurso',
          wrong: ['Oposición', 'Concurso-oposición', 'Bolsa de trabajo'],
          why: 'El concurso es excepcional y se basa en un baremo de méritos.',
        },
        {
          q: '¿Qué pilar de la marca personal describe adónde quieres llegar a largo plazo?',
          right: 'La visión',
          wrong: ['La misión', 'Los valores', 'La identidad digital'],
          why: 'La misión es el presente; la visión, el futuro.',
        },
        {
          q: '¿Cuál es la diferencia entre identidad digital y marca personal?',
          right: 'La identidad digital existe sola; la marca personal es su gestión intencionada',
          wrong: [
            'Son sinónimos',
            'La marca personal solo existe en LinkedIn',
            'La identidad digital la controlas al 100%',
          ],
          why: 'Todos tenemos identidad digital; la marca personal es el trabajo estratégico sobre ella.',
        },
      ],
      sequences: [
        {
          title: 'Fases de un proceso de selección',
          instruction: 'Ordena las fases de la primera a la última.',
          items: [
            ['Identificar la necesidad', 'Vacante o exceso de trabajo'],
            ['Definir el perfil', 'Tareas, horario, salario y requisitos'],
            ['Publicar la oferta', 'Portales, redes, canales propios'],
            ['Criba de candidaturas', 'Filtros ATS por palabras clave'],
            ['Entrevistas y pruebas', 'Contacto inicial, entrevista, dinámicas'],
            ['Elección y contratación', 'Incorporación y adaptación'],
          ],
        },
        {
          title: 'Fases de una entrevista',
          instruction: 'Ordena los cuatro momentos de una entrevista clásica.',
          items: [
            ['Introducción y acogida', 'Saludo y estructura'],
            ['Exploración del perfil', 'Trayectoria y competencias'],
            ['Información de la vacante', 'Funciones y condiciones'],
            ['Cierre y dudas', 'Tus preguntas y siguientes pasos'],
          ],
        },
        {
          title: 'Método STAR',
          instruction: 'Ordena las partes de una respuesta STAR.',
          items: [
            ['Situación', 'El contexto'],
            ['Tarea', 'Lo que te tocaba hacer'],
            ['Acción', 'Lo que hiciste'],
            ['Resultado', 'Cómo terminó y qué aprendiste'],
          ],
        },
        {
          title: 'Diseñar tu marca personal',
          instruction: 'Ordena las cuatro fases.',
          items: [
            ['Autoconocimiento', 'Habilidades, valores y misión'],
            ['Definición de la visión', 'Objetivos a medio y largo plazo'],
            ['Público objetivo', 'Qué empresas te necesitan y dónde están'],
            ['Comunicación', 'LinkedIn, portafolio y contenido'],
          ],
        },
      ],
    },
  ],
};
