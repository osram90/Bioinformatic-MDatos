# MDatos-Bioinformatica — Portal inicial profesional

Portal inicial para presentar servicios de **Molecular Docking** y **Dinámica Molecular** con despliegue automático en **GitHub Pages** y opción en **Vercel**.

## 1) Estructura del proyecto

- `index.html` → contenido principal del portal.
- `styles.css` → diseño responsivo y estilos.
- `script.js` → interacción de menú + scroll suave + año dinámico.
- `favicon.svg` → favicon del sitio.
- `robots.txt` y `sitemap.xml` → SEO básico.
- `.github/workflows/deploy-pages.yml` → despliegue automático a GitHub Pages.
- `vercel.json` → configuración para Vercel.

## 2) Probar localmente

```bash
cd Bioinformatic-MDatos
python3 -m http.server 8000 --bind 127.0.0.1
```

Abrir en navegador: `http://127.0.0.1:8000`

## 3) Publicar en GitHub Pages (automático)

### Requisitos
- Repositorio en GitHub.
- Rama principal `main`.

### Pasos
1. Sube los cambios a `main`.
2. En GitHub abre: `Settings > Pages`.
3. En **Source**, elige **GitHub Actions**.
4. Al hacer push a `main`, se ejecuta el workflow `.github/workflows/deploy-pages.yml`.
5. URL esperada:
   - `https://osram90.github.io/Bioinformatic-MDatos/`

## 4) Publicar en Vercel

1. Importa el repo desde Vercel.
2. Framework preset: **Other**.
3. Deploy.

`vercel.json` ya incluye headers básicos.

## 5) Activar formulario de contacto

Actualmente el formulario usa placeholder:

```html
<form class="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
```

Reemplaza `your-form-id` por tu endpoint real (Formspree u otro proveedor).

## 6) Personalización rápida

- Cambiar correo de contacto en `index.html` (`contacto@mdatos.bio`).
- Cambiar URL canónica y OpenGraph en `index.html` cuando tengas dominio propio.
- Si agregas dominio, opcionalmente crea `CNAME`.
