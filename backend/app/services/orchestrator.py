from __future__ import annotations

from datetime import datetime, timedelta, UTC
from uuid import uuid4
from typing import Dict, List

from app.schemas import LaunchExperimentRequest, ExperimentRecord
from app.config import settings


RATES = {
    "bronze": 0.35,
    "silver": 0.95,
    "gold": 1.80,
}


class OrchestratorService:
    def __init__(self) -> None:
        self._experiments: Dict[str, ExperimentRecord] = {}
        self._artifacts: Dict[str, str] = {}

    def launch_experiment(self, payload: LaunchExperimentRequest) -> ExperimentRecord:
        now = datetime.now(UTC)
        exp_id = str(uuid4())

        # En producción aquí se valida wallet/créditos, luego search/create en Vast.ai.
        # Dejamos ids simulados para el flujo operativo completo del front.
        fake_ask_contract_id = int(str(uuid4().int)[:8])
        fake_instance_id = int(str(uuid4().int)[:7])

        record = ExperimentRecord(
            id=exp_id,
            user_email=payload.user_email,
            project_name=payload.project_name,
            tier=payload.tier,
            kind=payload.kind,
            status="running",
            created_at=now,
            updated_at=now,
            ask_contract_id=fake_ask_contract_id,
            instance_id=fake_instance_id,
            estimated_cost_usd=RATES[payload.tier],
        )
        self._experiments[exp_id] = record
        return record

    def list_experiments(self) -> List[ExperimentRecord]:
        return sorted(self._experiments.values(), key=lambda x: x.created_at, reverse=True)

    def mark_completed(self, experiment_id: str, artifact_key: str) -> ExperimentRecord:
        record = self._experiments[experiment_id]
        record.status = "completed"
        record.updated_at = datetime.now(UTC)
        self._artifacts[experiment_id] = artifact_key
        self._experiments[experiment_id] = record
        return record

    def generate_signed_url(self, experiment_id: str) -> tuple[str, datetime]:
        expires_at = datetime.now(UTC) + timedelta(seconds=settings.signed_url_ttl_seconds)
        artifact_key = self._artifacts.get(experiment_id, f"{experiment_id}/results.zip")
        token = str(uuid4())
        url = (
            f"https://download.mdatos.ai/{settings.results_bucket}/{artifact_key}"
            f"?token={token}&expires={int(expires_at.timestamp())}"
        )
        return url, expires_at
