# Impulsa

Landing + diagnóstico personalizado + apps de soporte para mujeres y parejas en edad reproductiva que quieren tener hijos pero algo las frena: plata, salud, tiempo.

**Sitio en producción**: https://juan-weld.vercel.app

---

## Estructura

```
juan/
├── index.html               Landing principal con quiz + drawers + modal
├── ciclo-impulsa.html       App de control de ciclo menstrual
├── simulador-impulsa.html   Calculadora de costos de crianza (42 meses)
├── privacy.html             Política de privacidad
├── terms.html               Términos y condiciones
├── hero-mujer.webp          Imagen del hero
├── robots.txt + sitemap.xml SEO
└── content/                 ← Single source of truth para iterar contenido
    ├── quiz.json            9 preguntas del diagnóstico
    ├── profiles.json        11 perfiles terminales + plan personalizado
    ├── tools.json           6 pilares + sub-recursos
    ├── explanations.json    71 frases para personalizar el "por qué" del PDF
    └── eventos.json         Calendar de webinars y encuentros
```

---

## Cómo iterar el contenido sin tocar código

Toda la copy del quiz, los perfiles, los pilares y los eventos vive en JSONs bajo `/content/`. **Editás el JSON, hacés deploy, y el sitio toma los cambios** sin que nadie tenga que tocar HTML/JS.

### Casos comunes

**1. Cambiar el copy de una pregunta del quiz**
- Archivo: `content/quiz.json`
- Buscar el `id` de la pregunta (p1, p2a, etc.)
- Editar `title`, `subtitle`, `options[].label` o `options[].sub`

**2. Reescribir el diagnóstico o plan de un perfil**
- Archivo: `content/profiles.json`
- Buscar el `key` del perfil (ej. `duda_identidad`, `impedido_fertilidad`)
- Editar:
  - `nombre` (cómo se llama el perfil)
  - `headline` (frase de validación grande)
  - `diagnostico_extendido` (~180 palabras — lo que va en P1 del PDF)
  - `pasos[]` (5-7 acciones — lo que va en P2 del PDF)
  - `kit[]` (recomendaciones — lo que va en P3 del PDF)

**3. Agregar/cambiar un sub-recurso de un pilar**
- Archivo: `content/tools.json`
- Buscar el `tool_id` (psicologia_perinatal, orientacion_financiera, etc.)
- Editar `subrecursos[]`. Cada item:
  - `label`: nombre visible
  - `descripcion`: 1 línea
  - `estado`: `"disponible"` (chip verde) o `"proximamente"` (chip gris)
  - `url`: opcional, link externo (Calendly, PDF, etc.) — solo se usa si `estado` es `"disponible"`
  - `cta`: texto del botón ("Reservar", "Descargar", "Anotarme")

**4. Sumar un evento al calendar**
- Archivo: `content/eventos.json`
- Agregar un item a `eventos[]`:
  - `id`: único
  - `tool_id`: a qué pilar pertenece (aparece en el drawer de ese pilar)
  - `titulo`, `descripcion`, `fecha_iso` (formato YYYY-MM-DD HH:mm), `fecha_label` (texto amigable)
  - `modalidad`: `"online"` | `"presencial"` | `"hibrido"`
  - `estado`: `"disponible"` o `"proximamente"`
- Los eventos con fecha pasada se filtran automáticamente

**5. Cambiar el "por qué te recomendamos esto" del PDF**
- Archivo: `content/explanations.json`
- Cada respuesta del quiz tiene su frase humana. Si cambiás la frase, todos los perfiles que la referencien la van a usar automáticamente.

---

## Cómo deployar cambios

El sitio está en Vercel, conectado a este repo de GitHub. Cada push a `main` dispara un deploy automático.

```bash
git add .
git commit -m "actualizo copy del perfil duda_identidad"
git push
```

Vercel detecta el push y deploya solo. En 30-60 segundos el cambio está en producción.

Para preview de un cambio sin tocar producción: hacer push a una rama, Vercel genera una URL preview.

---

## Stack

- HTML / CSS / JS vanilla en archivos sueltos (sin frameworks)
- Fonts: Fraunces (display serif) + Nunito (body sans) — Google Fonts
- jsPDF para generar el PDF del diagnóstico client-side
- Apps de ciclo y simulador usan Playfair Display + DM Sans (decisión de diseño)
- Sin backend — los leads se guardan en `localStorage` del browser. (Migrar a backend pendiente)

## Apps externas linkeadas

- `/ciclo-impulsa.html` — tracker de ciclo menstrual con SVG ring, calendario y registro diario
- `/simulador-impulsa.html` — calculadora de costos de crianza para 42 meses (embarazo + 3 años) con 80+ items × 3 niveles económicos

Ambas son standalone — se pueden iterar independientemente.

## Pendientes conocidos

- Conectar backend para que los leads no queden solo en localStorage (Web3Forms / Formspree / serverless propio)
- Producir Calendly links reales para reservas 1:1 (cambiar `estado: "proximamente"` → `"disponible"` con `url`)
- Producir libros/PDFs descargables y subirlos a `/recursos/`
- Tier 4: email automático con el PDF adjunto
