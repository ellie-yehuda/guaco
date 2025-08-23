from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from datetime import datetime, date
from models.track_event import TrackEvent
from repositories.factory import get_repository


router = APIRouter(
    prefix="/api/track",
    tags=["track"],
)

@router.get("/", response_model=List[TrackEvent])
async def get_track_events(date: str = Query(..., description="Date in YYYY-MM-DD format")):
    """
    Get all tracking events for a specific date.
    """
    try:
        # Parse and validate the date
        parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
        
        # Get repository
        repo = get_repository("track_events")
        
        # Get all events
        all_events = await repo.get_all()
        
        # Filter events by date
        filtered_events = [
            event for event in all_events 
            if datetime.fromisoformat(event["ts"]).date() == parsed_date
        ]
        
        return filtered_events
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=TrackEvent)
async def create_track_event(event: TrackEvent):
    """
    Create a new tracking event.
    """
    try:
        # Get repository
        repo = get_repository("track_events")
        
        # Create event
        created_event = await repo.create(event.dict())
        
        return created_event
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{event_id}", response_model=TrackEvent)
async def get_track_event(event_id: str):
    """
    Get a specific tracking event by ID.
    """
    try:
        # Get repository
        repo = get_repository("track_events")
        
        # Get event
        event = await repo.get_by_id(event_id)
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return event
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{event_id}", response_model=TrackEvent)
async def update_track_event(event_id: str, event_update: TrackEvent):
    """
    Update a specific tracking event.
    """
    try:
        # Get repository
        repo = get_repository("track_events")
        
        # Check if event exists
        existing_event = await repo.get_by_id(event_id)
        if not existing_event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Update event
        updated_event = await repo.update(event_id, event_update.dict())
        
        return updated_event
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{event_id}")
async def delete_track_event(event_id: str):
    """
    Delete a specific tracking event.
    """
    try:
        # Get repository
        repo = get_repository("track_events")
        
        # Check if event exists
        existing_event = await repo.get_by_id(event_id)
        if not existing_event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Delete event
        await repo.delete(event_id)
        
        return {"message": "Event deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))