# MDatos.ai – Frontend + Orquestador Backend (MVP Operativo)

Este repositorio ahora incluye:

1. **Frontend web** para marketing + sección **Mi Laboratorio**.
2. **Backend FastAPI** con endpoints de orquestación MVP para lanzar/listar/completar experimentos y generar URLs firmadas simuladas.

> Objetivo: avanzar hacia la idea original de plataforma SaaS/PaaS que cobre primero, orqueste cómputo dinámico y entregue resultados finales sin fricción para el cliente.

---

## Arquitectura MVP incluida

### Frontend (`src/`)
- Landing de servicios.
- Formulario de lanzamiento de experimento (tier + tipo de workload).
- Historial de experimentos con estado.
- Botón de descarga por URL firmada temporal.

### Backend (`backend/app/`)
- `POST /api/lab/experiments` → crea experimento y simula lease/provider ids.
- `GET /api/lab/experiments` → histórico.
- `POST /api/lab/experiments/{id}/complete` → marca como completado.
- `POST /api/lab/experiments/{id}/download-url` → URL firmada temporal (simulada).

---

## Ejecución local paso a paso

### 1) Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Healthcheck:

```bash
curl http://localhost:8001/health
```

### 2) Frontend

```bash
npm install
npm run dev
```

Asegúrate de que `VITE_API_BASE_URL` apunte a `http://localhost:8001`.

---

## Variables de entorno

Copia `.env.example` y ajusta:

- `VITE_API_BASE_URL`
- `VAST_AI_API_KEY`
- `RESULTS_BUCKET`
- `SIGNED_URL_TTL_SECONDS`

---

## Qué queda para producción

1. Conectar backend a DB real (Postgres + SQLAlchemy/Alembic).
2. Integrar llamadas reales a Vast.ai (search/create/show/destroy).
3. Worker asíncrono para polling de jobs y destrucción automática.
4. Integrar S3/B2 real para artefactos y signed URLs reales.
5. Integrar cobros y wallet/ledger antes de gastar cómputo.

