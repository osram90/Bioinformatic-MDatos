from pydantic import BaseModel, Field, EmailStr
from typing import Literal, Optional
from datetime import datetime

Tier = Literal["bronze", "silver", "gold"]
Kind = Literal["docking", "molecular_dynamics", "hybrid"]
Status = Literal["queued", "provisioning", "running", "completed", "failed"]
OfferStatus = Literal["open", "reserved", "closed"]


class Plan(BaseModel):
    code: Tier
    display_name: str
    credits_per_session: int
    max_hourly_usd: float


class Wallet(BaseModel):
    user_email: EmailStr
    credits: int
    updated_at: datetime


class CreditTopupRequest(BaseModel):
    user_email: EmailStr
    credits: int = Field(gt=0, le=5000)


class LaunchExperimentRequest(BaseModel):
    user_email: EmailStr
    project_name: str = Field(min_length=3, max_length=120)
    tier: Tier
    kind: Kind
    pdb_url: Optional[str] = None
    sdf_url: Optional[str] = None


class ExperimentRecord(BaseModel):
    id: str
    user_email: EmailStr
    project_name: str
    tier: Tier
    kind: Kind
    status: Status
    created_at: datetime
    updated_at: datetime
    ask_contract_id: Optional[int] = None
    instance_id: Optional[int] = None
    estimated_cost_usd: Optional[float] = None
    credits_reserved: int = 0
    rented_offer_id: Optional[str] = None


class CompleteExperimentRequest(BaseModel):
    artifact_key: str


class SignedUrlResponse(BaseModel):
    download_url: str
    expires_at: datetime


class CreateSpaceRequest(BaseModel):
    owner_email: EmailStr
    label: str = Field(min_length=3, max_length=120)
    location: str = Field(min_length=2, max_length=80)
    total_gpu_units: int = Field(gt=0, le=500)
    total_cpu_units: int = Field(gt=0, le=5000)
    total_ram_gb: int = Field(gt=0, le=20000)


class SpaceRecord(BaseModel):
    id: str
    owner_email: EmailStr
    label: str
    location: str
    total_gpu_units: int
    total_cpu_units: int
    total_ram_gb: int
    created_at: datetime
    updated_at: datetime


class CreateCapacityOfferRequest(BaseModel):
    space_id: str
    seller_email: EmailStr
    kind: Kind
    gpu_units: int = Field(gt=0, le=64)
    cpu_units: int = Field(gt=0, le=512)
    ram_gb: int = Field(gt=0, le=2048)
    price_usd_hour: float = Field(gt=0, le=20)


class CapacityOfferRecord(BaseModel):
    id: str
    space_id: str
    seller_email: EmailStr
    kind: Kind
    gpu_units: int
    cpu_units: int
    ram_gb: int
    price_usd_hour: float
    status: OfferStatus
    reserved_for_experiment_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
