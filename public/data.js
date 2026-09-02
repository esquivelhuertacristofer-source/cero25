/**
 * CERO25 — DATOS SEMILLA
 * Todo el contenido es original de CERO25. Fotos: CC de Wikimedia Commons
 * (crédito en cada item) o póster de gradiente (campo art).
 * Este seed puebla el LocalDriver la primera vez; con Supabase, migra a tablas.
 */
window.CERO25_SEED = {

  categorias: [
    { slug: "videojuegos", nombre: "Videojuegos" },
    { slug: "cine",        nombre: "Cine" },
    { slug: "series",      nombre: "Series" },
    { slug: "anime",       nombre: "Anime" },
    { slug: "musica",      nombre: "Música" },
    { slug: "esports",     nombre: "Esports" },
    { slug: "retro",       nombre: "Retro" },
    { slug: "hardware",    nombre: "Hardware" },
    { slug: "indies",      nombre: "Indies" },
    { slug: "cultura",     nombre: "Cultura" },
    { slug: "tecnologia",  nombre: "Tecnología" },
    { slug: "podcast",     nombre: "Pódcast" }
  ],

  autores: [
    { id: "a1", nombre: "Marta Ibáñez",  rol: "Editora de Cine" },
    { id: "a2", nombre: "Luis Serrano",  rol: "Redactor de Videojuegos" },
    { id: "a3", nombre: "Ana Vidal",     rol: "Editora de Tecnología" },
    { id: "a4", nombre: "Sofía Aguirre", rol: "Redactora de Esports" },
    { id: "a5", nombre: "Bruno Cantú",   rol: "Especialista Retro" },
    { id: "a6", nombre: "Camila Reyes",  rol: "Redactora de Anime" },
    { id: "a7", nombre: "Tomás Urbina",  rol: "Productor de Pódcast" },
    { id: "a8", nombre: "R. Ferrer",     rol: "Crítico de Series" },
    { id: "a9", nombre: "La Redacción",  rol: "CERO25" }
  ],

  programas: [
    { id: "s1", nombre: "Partida Rápida",  host: "Marta Ibáñez",    color: "pc-green",  art: "g1", glyph: "PR",
      img: "assets/podcast.jpg",     credito: "Myotus · CC BY 4.0 · Wikimedia Commons" },
    { id: "s2", nombre: "Nivel Extra",     host: "Serrano y Vidal", color: "pc-orange", art: "g7", glyph: "+1",
      img: "assets/hardware.jpg",    credito: "Morn · CC BY-SA 4.0 · Wikimedia Commons" },
    { id: "s3", nombre: "Sala de Montaje", host: "Equipo de Cine",  color: "pc-red",    art: "g2", glyph: "24",
      img: "assets/cine.jpg",        credito: "John Phelan · CC BY 4.0 · Wikimedia Commons" },
    { id: "s4", nombre: "Modo Historia",   host: "Ana Vidal",       color: "pc-yellow", art: "g8", glyph: "MH",
      img: "assets/videojuegos.jpg", credito: "Evan-Amos · Dominio público · Wikimedia Commons" },
    { id: "s5", nombre: "Latencia Cero",   host: "Sofía Aguirre",   color: "pc-mint",   art: "g4", glyph: "0ms",
      img: "assets/esports.jpg",     credito: "Chongkian · CC BY-SA 4.0 · Wikimedia Commons" }
  ],

  /* biblioteca de medios: reutilizables desde el editor (fotos CC con credito) */
  medios: [
    { id: "m01", url: "assets/videojuegos.jpg",     credito: "Evan-Amos · Dominio público · Wikimedia Commons" },
    { id: "m02", url: "assets/cine.jpg",            credito: "John Phelan · CC BY 4.0 · Wikimedia Commons" },
    { id: "m03", url: "assets/esports.jpg",         credito: "Chongkian · CC BY-SA 4.0 · Wikimedia Commons" },
    { id: "m04", url: "assets/musica.jpg",          credito: "kpr2 · CC0 · Wikimedia Commons" },
    { id: "m05", url: "assets/series.jpg",          credito: "ArildV · CC BY-SA 3.0 · Wikimedia Commons" },
    { id: "m06", url: "assets/retro.jpg",           credito: "玄史生 · CC0 · Wikimedia Commons" },
    { id: "m07", url: "assets/anime.jpg",           credito: "Chongkian · CC BY-SA 4.0 · Wikimedia Commons" },
    { id: "m08", url: "assets/podcast.jpg",         credito: "Myotus · CC BY 4.0 · Wikimedia Commons" },
    { id: "m09", url: "assets/cultura.jpg",         credito: "Benjamin Thompson · CC BY-SA 2.0 · Wikimedia Commons" },
    { id: "m10", url: "assets/tecnologia.jpg",      credito: "Ingo Dierking · CC BY-SA 4.0 · Wikimedia Commons" },
    { id: "m11", url: "assets/hardware.jpg",        credito: "Morn · CC BY-SA 4.0 · Wikimedia Commons" },
    { id: "m12", url: "assets/retro-arcade.jpg",    credito: "Ominae · CC BY-SA 4.0 · Wikimedia Commons" },
    { id: "m13", url: "assets/retro-handheld.jpg",  credito: "Evan-Amos · Dominio público · Wikimedia Commons" },
    { id: "m14", url: "assets/vj-controller2.jpg",  credito: "Evan-Amos · Dominio público · Wikimedia Commons" },
    { id: "m15", url: "assets/cine-butacas.jpg",    credito: "reynermedia · CC BY 2.0 · Wikimedia Commons" },
    { id: "m16", url: "assets/musica-concierto.jpg",credito: "PinkBeachPlanet · CC BY-SA 4.0 · Wikimedia Commons" },
    { id: "m17", url: "assets/musica-dj.jpg",       credito: "Ryuta Ishimoto · CC BY-SA 2.0 · Wikimedia Commons" },
    { id: "m18", url: "assets/tec-servidores.jpg",  credito: "NOIRLab/NSF/AURA/T. Slovinský · CC BY 4.0" },
    { id: "m19", url: "assets/hw-gpu.jpg",          credito: "Nick Stathas · CC BY-SA 4.0 · Wikimedia Commons" },
    { id: "m20", url: "assets/tec-placa.jpg",       credito: "Kurt Kaiser · CC0 · Wikimedia Commons" },
    { id: "m21", url: "assets/anime-manga.jpg",     credito: "Michael Ocampo · CC BY 2.0 · Wikimedia Commons" },
    { id: "m22", url: "assets/cultura-comic.jpg",   credito: "PeaceSeekers · CC BY 4.0 · Wikimedia Commons" },
    { id: "m23", url: "assets/indies-jam.jpg",      credito: "Sebastiaan ter Burg · CC BY-SA 2.0 · Wikimedia Commons" },
    { id: "m24", url: "assets/series-control.jpg",  credito: "Anthony Quintano · CC BY 2.0 · Wikimedia Commons" },
    { id: "m25", url: "assets/indies-pixel.jpg",    credito: "Singlespeedfahrer · CC0 · Wikimedia Commons" }
  ],

  /* tipo: articulo | video | short | podcast
     img: foto local (con credito) · art: poster de gradiente g1-g12 + glyph
     estado: publicado | borrador · vistas: para "más leídos" */
  articulos: [
    {
      id: "n1", tipo: "articulo", estado: "publicado",
      titulo: "Los 100 mejores juegos de 2026: la lista definitiva",
      slug: "100-mejores-juegos-2026",
      categoria: "videojuegos", autor: "a9",
      fecha: "2026-09-01T08:00:00", vistas: 12400,
      img: "assets/videojuegos.jpg", credito: "Evan-Amos · Dominio público · Wikimedia Commons",
      extracto: "Un año monstruoso destilado en cien entradas: los imprescindibles, las sorpresas y los que envejecerán mejor de lo que crees.",
      cuerpo: [
        "Cerrar una lista de cien juegos en un año como este es un ejercicio de renuncia. Quedaron fuera títulos que en 2023 habrían peleado el top diez, y aun así cada posición de esta lista se discutió hasta la madrugada.",
        "El criterio fue simple de enunciar y difícil de aplicar: ¿volveríamos a jugarlo dentro de cinco años? Los cien que siguen pasaron esa prueba. Los géneros ya no significan lo que significaban, los indies pelean de tú a tú con los presupuestos gigantes, y el top tres nos sorprendió hasta a nosotros.",
        "La lista se actualizará una única vez en diciembre, cuando el calendario de lanzamientos diga su última palabra. Hasta entonces: que empiece la discusión."
      ]
    },
    {
      id: "n2", tipo: "articulo", estado: "publicado",
      titulo: "La sala de medianoche está salvando al cine de terror",
      slug: "sala-medianoche-cine-terror",
      categoria: "cine", autor: "a1",
      fecha: "2026-08-31T22:00:00", vistas: 8900,
      img: "assets/cine.jpg", credito: "John Phelan · CC BY 4.0 · Wikimedia Commons",
      extracto: "Las funciones de las 00:00 crecen por tercer trimestre consecutivo, y no es nostalgia: es un modelo de negocio.",
      cuerpo: [
        "Hay un dato que las cadenas de cines no esperaban ver en 2026: la función de medianoche, esa que parecía condenada por el streaming, es la **única franja que crece**. Tercer trimestre consecutivo, y el género que la sostiene es el terror.",
        "## Un negocio, no una nostalgia",
        "La explicación no es romántica sino económica: la medianoche convirtió la sala en evento. El público que va a las doce no va a ver una película: va a gritar con extraños, y eso no se puede descargar.",
        "> La sala de medianoche no compite con el sofá: vende exactamente lo que el sofá no puede dar.",
        "!img:assets/cine-butacas.jpg|Butacas listas para la función de las 00:00. Foto: reynermedia · CC BY 2.0",
        "Los estudios ya tomaron nota. Tres distribuidoras confirmaron estrenos de terror exclusivos de madrugada para el último trimestre, y al menos una cadena prepara un [abono mensual nocturno](seccion.html?cat=cine)."
      ]
    },
    {
      id: "n3", tipo: "articulo", estado: "publicado",
      titulo: "Scrims a las 3 AM: una semana dentro de un equipo tier 2",
      slug: "scrims-equipo-tier-2",
      categoria: "esports", autor: "a4",
      fecha: "2026-08-30T10:00:00", vistas: 11200,
      img: "assets/esports.jpg", credito: "Chongkian · CC BY-SA 4.0 · Wikimedia Commons",
      extracto: "Dormir es opcional; el bootcamp, no. Siete días conviviendo con un equipo que pelea por existir.",
      cuerpo: [
        "El primer scrim del día empieza cuando la ciudad se apaga. A las tres de la mañana, cinco jugadores que casi nadie conoce practican contra un rival de otra región porque es la única franja horaria que ambos equipos pudieron cuadrar.",
        "El tier 2 de los esports vive en esa paradoja: exige la disciplina de un profesional con los recursos de un aficionado. Durante una semana dormí en el mismo bootcamp, comí la misma pasta recalentada y vi de cerca lo que no sale en los clips.",
        "Lo que encontré no fue una historia de sacrificio romántico, sino de logística imposible: visados, sueldos que llegan tarde y un análisis de datos que haría sonrojar a más de un equipo grande. Pelean por existir, y existen peleando."
      ]
    },
    {
      id: "n4", tipo: "articulo", estado: "publicado",
      titulo: "El regreso del vinilo llega a los torneos",
      slug: "vinilo-torneos-bandas-sonoras",
      categoria: "musica", autor: "a7",
      fecha: "2026-08-29T16:00:00", vistas: 7700,
      img: "assets/musica-dj.jpg", credito: "Ryuta Ishimoto · CC BY-SA 2.0 · Wikimedia Commons",
      extracto: "Bandas sonoras en directo entre mapa y mapa: la idea que nadie pidió y todos aplauden.",
      cuerpo: [
        "Entre el segundo y el tercer mapa de una final hay quince minutos muertos. Un promotor decidió llenarlos con un DJ pinchando bandas sonoras de videojuegos en vinilo, y la grada respondió como si fuera parte del espectáculo. Porque ahora lo es.",
        "El fenómeno tiene su lógica: la generación que creció con estas melodías ya llena estadios, y el vinilo aporta la liturgia. Las discográficas especializadas confirman que las tiradas de bandas sonoras se agotan en preventa desde hace un año."
      ]
    },
    {
      id: "n5", tipo: "articulo", estado: "publicado",
      titulo: "CRT: por qué tu tele vieja era mejor para jugar",
      slug: "crt-tele-vieja-mejor",
      categoria: "retro", autor: "a5",
      fecha: "2026-08-28T12:00:00", vistas: 9800,
      img: "assets/retro.jpg", credito: "玄史生 · CC0 · Wikimedia Commons",
      extracto: "Latencia, líneas de escaneo y una nostalgia con base técnica: la ciencia detrás del culto al tubo.",
      cuerpo: [
        "No es solo nostalgia, aunque la nostalgia ayude. Un televisor de tubo dibuja la imagen sin procesarla: la latencia es, a efectos prácticos, cero. Tu monitor plano de última generación, con todos sus filtros, no puede decir lo mismo.",
        "A eso se suma cómo el pixel art fue diseñado: los artistas de los noventa contaban con las líneas de escaneo para suavizar y mezclar. En un panel moderno ves los píxeles desnudos; en un CRT ves lo que el artista quería que vieras.",
        "El resultado es un mercado absurdo y encantador donde una tele que pesaba como un mueble se vende más cara que una consola nueva. Esta guía explica cuándo vale la pena y cuándo es puro fetiche."
      ]
    },
    {
      id: "n6", tipo: "articulo", estado: "publicado",
      titulo: "Teclados silenciosos para casas pequeñas",
      slug: "teclados-silenciosos-guia",
      categoria: "hardware", autor: "a3",
      fecha: "2026-08-27T09:00:00", vistas: 5900,
      img: "assets/hardware.jpg", credito: "Morn · CC BY-SA 4.0 · Wikimedia Commons",
      extracto: "Trabajas y juegas en el mismo escritorio, y alguien duerme al lado. Esta guía es para ti.",
      cuerpo: [
        "El teclado mecánico tiene un problema que ningún fabricante pone en la caja: suena a granizo sobre chapa. Si tu escritorio comparte pared con un dormitorio, cada partida nocturna es una negociación diplomática.",
        "Probamos catorce interruptores silenciosos, tres tipos de amortiguación y todas las espumas del mercado. La sorpresa: la diferencia real no está donde el marketing dice, y la opción ganadora cuesta la mitad que la más cara."
      ]
    },
    {
      id: "n7", tipo: "articulo", estado: "publicado",
      titulo: "La convención que reunió a tres generaciones de cosplay",
      slug: "convencion-tres-generaciones-cosplay",
      categoria: "anime", autor: "a6",
      fecha: "2026-08-26T14:00:00", vistas: 9300,
      img: "assets/anime.jpg", credito: "Chongkian · CC BY-SA 4.0 · Wikimedia Commons",
      extracto: "Abuelas con pelucas, padres con armaduras de cartón y una pasarela que contó treinta años de historia.",
      cuerpo: [
        "En la fila para la pasarela había una mujer de sesenta y dos años vestida de la heroína que cosía para su hija en 1996. Detrás, esa hija, con la versión moderna del mismo traje. Y delante, la nieta, con una interpretación propia que mezclaba las dos.",
        "Las convenciones llevan años creciendo, pero lo de este año fue distinto: el cosplay dejó de ser una actividad juvenil para volverse patrimonio familiar. Hablamos con los organizadores, con las tres generaciones de la foto que abrió esta nota, y con los costureros que están haciendo negocio de la memoria."
      ]
    },
    {
      id: "n8", tipo: "articulo", estado: "publicado",
      titulo: "El barrio vuelve a jugar: la segunda vida de los arcades",
      slug: "arcades-urbanos-segunda-vida",
      categoria: "cultura", autor: "a7",
      fecha: "2026-08-25T18:00:00", vistas: 6900,
      img: "assets/cultura.jpg", credito: "Benjamin Thompson · CC BY-SA 2.0 · Wikimedia Commons",
      extracto: "Cierran los cines de barrio y abren salas de máquinas. Nadie lo predijo; todos hacen fila.",
      cuerpo: [
        "El local donde antes había una sucursal bancaria ahora tiene cuarenta máquinas recreativas y una barra de refrescos. Los viernes hay fila en la acera, y la mitad de la fila no había nacido cuando estas máquinas eran nuevas.",
        "Los nuevos arcades no compiten con el juego en casa: venden lo contrario. Torneos presenciales de juegos de lucha, marcadores escritos con rotulador, y la posibilidad de perder contra un desconocido que luego te invita la revancha. El negocio, contra todo pronóstico, escala."
      ]
    },
    {
      id: "n9", tipo: "articulo", estado: "publicado",
      titulo: "El chip que nadie pidió y todos usan",
      slug: "chip-que-nadie-pidio",
      categoria: "tecnologia", autor: "a3",
      fecha: "2026-08-24T11:00:00", vistas: 9500,
      img: "assets/tecnologia.jpg", credito: "Ingo Dierking · CC BY-SA 4.0 · Wikimedia Commons",
      extracto: "De accesorio de nicho a estándar silencioso en dos años: la historia del coprocesador que se coló en todo.",
      cuerpo: [
        "Hace dos años era una línea perdida en las especificaciones. Hoy está en tu consola, en tu portátil y probablemente en tu televisor, haciendo un trabajo que nadie ve y del que todo depende.",
        "Esta es la historia de cómo un coprocesador de propósito dudoso encontró su función real por accidente, y de por qué los fabricantes prefieren no hablar demasiado de él: la respuesta involucra patentes, consumo eléctrico y una guerra de estándares que se libra en silencio."
      ]
    },
    {
      id: "n10", tipo: "articulo", estado: "publicado",
      titulo: "Tres personas, un metroidvania, cero ruido",
      slug: "tres-personas-metroidvania",
      categoria: "indies", autor: "a2",
      fecha: "2026-08-23T15:00:00", vistas: 7600,
      img: "assets/indies-jam.jpg", credito: "Sebastiaan ter Burg · CC BY-SA 2.0 · Wikimedia Commons",
      extracto: "Sin editor, sin tráiler, sin campaña. Solo una demo que se pasó de mano en mano hasta conquistar el festival.",
      cuerpo: [
        "No hubo anuncio. La demo apareció un martes en un foro pequeño, la subió una cuenta sin historial, y setenta y dos horas después los organizadores del festival más importante del circuito indie la estaban buscando para invitarla.",
        "Detrás hay tres personas que se conocieron haciendo mods y que decidieron que el marketing era un problema para después. Hablamos con ellas sobre la demo, el ruido que no buscaron y la oferta de publicación que rechazaron la semana pasada."
      ]
    },
    {
      id: "n11", tipo: "articulo", estado: "publicado",
      titulo: "Guía sin spoilers del final de temporada",
      slug: "guia-sin-spoilers-final-temporada",
      categoria: "series", autor: "a8",
      fecha: "2026-08-22T20:00:00", vistas: 10100,
      img: "assets/series.jpg", credito: "ArildV · CC BY-SA 3.0 · Wikimedia Commons",
      extracto: "Qué necesitas recordar, qué puedes saltarte y a qué hora exacta conviene silenciar las redes.",
      cuerpo: [
        "El final de temporada más esperado del año llega este viernes, y con él, el campo minado: clips filtrados, teorías con captura y el amigo que 'solo dice una cosita'. Esta guía existe para que llegues limpio.",
        "Dentro: el resumen de dos minutos de lo imprescindible, los tres episodios que sí conviene revisar, y nuestra recomendación de horario para verlo esquivando husos horarios ajenos. Sin un solo spoiler; palabra de la sección."
      ]
    },
    {
      id: "n12", tipo: "articulo", estado: "publicado",
      titulo: "El mapa abierto ya no es suficiente",
      slug: "mapa-abierto-no-suficiente",
      categoria: "videojuegos", autor: "a2",
      fecha: "2026-08-21T13:00:00", vistas: 6100,
      img: "assets/vj-controller2.jpg", credito: "Evan-Amos · Dominio público · Wikimedia Commons",
      extracto: "Los jugadores piden densidad, no kilómetros. Y los estudios más listos ya cambiaron el plano.",
      cuerpo: [
        "Durante una década, el tamaño del mapa fue argumento de venta: más kilómetros cuadrados, más horas, más iconos. Este año, por primera vez, los tres lanzamientos mejor recibidos del género presumieron de lo contrario.",
        "La palabra que se repite en las entrevistas es densidad: menos territorio, más significado por metro. Repasamos qué cambió en el diseño, qué estudios lo vieron venir y por qué el mapa-sábana no va a desaparecer, pero sí a dejar de ser el estándar."
      ]
    },
    {
      id: "n13", tipo: "articulo", estado: "publicado",
      titulo: "Openings que son mejores que su serie",
      slug: "openings-mejores-que-su-serie",
      categoria: "anime", autor: "a6",
      fecha: "2026-08-20T17:00:00", vistas: 6700,
      img: "assets/anime-manga.jpg", credito: "Michael Ocampo · CC BY 2.0 · Wikimedia Commons",
      extracto: "El debate eterno de la sobremesa otaku, resuelto con criterio y mala intención.",
      cuerpo: [
        "Todo espectador de anime guarda en la memoria al menos un opening que le prometió una serie mejor que la que recibió. Noventa segundos de dirección impecable al servicio de doce episodios que no estuvieron a la altura.",
        "Elegimos diez casos, los defendimos en asamblea y salimos con amistades dañadas. El resultado es esta lista, que incluye una regla de oro para detectar el fenómeno antes de invertir una temporada entera."
      ]
    },
    {
      id: "n14", tipo: "articulo", estado: "publicado",
      titulo: "Tramas que merecían otra temporada",
      slug: "tramas-merecian-otra-temporada",
      categoria: "series", autor: "a8",
      fecha: "2026-08-19T10:00:00", vistas: 6300,
      art: "g6", glyph: "S05",
      extracto: "Cinco historias que el algoritmo cortó antes de tiempo, y lo que sabemos de sus finales imposibles.",
      cuerpo: [
        "La cancelación es el género de terror de nuestra época. Cinco series con mundos a medio abrir, personajes a medio decir y guiones de temporadas enteras durmiendo en un cajón.",
        "Hablamos con guionistas de tres de ellas. Dos nos contaron, con detalle y algo de duelo, cómo habrían terminado sus historias. Lo que sigue es la reconstrucción más completa posible de los finales que no veremos."
      ]
    },
    {
      id: "n15", tipo: "articulo", estado: "publicado",
      titulo: "Diez portadas que definieron una década",
      slug: "diez-portadas-definieron-decada",
      categoria: "cultura", autor: "a9",
      fecha: "2026-08-18T12:00:00", vistas: 5200,
      art: "g11", glyph: "N.1",
      extracto: "Del pixel art al fotorrealismo: la historia del videojuego contada por sus carátulas.",
      cuerpo: [
        "Antes de que existieran los tráilers, la portada era la promesa entera. Un ilustrador tenía una imagen para venderte un mundo, y algunos la usaron tan bien que la caja terminó siendo más recordada que el juego.",
        "Seleccionamos diez portadas que no solo vendieron: definieron la estética de su tiempo. Con entrevistas a dos de los ilustradores originales y el análisis de por qué el arte de caja vive un renacimiento en pleno mercado digital."
      ]
    },
    {
      id: "n16", tipo: "articulo", estado: "publicado",
      titulo: "La generación que nadie vio venir",
      slug: "generacion-que-nadie-vio-venir",
      categoria: "hardware", autor: "a3",
      fecha: "2026-08-17T09:30:00", vistas: 8200,
      img: "assets/hw-gpu.jpg", credito: "Nick Stathas · CC BY-SA 4.0 · Wikimedia Commons",
      extracto: "Las consolas de mitad de ciclo llegaron sin ruido y cambiaron las reglas del juego a medio plazo.",
      cuerpo: [
        "Ninguna tuvo un anuncio espectacular. Las revisiones de mitad de generación aparecieron en notas de prensa discretas, con mejoras que sonaban a nota al pie. Seis meses después, los datos cuentan otra historia.",
        "Analizamos qué cambió de verdad bajo el chasis, por qué los estudios las adoptaron más rápido de lo previsto y qué significa esto para la próxima generación 'completa', que quizá ya no llegue nunca en el formato que conocíamos."
      ]
    },
    {
      id: "n17", tipo: "articulo", estado: "publicado",
      titulo: "Pixel art con presupuesto de café",
      slug: "pixel-art-presupuesto-cafe",
      categoria: "indies", autor: "a2",
      fecha: "2026-08-16T15:00:00", vistas: 4300,
      img: "assets/indies-pixel.jpg", credito: "Singlespeedfahrer · CC0 · Wikimedia Commons",
      extracto: "Cómo los estudios de una sola persona están produciendo el arte más imitado del momento.",
      cuerpo: [
        "El estilo visual más copiado del año no salió de un estudio con departamento de arte, sino de una desarrolladora que trabaja desde la mesa de su cocina y publica sus paletas de colores gratis.",
        "Su técnica, que combina restricciones de hardware inventadas con herramientas modernas, ya tiene escuela. Le pedimos que nos la explicara paso a paso, y de paso, que nos contara por qué rechaza sistemáticamente las ofertas de los grandes."
      ]
    },
    {
      id: "n18", tipo: "articulo", estado: "publicado",
      titulo: "El synthwave llena estadios y nadie lo vio venir",
      slug: "synthwave-llena-estadios",
      categoria: "musica", autor: "a7",
      fecha: "2026-08-15T19:00:00", vistas: 7100,
      img: "assets/musica-concierto.jpg", credito: "PinkBeachPlanet · CC BY-SA 4.0 · Wikimedia Commons",
      extracto: "El género que nació en dormitorios con nostalgia de una década no vivida ya agota arenas.",
      cuerpo: [
        "Hace diez años era una etiqueta de nicho en plataformas de música independiente. Hoy, la gira que pasa por nuestra ciudad este otoño colgó el cartel de agotado en cuarenta minutos.",
        "El synthwave logró algo raro: convertir la nostalgia de una década que su público no vivió en un espectáculo presente. Fuimos al primer concierto de la gira para entender cómo suena un recuerdo inventado cuando lo comparten quince mil personas."
      ]
    },
    {
      id: "n19", tipo: "articulo", estado: "publicado",
      titulo: "Fotogramas que se volvieron póster",
      slug: "fotogramas-que-se-volvieron-poster",
      categoria: "cine", autor: "a1",
      fecha: "2026-08-14T16:00:00", vistas: 7300,
      img: "assets/cine-butacas.jpg", credito: "reynermedia · CC BY 2.0 · Wikimedia Commons",
      extracto: "El arte de detener la imagen: cuando un solo cuadro cuenta la película entera.",
      cuerpo: [
        "Hay fotogramas que escapan de su película. Se imprimen, se cuelgan, se tatúan, y terminan significando más que las dos horas que los rodean. Este ensayo persigue esa alquimia.",
        "Elegimos ocho cuadros que trascendieron, hablamos con un director de fotografía sobre qué los hace funcionar fuera de contexto, y descubrimos que casi todos comparten un secreto de composición que, una vez visto, no se puede dejar de ver."
      ]
    },
    {
      id: "n20", tipo: "articulo", estado: "publicado",
      titulo: "El fichaje del año se decidió en ranked",
      slug: "fichaje-del-anio-ranked",
      categoria: "esports", autor: "a4",
      fecha: "2026-08-13T11:00:00", vistas: 6800,
      img: "assets/esports.jpg", credito: "Chongkian · CC BY-SA 4.0 · Wikimedia Commons",
      extracto: "Veintisiete victorias seguidas en la cola competitiva que terminaron en un contrato profesional.",
      cuerpo: [
        "Los ojeadores llevan años diciendo que la cola clasificatoria ya no sirve para encontrar talento. Entonces apareció una cuenta anónima que encadenó veintisiete victorias contra profesionales, y todos los equipos de la región activaron a sus analistas a la vez.",
        "La historia de cómo se descubrió su identidad, la puja que siguió y el debut que llega este mes es, en miniatura, la historia de cómo los esports siguen siendo el único deporte donde puedes fichar a una leyenda que nadie ha visto la cara."
      ]
    },

    /* ---- vídeos ---- */
    { id: "v1", tipo: "video", estado: "publicado",
      titulo: "¿Cuánto dura de verdad un juego de 100 horas?",
      slug: "video-cuanto-dura-juego-100-horas",
      categoria: "videojuegos", autor: "a2", programa: "s2",
      fecha: "2026-08-30T12:00:00", vistas: 15200, duracion: "18 min",
      img: "assets/retro-handheld.jpg", credito: "Evan-Amos · Dominio público · Wikimedia Commons",
      extracto: "Medimos con cronómetro lo que el marketing mide con entusiasmo." },
    { id: "v2", tipo: "video", estado: "publicado",
      titulo: "El truco de montaje que ves a diario sin notarlo",
      slug: "video-truco-montaje-diario",
      categoria: "cine", autor: "a1", programa: "s3",
      fecha: "2026-08-28T12:00:00", vistas: 11800, duracion: "12 min",
      img: "assets/series.jpg", credito: "ArildV · CC BY-SA 3.0 · Wikimedia Commons",
      extracto: "Una vez que lo veas, lo verás en todas partes. Perdón por adelantado." },
    { id: "v3", tipo: "video", estado: "publicado",
      titulo: "Desmontando un CRT por dentro (con cuidado)",
      slug: "video-desmontando-crt",
      categoria: "retro", autor: "a5", programa: "s2",
      fecha: "2026-08-26T12:00:00", vistas: 9400, duracion: "22 min",
      img: "assets/retro-arcade.jpg", credito: "Ominae · CC BY-SA 4.0 · Wikimedia Commons",
      extracto: "Qué hay dentro del tubo y por qué no deberías abrirlo tú (nosotros somos profesionales)." },
    { id: "v4", tipo: "video", estado: "publicado",
      titulo: "La final regional, analizada jugada a jugada",
      slug: "video-final-regional-analisis",
      categoria: "esports", autor: "a4", programa: "s5",
      fecha: "2026-08-24T12:00:00", vistas: 13600, duracion: "34 min",
      art: "g4", glyph: "GG",
      extracto: "Los tres minutos que decidieron el título, en cámara lenta y con datos." },
    { id: "v5", tipo: "video", estado: "publicado",
      titulo: "El sonido de los ochenta explicado con un sintetizador",
      slug: "video-sonido-ochenta-sintetizador",
      categoria: "musica", autor: "a7", programa: "s4",
      fecha: "2026-08-22T12:00:00", vistas: 8700, duracion: "15 min",
      img: "assets/musica.jpg", credito: "kpr2 · CC0 · Wikimedia Commons",
      extracto: "Tres perillas, un arpegiador y toda una década saliendo de un altavoz." },

    /* ---- shorts ---- */
    { id: "sh1", tipo: "short", estado: "publicado",
      titulo: "El logro que solo tiene el 0,3% de los jugadores",
      slug: "short-logro-03-por-ciento",
      categoria: "videojuegos", autor: "a2", fecha: "2026-08-31T09:00:00",
      vistas: 22000, duracion: "0:58", art: "g1", glyph: "0.3%" },
    { id: "sh2", tipo: "short", estado: "publicado",
      titulo: "Así suena un cartucho al que le soplas (mito resuelto)",
      slug: "short-cartucho-soplar-mito",
      categoria: "retro", autor: "a5", fecha: "2026-08-30T09:00:00",
      vistas: 31000, duracion: "0:45", art: "g7", glyph: "8BIT" },
    { id: "sh3", tipo: "short", estado: "publicado",
      titulo: "El plano de 4 segundos que costó tres semanas",
      slug: "short-plano-4-segundos",
      categoria: "cine", autor: "a1", fecha: "2026-08-29T09:00:00",
      vistas: 18500, duracion: "0:52", art: "g2", glyph: "4s" },
    { id: "sh4", tipo: "short", estado: "publicado",
      titulo: "Reacción en vivo al fichaje del año",
      slug: "short-reaccion-fichaje",
      categoria: "esports", autor: "a4", fecha: "2026-08-28T09:00:00",
      vistas: 27400, duracion: "1:00", art: "g4", glyph: "!?" },
    { id: "sh5", tipo: "short", estado: "publicado",
      titulo: "Un opening dibujado a mano, cuadro por cuadro",
      slug: "short-opening-a-mano",
      categoria: "anime", autor: "a6", fecha: "2026-08-27T09:00:00",
      vistas: 19800, duracion: "0:59", art: "g9", glyph: "OP" }
  ],

  /* ---- composición de portada: la lógica de curación ----
     modo auto: la sección se llena sola por regla
     modo curado: slots con ids de artículos elegidos por el editor
     fallback: si un slot está vacío, entra el elegible más reciente */
  portada: {
    hero:      { modo: "curado", requiere: "wide", slots: ["n1", "n2", "n3", "n16"] },
    ultimo:    { modo: "auto", regla: "recientes", excluirTipos: ["short", "podcast"], n: 4 },
    banda:     { modo: "curado", requiere: "wide", slots: ["n5"] },
    lecturas:  { modo: "mixto", enlaces: { regla: "mas-vistos", n: 6 }, tarjetas: ["n9", "n8"] },
    videos:    { modo: "auto", regla: "tipo-video", lista: 4, destacado: "v2", banner: "n20" },
    rail1:     { modo: "curado", titulo: "Ponte al día: otoño gamer", slots: ["n12", "n16", "n10", "n17"] },
    feature1:  { modo: "curado", requiere: "wide", slots: ["n7"] },
    minis:     { modo: "curado", slots: ["n13", "n14", "n15"] },
    feature2:  { modo: "curado", requiere: "wide", slots: ["n18"] },
    rail2:     { modo: "curado", titulo: "¿Qué está pasando con los arcades?", slots: ["n8", "n5", "n15"] },
    shorts:    { modo: "auto", regla: "tipo-short", n: 5 },
    programas: { modo: "auto" },
    grandes:   { modo: "auto", regla: "longform", minParrafos: 3, n: 4 }
  }
};
