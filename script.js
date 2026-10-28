const frasesLiterarias = [
  {
    frase: "Si buscas la perfección nunca estarás contento",
    autor: "León Tolstói"
  },
  {
    frase: "La literatura no es otra cosa que un sueño dirigido",
    autor: "Jorge Luis Borges"
  },
  {
    frase: "Deja de preocuparte por envejecer y piensa en crecer",
    autor: "Philip Roth"
  },
  {
    frase: "Amor y deseo son dos cosas diferentes; que no todo lo que se ama se desea, ni todo lo que se desea se ama",
    autor: "Miguel de Cervantes"
  },
  {
    frase: "Aceptamos el amor que creemos merecer",
    autor: "Stephen Chbosky"
  }
];

const textoFrase = document.getElementById("texto-frase");
const autorFrase = document.getElementById("autor-frase");
const botonNuevaFrase = document.getElementById("btn-nueva-frase");
const botonCambiarTema = document.getElementById("btn-cambiar-tema");
const tituloPortada = document.getElementById("titulo-portada");

function mostrarNuevaFrase() {
  const indiceAleatorio = Math.floor(Math.random() * frasesLiterarias.length);
  const fraseSeleccionada = frasesLiterarias[indiceAleatorio];

  textoFrase.textContent = `“${fraseSeleccionada.frase}”`;
  autorFrase.textContent = `— ${fraseSeleccionada.autor}`;
}

botonNuevaFrase.addEventListener("click", mostrarNuevaFrase);

botonCambiarTema.addEventListener("click", () => {
  const modoOscuroActivo = document.body.classList.toggle("modo-oscuro");
  const etiquetaTema = modoOscuroActivo ? "Activar modo claro" : "Activar modo oscuro";

  botonCambiarTema.title = etiquetaTema;
  botonCambiarTema.setAttribute("aria-label", etiquetaTema);
  botonCambiarTema.setAttribute("aria-pressed", String(modoOscuroActivo));
});

const textoTituloPortada = "Café & Letras";
const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (movimientoReducido || typeof anime === "undefined") {
  tituloPortada.textContent = textoTituloPortada;
} else {
  const { animate } = anime;
  tituloPortada.setAttribute("aria-label", textoTituloPortada);
  tituloPortada.textContent = "";

  const cursorEscritura = document.createElement("span");
  cursorEscritura.className = "cursor-escritura";
  cursorEscritura.setAttribute("aria-hidden", "true");
  tituloPortada.appendChild(cursorEscritura);

  const caracteres = Array.from(textoTituloPortada);

  function escribirCaracter(indice) {
    if (indice >= caracteres.length) {
      cursorEscritura.remove();
      return;
    }

    animate(cursorEscritura, {
      opacity: [0.35, 1],
      duration: 250,
      ease: "linear",
      onComplete: () => {
        tituloPortada.insertBefore(
          document.createTextNode(caracteres[indice]),
          cursorEscritura
        );
        escribirCaracter(indice + 1);
      }
    });
  }

  escribirCaracter(0);
}

const recomendaciones = document.getElementById("recomendaciones");
const textoRecomendaciones = recomendaciones?.querySelectorAll(
  ".titulo-seccion > .eyebrow, .titulo-seccion > h2, .titulo-seccion > p:last-child"
);
const imagenesRecomendaciones = Array.from(
  recomendaciones?.querySelectorAll(".recomendacion-imagen img") || []
);
const elementosRecomendaciones = Array.from(textoRecomendaciones || []);
const descripcionRecomendaciones = elementosRecomendaciones[2];
const opacidadOriginalDescripcion = descripcionRecomendaciones?.style.opacity || "";
const opacidadesOriginalesImagenes = Array.from(imagenesRecomendaciones || []).map(
  (imagen) => imagen.style.opacity
);
const intervaloEntreCaracteres = 65;
const duracionPorCaracter = 80;
const pausaEntreBloques = 300;

function mostrarRecomendaciones() {
  if (
    !textoRecomendaciones?.length ||
    movimientoReducido ||
    typeof anime === "undefined"
  ) {
    return;
  }

  try {
    const { animate, stagger } = anime;
    imagenesRecomendaciones.forEach((imagen) => {
      animate(imagen, {
        opacity: [0, 1],
        duration: 3000,
        ease: "out(3)",
        onComplete: () => {
          imagen.style.opacity = "1";
        }
      });
    });

    const bloques = [
      Array.from(elementosRecomendaciones[0].children),
      Array.from(elementosRecomendaciones[1].children)
    ];

    function animarBloque(indice) {
      if (indice === 2) {
        animate(descripcionRecomendaciones, {
          opacity: [0, 1],
          duration: 1200,
          ease: "out(3)"
        });
        return;
      }

      if (indice > 2) {
        return;
      }

      animate(bloques[indice], {
        opacity: [0, 1],
        delay: stagger(intervaloEntreCaracteres),
        duration: duracionPorCaracter,
        ease: "linear",
        onComplete: () => {
          window.setTimeout(
            () => animarBloque(indice + 1),
            pausaEntreBloques
          );
        }
      });
    }

    animarBloque(0);
  } catch (error) {
    textoRecomendaciones.forEach((elemento) => {
      elemento.textContent = elemento.getAttribute("aria-label") || elemento.textContent;
      elemento.removeAttribute("aria-label");
    });
    if (descripcionRecomendaciones) {
      descripcionRecomendaciones.style.opacity = opacidadOriginalDescripcion;
    }
    Array.from(imagenesRecomendaciones || []).forEach((imagen, indice) => {
      imagen.style.opacity = opacidadesOriginalesImagenes[indice];
    });
  }
}

function prepararTextoRecomendaciones() {
  elementosRecomendaciones.slice(0, 2).forEach((elemento) => {
    const textoOriginal = elemento.textContent;
    const fragmento = document.createDocumentFragment();

    elemento.setAttribute("aria-label", textoOriginal);
    elemento.textContent = "";

    Array.from(textoOriginal).forEach((caracter) => {
      const letra = document.createElement("span");
      letra.textContent = caracter;
      letra.setAttribute("aria-hidden", "true");
      letra.style.opacity = "0";
      fragmento.appendChild(letra);
    });

    elemento.appendChild(fragmento);
  });

  if (descripcionRecomendaciones) {
    descripcionRecomendaciones.style.opacity = "0";
  }

  imagenesRecomendaciones?.forEach((imagen) => {
    imagen.style.opacity = "0";
  });
}

if (!movimientoReducido && typeof anime !== "undefined" && recomendaciones) {
  prepararTextoRecomendaciones();

  if ("IntersectionObserver" in window) {
    const observadorRecomendaciones = new IntersectionObserver(
      (entradas, observador) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          mostrarRecomendaciones();
          observador.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observadorRecomendaciones.observe(recomendaciones);
    imagenesRecomendaciones.forEach((imagen) => {
      observadorRecomendaciones.observe(imagen);
    });
  } else {
    mostrarRecomendaciones();
  }
}

const seccionFrase = document.querySelector(".seccion-frase");
const textoIntroduccionFrase = seccionFrase?.querySelectorAll(
  ".introduccion-frase > .eyebrow, .introduccion-frase > h2, .introduccion-frase > p:last-child"
);
const elementosIntroduccionFrase = Array.from(textoIntroduccionFrase || []);
const descripcionFrase = elementosIntroduccionFrase[2];
const opacidadOriginalDescripcionFrase = descripcionFrase?.style.opacity || "";

function prepararTextoFrase() {
  elementosIntroduccionFrase.slice(0, 2).forEach((elemento) => {
    const textoOriginal = elemento.textContent;
    const fragmento = document.createDocumentFragment();

    elemento.setAttribute("aria-label", textoOriginal);
    elemento.textContent = "";

    Array.from(textoOriginal).forEach((caracter) => {
      const letra = document.createElement("span");
      letra.textContent = caracter;
      letra.setAttribute("aria-hidden", "true");
      letra.style.opacity = "0";
      fragmento.appendChild(letra);
    });

    elemento.appendChild(fragmento);
  });

  if (descripcionFrase) {
    descripcionFrase.style.opacity = "0";
  }
}

function mostrarEscrituraFrase() {
  if (
    !textoIntroduccionFrase?.length ||
    movimientoReducido ||
    typeof anime === "undefined"
  ) {
    return;
  }

  try {
    const { animate, stagger } = anime;
    const bloques = [
      Array.from(elementosIntroduccionFrase[0].children),
      Array.from(elementosIntroduccionFrase[1].children)
    ];

    function animarBloque(indice) {
      if (indice === 2) {
        animate(descripcionFrase, {
          opacity: [0, 1],
          duration: 1200,
          ease: "out(3)"
        });
        return;
      }

      if (indice > 2) {
        return;
      }

      animate(bloques[indice], {
        opacity: [0, 1],
        delay: stagger(intervaloEntreCaracteres),
        duration: duracionPorCaracter,
        ease: "linear",
        onComplete: () => {
          window.setTimeout(() => animarBloque(indice + 1), pausaEntreBloques);
        }
      });
    }

    animarBloque(0);
  } catch (error) {
    textoIntroduccionFrase.forEach((elemento) => {
      elemento.textContent = elemento.getAttribute("aria-label") || elemento.textContent;
      elemento.removeAttribute("aria-label");
    });
    if (descripcionFrase) {
      descripcionFrase.style.opacity = opacidadOriginalDescripcionFrase;
    }
  }
}

if (!movimientoReducido && typeof anime !== "undefined" && seccionFrase) {
  prepararTextoFrase();

  if ("IntersectionObserver" in window) {
    const observadorFrase = new IntersectionObserver(
      (entradas, observador) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          mostrarEscrituraFrase();
          observador.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observadorFrase.observe(seccionFrase);
  } else {
    mostrarEscrituraFrase();
  }
}

function iniciarVaporCafe() {
  const canvas = document.getElementById("escena-cafe");
  const portada = document.getElementById("portada");

  if (!canvas || !portada) {
    return;
  }

  const contexto = canvas.getContext("2d");
  if (!contexto) {
    return;
  }

  const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particulasNiebla = Array.from({ length: 60 }, (_, indice) => ({
    origen: (indice % 5 - 2) * 7,
    fase: (indice * 0.173) % 1,
    velocidad: 0.62 + (indice % 6) * 0.055,
    altura: 58 + (indice % 7) * 12,
    radio: 3.5 + (indice % 5) * 1.4,
    deriva: 3 + (indice % 4) * 2,
    profundidad: 0.55 + (indice % 5) * 0.1
  }));

  let ancho = 1;
  let alto = 1;
  let visible = true;
  let frameId;

  function ajustarCanvas() {
    const rectangulo = portada.getBoundingClientRect();
    const escala = Math.min(window.devicePixelRatio || 1, 2);

    ancho = Math.max(1, Math.round(rectangulo.width));
    alto = Math.max(1, Math.round(rectangulo.height));
    canvas.width = Math.round(ancho * escala);
    canvas.height = Math.round(alto * escala);
    canvas.style.width = `${ancho}px`;
    canvas.style.height = `${alto}px`;
    contexto.setTransform(escala, 0, 0, escala, 0, 0);
  }

  function dibujarVapor(tiempo) {
    const baseX = ancho * (ancho <= 520 ? 0.82 : 0.67);
    const baseY = alto * 0.55;
    const tiempoSuave = movimientoReducido ? 0.5 : tiempo * 0.00012;

    contexto.clearRect(0, 0, ancho, alto);
    contexto.globalCompositeOperation = "screen";

    particulasNiebla.forEach((particula) => {
      const ciclo = (tiempoSuave * particula.velocidad + particula.fase) % 1;
      const progreso = ciclo * ciclo * (3 - 2 * ciclo);
      const x = baseX + particula.origen + (movimientoReducido ? 0 :
        Math.sin(tiempo * 0.00034 + particula.fase * 17) *
        (particula.deriva + progreso * 16));
      const y = baseY - progreso * particula.altura;
      const radio = particula.radio * (0.8 + progreso * 1.25) * particula.profundidad;
      const opacidad = (0.055 + particula.profundidad * 0.035) * Math.sin(Math.PI * ciclo);

      if (opacidad <= 0.002) {
        return;
      }

      contexto.save();
      contexto.translate(x, y);
      contexto.scale(1.15 + progreso * 0.4, 0.72 + progreso * 0.55);
      contexto.filter = "blur(1.5px)";

      const gradiente = contexto.createRadialGradient(0, 0, 0, 0, 0, radio * 3.2);
      gradiente.addColorStop(0, `rgba(255, 250, 238, ${opacidad})`);
      gradiente.addColorStop(0.3, `rgba(255, 247, 229, ${opacidad * 0.58})`);
      gradiente.addColorStop(0.72, `rgba(255, 247, 229, ${opacidad * 0.12})`);
      gradiente.addColorStop(1, "rgba(255, 247, 229, 0)");

      contexto.fillStyle = gradiente;
      contexto.beginPath();
      contexto.ellipse(0, 0, radio * 3.2, radio * 2.3, 0, 0, Math.PI * 2);
      contexto.fill();
      contexto.restore();
    });

    contexto.globalCompositeOperation = "source-over";
  }

  function animarVapor(tiempo) {
    if (visible) {
      dibujarVapor(tiempo);
    }
    if (!movimientoReducido) {
      frameId = window.requestAnimationFrame(animarVapor);
    }
  }

  canvas.style.position = "absolute";
  canvas.style.zIndex = "1";
  canvas.style.display = "block";
  canvas.style.visibility = "visible";
  canvas.style.opacity = "1";
  ajustarCanvas();
  window.addEventListener("resize", ajustarCanvas, { passive: true });

  if ("IntersectionObserver" in window) {
    const observador = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting;
    }, { threshold: 0.05 });
    observador.observe(portada);
  }

  animarVapor(0);
  window.addEventListener("pagehide", () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }
  }, { once: true });
}

iniciarVaporCafe();

