from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseModel):
    app_name: str = "MDatos.ai Orchestrator"
    vast_ai_api_key: str = os.getenv("VAST_AI_API_KEY", "")
    results_bucket: str = os.getenv("RESULTS_BUCKET", "mdatos-results")
    signed_url_ttl_seconds: int = int(os.getenv("SIGNED_URL_TTL_SECONDS", "1800"))


settings = Settings()
