import os
from pydantic import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    """
    Application settings.
    """
    # API settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Pattern Music Studio API"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development_secret_key")
    
    # Database settings (for future use)
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()