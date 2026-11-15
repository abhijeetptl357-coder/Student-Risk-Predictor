"""
Entrypoint alias for running with:
    uvicorn backend.main:app --reload
"""
try:
    from backend.app import app
except ModuleNotFoundError:
    from app import app

__all__ = ["app"]

