from pydantic import BaseModel, Field, EmailStr
from typing import Literal, Optional
from datetime import datetime

Tier = Literal["bronze", "silver", "gold"]
Kind = Literal["docking", "molecular_dynamics", "hybrid"]
Status = Literal["queued", "provisioning", "running", "completed", "failed"]


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


class CompleteExperimentRequest(BaseModel):
    artifact_key: str


class SignedUrlResponse(BaseModel):
    download_url: str
    expires_at: datetime
