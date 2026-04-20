from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import (
    CapacityOfferRecord,
    LaunchExperimentRequest,
    ExperimentRecord,
    CompleteExperimentRequest,
    SignedUrlResponse,
    Plan,
    Wallet,
    CreditTopupRequest,
    CreateSpaceRequest,
    SpaceRecord,
    CreateCapacityOfferRequest,
)
from app.services.orchestrator import OrchestratorService

app = FastAPI(title=settings.app_name)
service = OrchestratorService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": settings.app_name}


@app.get("/api/plans", response_model=list[Plan])
def list_plans() -> list[Plan]:
    return service.list_plans()


@app.get("/api/wallet/{user_email}", response_model=Wallet)
def get_wallet(user_email: str) -> Wallet:
    return service.get_wallet(user_email)


@app.post("/api/wallet/topup", response_model=Wallet)
def topup_wallet(payload: CreditTopupRequest) -> Wallet:
    return service.topup_wallet(payload.user_email, payload.credits)


@app.post("/api/infra/spaces", response_model=SpaceRecord)
def create_space(payload: CreateSpaceRequest) -> SpaceRecord:
    return service.create_space(payload)


@app.get("/api/infra/spaces", response_model=list[SpaceRecord])
def list_spaces() -> list[SpaceRecord]:
    return service.list_spaces()


@app.post("/api/infra/capacity-offers", response_model=CapacityOfferRecord)
def create_capacity_offer(payload: CreateCapacityOfferRequest) -> CapacityOfferRecord:
    return service.publish_capacity_offer(payload)


@app.get("/api/infra/capacity-offers", response_model=list[CapacityOfferRecord])
def list_capacity_offers(kind: str | None = None) -> list[CapacityOfferRecord]:
    return service.list_capacity_offers(kind=kind)


@app.post("/api/lab/experiments", response_model=ExperimentRecord)
def launch_experiment(payload: LaunchExperimentRequest) -> ExperimentRecord:
    return service.launch_experiment(payload)


@app.get("/api/lab/experiments", response_model=list[ExperimentRecord])
def list_experiments() -> list[ExperimentRecord]:
    return service.list_experiments()


@app.post("/api/lab/experiments/{experiment_id}/complete", response_model=ExperimentRecord)
def complete_experiment(experiment_id: str, payload: CompleteExperimentRequest) -> ExperimentRecord:
    try:
        return service.mark_completed(experiment_id, payload.artifact_key)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Experiment not found") from exc


@app.post("/api/lab/experiments/{experiment_id}/download-url", response_model=SignedUrlResponse)
def get_download_url(experiment_id: str) -> SignedUrlResponse:
    try:
        url, expires = service.generate_signed_url(experiment_id)
        return SignedUrlResponse(download_url=url, expires_at=expires)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Experiment not found") from exc
