from typing import Optional, Dict, Literal
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class Macros(BaseModel):
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class TrackEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ts: str = Field(default_factory=lambda: datetime.now().isoformat())
    type: Literal["food", "water", "exercise"]
    meal: Optional[Literal["breakfast", "lunch", "dinner", "snack"]] = None
    name: Optional[str] = None
    qty: Optional[float] = None
    unit: Optional[str] = None
    kcal: Optional[float] = None
    macros: Optional[Macros] = None
    notes: Optional[str] = None