// Datos del portafolio. Es el único archivo que hay que editar para sumar proyectos.
// Las rutas de imágenes y videos son relativas a index.html (ej: "assets/proyectos/mi-app/demo.mp4").

window.PORTAFOLIO = {
  perfil: {
    nombre: "Lucca Joaquín Bertani",
    rol: "Desarrollador de software",
    bio: "Estudiante de Ingeniería en Sistemas. Me interesa construir sistemas que optimicen y resuelvan problemas de negocio.",
    ubicacion: "Capital Federal, Argentina",
    email: "luccajbertani@gmail.com",
    enlaces: [
      { texto: "GitHub", url: "https://github.com/LuccaBertani" },
      { texto: "LinkedIn", url: "https://www.linkedin.com/in/lucca-bertani-25168135a" },
      { texto: "CV (PDF)", url: "assets/CV_Lucca_Bertani.pdf" }
    ]
  },

  proyectos: [
    {
      id: "simulacion-puerto",
      titulo: "Simulación de una terminal portuaria de descarga de mercancías",
      resumen: "Simulación de eventos discretos de una terminal con n grúas en paralelo, calibrada con datos reales de tráfico marítimo (AIS), para determinar la cantidad óptima de grúas que minimiza el costo total de la terminal.",
      fecha: "2026",
      estado: "Terminado",
      destacado: true,
      color: "#0f2d3d", // azul marítimo oscuro para la vitrina
      tags: ["Python", "Simulación de eventos discretos", "SciPy", "NumPy", "Google Colab", "Teoría de colas"],
      portada: "assets/proyectos/simulacion-puerto/portada_puerto_simulacion.png",
      descripcion: [
        "Trabajo práctico de la materia de Simulación: un modelo de eventos discretos (Llegada / Salida) de una terminal portuaria de descarga de mercancías, con n grúas trabajando en paralelo, cada una con su propia cola de barcos.",
        "Se calibró con datos reales de tráfico marítimo (AIS) de Yusen Terminals, Puerto de Los Ángeles: se detectaron 112 estadías reales de buques a partir de las cuales se ajustaron las distribuciones de arribos, calado y eslora, y una regresión del tiempo de atención de cada barco.",
        "El objetivo fue encontrar, mediante simulación, la cantidad óptima de grúas n que minimiza el costo total de funcionamiento, bajo dos criterios de costo independientes."
      ],
      comoFunciona: [
        { titulo: "Calibración con datos reales", texto: "Un script procesa un dataset público de AIS y detecta, por cada buque, sus estadías reales en la terminal (arribo, salida, calado, eslora) mediante una máquina de estados basada en proximidad y velocidad." },
        { titulo: "Ajuste de distribuciones", texto: "En un notebook de Google Colab se ajustan, por máxima verosimilitud, la distribución Exponencial del intervalo entre arribos y las Normales correlacionadas de calado y eslora, además de una regresión cuadrática por mínimos cuadrados para el tiempo de atención." },
        { titulo: "Simulación evento a evento", texto: "Para cada n entre 1 y 50 se corren 10.000 réplicas de un año simulado, registrando permanencia, espera en cola, ocio de grúas y dos costos totales: de oportunidad (grúa ociosa a tarifa plena) y general (costo operativo real)." }
      ],
      caracteristicas: [
        "Generación de variables aleatorias correlacionadas por descomposición de Cholesky",
        "Dos criterios de costeo independientes (oportunidad vs. costo operativo real)",
        "Calibración con 112 estadías reales de tráfico AIS",
        "Validación empírica: el n óptimo de costo general coincide con la cantidad real de grúas de la terminal",
        "Exportación de resultados y gráficos a Excel/PNG para las 50 configuraciones simuladas"
      ],
      arquitectura: "Pipeline en tres etapas: **procesamiento de datos** (script Python que detecta estadías reales a partir de AIS), **calibración** (notebook de Google Colab con `scipy.stats` y `numpy.linalg.lstsq`) y **simulación** (script Python de eventos discretos que corre las réplicas y exporta los resultados a Excel).",
      videos: [
        // { tipo: "archivo", src: "assets/proyectos/simulacion-puerto/demo.mp4", titulo: "Recorrido general" }
      ],
      enlaces: [
        { texto: "Repositorio", url: "https://github.com/tu-usuario/simulacion-puerto" }
      ],
      resultados: [
        { src: "assets/proyectos/simulacion-puerto/grafico_costo_log.png", titulo: "Grafica del costo total y costo oportunidad en función de la cantidad de gruas operativas." },
        {
          tipo: "archivo", src: "assets/proyectos/simulacion-puerto/resultados_simulacion.xlsx", titulo: "Resultados de la simulación.",
          // Filas a resaltar según el valor de la primera columna (n)
          resaltar: [
            { valor: 8, etiqueta: "óptimo por costo de oportunidad" },
            { valor: 10, etiqueta: "óptimo por costo general" }
          ]
        },
        { src: "assets/proyectos/simulacion-puerto/TP4_Paper.pdf", titulo: "Paper del trabajo." },
      ]
    },

    {
      id: "sweet-medical",
      titulo: "Sweet Medical: plataforma de turnos médicos",
      resumen: "Aplicación web para reservar turnos médicos según la cobertura de la obra social del paciente, con agenda de profesionales, reprogramaciones y notificaciones.",
      fecha: "2026",
      estado: "Terminado",
      destacado: true,
      color: "#1d3b4f", // fondo en la vitrina de la portada (opcional)
      tags: ["JavaScript", "Node.js", "Express", "MongoDB", "Mongoose", "React", "Vite", "Jest", "Cypress", "Swagger"],
      portada: "assets/proyectos/sweet-medical/portada_sweet-medical.png",
      descripcion: [
        "Trabajo Práctico Integrador de **Desarrollo de Software (UTN FRBA, 1C 2026)**, realizado en grupo. Los médicos definen su disponibilidad horaria, sus sedes y los servicios que ofrecen (especialidades y prácticas), y los pacientes buscan y reservan turnos según su obra social y plan.",
        "La cobertura del plan determina si cada prestación está **cubierta, parcialmente cubierta o no cubierta**, y el sistema calcula el costo final del turno antes de reservarlo. Se desarrolló de forma iterativa, desde el modelo de dominio hasta el despliegue en la nube, con Git Flow, code review y CI en GitHub Actions."
      ],
      comoFunciona: [
        { titulo: "Agenda del médico", texto: "El médico carga su disponibilidad horaria por sede y servicio. Un proceso batch nocturno (cronjob) genera los turnos DISPONIBLES; si la disponibilidad cambia, solo se regeneran los turnos futuros que no estén reservados." },
        { titulo: "Búsqueda y preselección", texto: "El paciente filtra por profesional, especialidad, práctica, sede y rango de fechas. Cada resultado muestra el nivel de cobertura y el costo estimado según su plan, con paginación y orden por costo o fecha. Los turnos que le interesan se agregan a un carrito de preselección." },
        { titulo: "Reserva y ciclo de vida", texto: "Al reservar, el sistema valida la disponibilidad de forma atómica para evitar dobles reservas. El turno pasa por los estados Reservado, Confirmado, Realizado o Cancelado; cancelar requiere al menos 1 hora de anticipación y un motivo, y cualquiera de las partes puede proponer una nueva fecha, que la otra acepta o rechaza." },
        { titulo: "Notificaciones", texto: "Médico y paciente reciben avisos dentro de la plataforma al reservar, confirmar, cancelar o reprogramar un turno, y un recordatorio automático el día anterior. Las notificaciones se pueden marcar como leídas." }
      ],
      caracteristicas: [
        "Cálculo de cobertura y costo según obra social y plan",
        "Búsqueda con filtros, paginación y ordenamiento",
        "Generación asincrónica de turnos con cronjobs (node-cron)",
        "Control de concurrencia con transacciones de MongoDB para evitar doble reserva",
        "Reprogramación por propuesta de cambio con confirmación de la contraparte",
        "Carrito de preselección de turnos del lado del cliente",
        "Roles de paciente, médico y administrador",
        "API REST documentada con Swagger",
        "Tests unitarios (Jest), de integración (Supertest) y E2E (Cypress)",
        "CI con GitHub Actions: lint y tests en cada push y PR"
      ],
      arquitectura: "Monorepo con npm workspaces. El **backend** (Node.js + Express) está organizado en capas: **Rutas y Controladores** (API REST), **Servicios** (casos de uso como `TurnoService` y `NotificacionService`), **Dominio** (`Turno`, `Slot`, `Agenda`, `Medico`, `Paciente`, `Plan`, `MotorCostos`, con patrón State para los estados del turno y Specification para los filtros de búsqueda) e **Infraestructura** (repositorios y esquemas de Mongoose sobre MongoDB con replica set). El **frontend** es una SPA en React con Vite, React Router, Axios y Ant Design / MUI, con un contexto global para el carrito de preselección.",
      videos: [
        { tipo: "archivo", src: "assets/proyectos/sweet-medical/videos/pantalla_deslogueado.mp4", titulo: "Visualización publica del sistema sin logueo." },
        { tipo: "archivo", src: "assets/proyectos/sweet-medical/videos/alta_paciente.mp4", titulo: "Un administrador da de alta un paciente en el sistema." },
        { tipo: "archivo", src: "assets/proyectos/sweet-medical/videos/activacion_paciente.mp4", titulo: "El paciente dado de alta activa su cuenta." },
        { tipo: "archivo", src: "assets/proyectos/sweet-medical/videos/agendar_turno.mp4", titulo: "Un paciente agenda un turno para una fecha particular segun la disponibilidad del medico seleccionado." },
        { tipo: "archivo", src: "assets/proyectos/sweet-medical/videos/confirmacion_medico.mp4", titulo: "El medico confirma la reserva hecha por el paciente y asigna una sede." },
        { tipo: "archivo", src: "assets/proyectos/sweet-medical/videos/ver_confirmacion_paciente.mp4", titulo: "El paciente visualiza la confirmación del turno con su respectiva sede." },
      ],
      enlaces: [
        { texto: "Repositorio", url: "https://github.com/ddso-utn/2026-1c-1c-lu-sa-grupo-08" } // repo de la organización de la cátedra: si es privado, cambialo por un fork público
        // { texto: "Demo en vivo", url: "https://TU-SITIO.netlify.app" } // REEMPLAZAR si querés mostrar el deploy
      ]
    },
    {
      id: "metamapa",
      titulo: "MetaMapa: plataforma colaborativa de hechos geolocalizados",
      resumen: "Aplicación web en Java Spring Boot para cargar, curar y visualizar hechos en un mapa interactivo, a partir de varias fuentes: datasets CSV, aportes de usuarios y APIs externas.",
      fecha: "2025",
      estado: "Terminado",
      destacado: true,
      color: "#2a1f4d", // violeta oscuro, en línea con el gradiente de la app
      tags: ["Java 17", "Spring Boot", "Spring Security", "JWT", "Hibernate/JPA", "MySQL", "Thymeleaf", "Bootstrap", "Leaflet", "WebClient"],
      portada: "assets/proyectos/metamapa/landing-page.png",
      descripcion: [
        "Trabajo Práctico Anual de Diseño de Sistemas de Información (UTN FRBA, 2025), desarrollado en grupo a lo largo de seis entregas incrementales.",
        "MetaMapa es una plataforma donde se cargan hechos (con título, descripción, categoría, fecha, ubicación y contenido multimedia) que luego se visualizan sobre un mapa interactivo y se organizan en colecciones temáticas.",
        "Los hechos provienen de tres tipos de fuente: estática (datasets CSV importados), dinámica (aportes de usuarios registrados) y proxy (una API externa de la cátedra y otras instancias de MetaMapa). Para las colecciones se aplican algoritmos de consenso que determinan qué hechos están respaldados por varias fuentes."
      ],
      comoFunciona: [
        { titulo: "Ingesta desde múltiples fuentes", texto: "Los datasets CSV se parsean detectando automáticamente el delimitador y mapeando columnas por nombre normalizado; los aportes de usuarios entran como solicitudes; y la fuente proxy consume una API REST externa autenticada con token mediante WebClient reactivo." },
        { titulo: "Normalización y geocodificación", texto: "Cada hecho se normaliza (categorías vía sinónimos, país y provincia) y, si trae coordenadas, se geocodifica de forma inversa con Nominatim (OpenStreetMap). El catálogo de países y provincias se arma desde REST Countries y Overpass API." },
        { titulo: "Colecciones y consenso", texto: "Una colección se define por criterios de filtrado (categoría, fechas, ubicación, fuente, título, etc.) y puede tener un algoritmo de consenso: mayoría simple, mayoría absoluta o múltiples menciones. Con navegación curada solo se muestran los hechos consensuados." },
        { titulo: "Moderación y estadísticas", texto: "Las solicitudes de alta, modificación y eliminación pasan por revisión de un administrador, con un detector de spam por heurísticas. Un proceso programado calcula estadísticas periódicas que pueden exportarse a CSV." }
      ],
      caracteristicas: [
        "Mapa interactivo con Leaflet: clic en un marcador para ver el hecho, clic en el mapa para contribuir uno nuevo en esa ubicación",
        "Tres algoritmos de consenso intercambiables por colección (patrón Strategy, persistido con un AttributeConverter)",
        "Sistema de filtros componibles para definir los criterios de cada colección",
        "Roles de usuario (visualizador, contribuyente, administrador) con autenticación JWT",
        "Flujo de solicitudes de alta, modificación y eliminación de hechos con revisión del administrador",
        "Detección automática de spam en solicitudes de eliminación",
        "Carga de contenido multimedia (imágenes y videos) asociado a cada hecho",
        "Estadísticas programadas (categoría con más hechos, hora pico por categoría, provincia con más hechos por colección, spam) exportables a CSV"
      ],
      arquitectura: "Dos proyectos Maven desacoplados que se comunican por API REST: un **backend** (Spring Boot, Spring Security con JWT, JPA/Hibernate) con cinco bases MySQL separadas — hechos estáticos, dinámicos, proxy, entidades principales y estadísticas — y un **frontend** de cliente liviano (Spring Boot + Thymeleaf, Bootstrap y Leaflet) que solo renderiza vistas y consume la API. El backend se organiza en controllers, services, repositories y un registro de buscadores para normalizar entidades, con validación de estilo (Checkstyle), code smells (SpotBugs) y cobertura (JaCoCo) en el pipeline de Maven.",
      videos: [
        // { tipo: "archivo", src: "assets/proyectos/metamapa/demo.mp4", titulo: "Recorrido general" }
      ],
      enlaces: [
        { texto: "Repositorio", url: "https://github.com/tu-usuario/metamapa" }
      ],
      imagenes: [
        { src: "assets/proyectos/metamapa/landing-page.png", titulo: "Pantalla principal de la aplicación." },
        { src: "assets/proyectos/metamapa/lista-hechos.png", titulo: "Vista de hechos." },
        { src: "assets/proyectos/metamapa/detalle-hecho.png", titulo: "Detalle de un hecho." },
        { src: "assets/proyectos/metamapa/mapa-interactivo.png", titulo: "Mapa interactivo de hechos." },
        { src: "assets/proyectos/metamapa/seccion-contribuir.png", titulo: "Contribuir hechos al sistema." },
        { src: "assets/proyectos/metamapa/formulario-hechos.png", titulo: "Formulario para enviar una solicitud de carga de un hecho." },
        { src: "assets/proyectos/metamapa/solicitudes-admin.png", titulo: "Un administrador gestiona las solicitudes de alta/baja/modificación de hechos." }
      ]
    }
  ]
};
