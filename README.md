# MDatos-Bioinformatica (Landing inicial)

Portal inicial profesional para presentar servicios de **Molecular Docking** y **Dinámica Molecular** con enfoque científico + startup.

## Estructura

- `index.html`: contenido del portal.
- `styles.css`: estilos visuales responsivos.
- `script.js`: menú móvil y año dinámico del footer.

## Ejecutar localmente

```bash
python3 -m http.server 8000
```

Abrir: `http://localhost:8000`

## Despliegue temporal en Vercel (recomendado)

1. Crear cuenta en Vercel y conectar GitHub.
2. Importar este repositorio.
3. Framework preset: **Other** / static.
4. Deploy.

## Despliegue en GitHub Pages

1. Ir a `Settings > Pages`.
2. En **Build and deployment**, seleccionar `Deploy from a branch`.
3. Elegir rama `main` (o la rama activa) y carpeta `/root`.
4. Guardar y esperar publicación.

## Nota de formulario

En `index.html`, actualiza el `action` del formulario:

```html
<form action="https://formspree.io/f/your-form-id" method="POST">
```

Reemplaza `your-form-id` con tu endpoint real.
