# MDatos-Bioinformatica Web

Frontend del portal MDatos-Bioinformatica construido con **React + Vite**.

## Paso a paso: qué se hizo en este proyecto

1. Se creó la base del frontend con React + Vite.
2. Se definió una narrativa comercial para servicios de Docking y Dinámica Molecular.
3. Se implementó formulario de captación de leads con endpoint configurable (`VITE_FORM_ENDPOINT`).
4. Se agregó una interfaz demo para laboratorio (Portal Lab) y estimador de infraestructura.
5. Se integró pipeline de despliegue para GitHub Pages y configuración para Vercel.
6. Se mejoró estética con detalles sutiles (fondos, hover, jerarquía visual) orientados a cliente final.

## Estado actual del proyecto

### Ya funciona
- Landing comercial lista para presentar servicios.
- Captura de leads vía formulario (cuando configuras endpoint).
- Secciones de beneficios, planes y flujo de infraestructura privada.
- Interfaz demo para estimar cómputo de laboratorio.

### Falta para operación completa de laboratorio
1. API backend (auth + creación de sesiones por cliente).
2. Integración real con proveedor de cómputo (ej. Vast.ai).
3. Provisionar contenedor con UI + Jupyter automáticamente.
4. Exponer URL segura por cliente y cerrar instancias al terminar.

## Cómo ver el frontend (local)

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
