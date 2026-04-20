from __future__ import annotations

from datetime import datetime, timedelta, UTC
from uuid import uuid4
from typing import Dict, List

from fastapi import HTTPException

from app.schemas import LaunchExperimentRequest, ExperimentRecord, Plan, Wallet
from app.config import settings


PLANS: Dict[str, Plan] = {
    "bronze": Plan(code="bronze", display_name="Bronze", credits_per_session=20, max_hourly_usd=0.45),
    "silver": Plan(code="silver", display_name="Plata", credits_per_session=60, max_hourly_usd=0.95),
    "gold": Plan(code="gold", display_name="Oro", credits_per_session=120, max_hourly_usd=1.8),
}

# Simulación de ofertas base por workload. En producción se obtiene de Vast.ai search.
KIND_MULTIPLIER = {
    "docking": 0.8,
    "molecular_dynamics": 1.2,
    "hybrid": 1.0,
}


class OrchestratorService:
    def __init__(self) -> None:
        self._experiments: Dict[str, ExperimentRecord] = {}
        self._artifacts: Dict[str, str] = {}
        self._wallets: Dict[str, Wallet] = {}

    def list_plans(self) -> List[Plan]:
        return list(PLANS.values())

    def get_wallet(self, user_email: str) -> Wallet:
        wallet = self._wallets.get(user_email)
        if not wallet:
            wallet = Wallet(user_email=user_email, credits=0, updated_at=datetime.now(UTC))
            self._wallets[user_email] = wallet
        return wallet

    def topup_wallet(self, user_email: str, credits: int) -> Wallet:
        wallet = self.get_wallet(user_email)
        wallet.credits += credits
        wallet.updated_at = datetime.now(UTC)
        self._wallets[user_email] = wallet
        return wallet

    def _estimate_cost(self, tier: str, kind: str) -> float:
        plan = PLANS[tier]
        return round(plan.max_hourly_usd * KIND_MULTIPLIER[kind], 4)

    def launch_experiment(self, payload: LaunchExperimentRequest) -> ExperimentRecord:
        plan = PLANS[payload.tier]
        wallet = self.get_wallet(payload.user_email)

        if wallet.credits < plan.credits_per_session:
            raise HTTPException(
                status_code=402,
                detail=f"Créditos insuficientes. Requiere {plan.credits_per_session}, disponibles {wallet.credits}.",
            )

        wallet.credits -= plan.credits_per_session
        wallet.updated_at = datetime.now(UTC)
        self._wallets[payload.user_email] = wallet

        now = datetime.now(UTC)
        exp_id = str(uuid4())
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
            estimated_cost_usd=self._estimate_cost(payload.tier, payload.kind),
            credits_reserved=plan.credits_per_session,
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
