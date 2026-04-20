# MDatos-Bioinformatica Web

Frontend del portal MDatos-Bioinformatica construido con **React + Vite**.

## ¿Qué se puede hacer ya?

- Mostrar oferta comercial (Docking + Dinámica Molecular + Asesoría I+D).
- Captar leads con formulario web.
- Presentar arquitectura de laboratorio privado (contenedor + Jupyter + cómputo arrendado).
- Usar un estimador inicial de costo de infraestructura para preventa.

## ¿Qué falta para acceso directo al servicio computacional?

Este repo ya incluye la UI/flujo de negocio, pero faltan componentes backend para operación automática:

1. API backend (auth + creación de sesiones).
2. Integración con proveedor de cómputo (ej. Vast.ai) para provisionar contenedores.
3. Exposición segura de URL de Jupyter/UI por cliente.
4. Monitoreo de ejecución y cierre de instancias por tiempo.

## Stack

- React 18
- Vite 5
- CSS custom (sin framework UI)
- Deploy automático a GitHub Pages por GitHub Actions
- Deploy opcional en Vercel

## Estructura

- `src/App.jsx`: landing + infraestructura + formulario + interfaz demo de laboratorio.
- `src/main.jsx`: bootstrap de React.
- `src/styles.css`: estilos globales/responsivos.
- `public/`: assets estáticos (`favicon.svg`, `robots.txt`, `sitemap.xml`).
- `.github/workflows/deploy-pages.yml`: build + publish de `dist/` a Pages.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`

## Build de producción

```bash
npm run build
npm run preview
```

## Configurar formulario real

Crear `.env` local con:

```bash
VITE_FORM_ENDPOINT=https://formspree.io/f/tu_form_id
```

Sin esa variable, el sitio mostrará aviso y abrirá `mailto:` como respaldo.

## Publicación en GitHub Pages

1. En el repo, ve a **Settings > Pages**.
2. En **Source**, selecciona **GitHub Actions**.
3. Haz push a `main`.
4. El workflow compila (`npm ci`, `npm run build`) y publica `dist/`.

URL esperada:

- `https://osram90.github.io/Bioinformatic-MDatos/`

## Publicación en Vercel

1. Importa el repo en Vercel.
2. Framework detectado: **Vite**.
3. Define `VITE_FORM_ENDPOINT` en Environment Variables.
4. Deploy.

## Configuración importante

- `vite.config.js` usa `base: '/Bioinformatic-MDatos/'` para que GitHub Pages cargue assets correctamente.
