# MDatos.ai – MVP Operativo (Frontend + Backend)

Este repo está alineado a la idea original de plataforma SaaS/PaaS:

- Cobro previo por créditos (wallet)
- Ejecución automatizada por tier/workload
- Entrega de resultados por URL firmada temporal

## Qué incluye hoy

### Frontend (Vite + React)
- Landing comercial.
- Sección **Mi Laboratorio** con:
  - Wallet de créditos + recarga.
  - Lanzamiento de experimento (tier + kind).
  - Histórico de corridas con estado y créditos reservados.

### Backend (FastAPI)
- `GET /api/plans` → planes Bronze/Plata/Oro.
- `GET /api/wallet/{user_email}` → wallet por usuario.
- `POST /api/wallet/topup` → recarga de créditos.
- `POST /api/infra/spaces` → registra un espacio de cómputo para renta.
- `GET /api/infra/spaces` → lista espacios disponibles.
- `POST /api/infra/capacity-offers` → publica subrenta de capacidad por workload.
- `GET /api/infra/capacity-offers` → marketplace open de subrenta.
- `POST /api/lab/experiments` → lanza experimento (descuenta créditos).
- `GET /api/lab/experiments` → histórico.
- `POST /api/lab/experiments/{id}/complete` → marca como completado.
- `POST /api/lab/experiments/{id}/download-url` → signed URL temporal (simulada).

> Nota: la integración real con Vast.ai, DB persistente y storage real está preparada como siguiente fase.

---

## Ejecutar localmente (PowerShell)

### 1) Backend

```powershell
cd I:\MDATOS2.0\Bioinformatic-MDatos\backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Prueba salud:
- `http://127.0.0.1:8001/health`

### 2) Frontend

En otra terminal:

```powershell
cd I:\MDATOS2.0\Bioinformatic-MDatos
npm install
$env:VITE_API_BASE_URL="http://127.0.0.1:8001"
npm run dev
```

Abre:
- `http://localhost:5173`

---

## Variables de entorno

`.env.example` incluye:
- `VITE_API_BASE_URL`
- `VAST_AI_API_KEY`
- `RESULTS_BUCKET`
- `SIGNED_URL_TTL_SECONDS`

---

## Siguiente fase (para producción)

1. Persistencia real (Postgres + SQLAlchemy/Alembic) para wallet + mercado.
2. Integración real Vast.ai (`search/create/show/destroy`) y proveedores alternos.
3. Motor de matching para renta/subrenta con políticas de margen.
4. Worker para polling + teardown automático + facturación por uso real.
5. Upload real a S3/B2 + signed URLs reales + conciliación contable.
