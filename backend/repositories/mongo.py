from datetime import datetime
from typing import List, Optional, Dict, Any, TypeVar, Generic
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection
from bson import ObjectId
from pydantic import BaseModel

from .base import BaseRepository

T = TypeVar('T')

class MongoRepository(BaseRepository[T]):
    """Repository implementation using MongoDB with Motor"""
    
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection
    
    async def create(self, item: T) -> str:
        """Create a new item and return its ID"""
        # Convert item to dict
        item_dict = item.dict() if hasattr(item, "dict") else dict(item)
        
        # Add timestamps
        now = datetime.utcnow()
        item_dict["createdAt"] = now
        item_dict["updatedAt"] = now
        
        # Insert into MongoDB
        result = await self.collection.insert_one(item_dict)
        return str(result.inserted_id)
    
    async def get(self, id: str) -> Optional[Dict]:
        """Get an item by ID"""
        try:
            object_id = ObjectId(id)
            item = await self.collection.find_one({"_id": object_id})
            if item:
                # Convert ObjectId to string for serialization
                item["_id"] = str(item["_id"])
                return item
            return None
        except Exception:
            return None
    
    async def list(self, filter_params: Dict[str, Any] = None) -> List[Dict]:
        """List items with optional filtering"""
        filter_dict = filter_params or {}
        
        # Handle ObjectId conversion for _id if present
        if "_id" in filter_dict and isinstance(filter_dict["_id"], str):
            try:
                filter_dict["_id"] = ObjectId(filter_dict["_id"])
            except Exception:
                pass
        
        cursor = self.collection.find(filter_dict)
        items = await cursor.to_list(length=100)  # Limit to 100 items for safety
        
        # Convert ObjectId to string for each item
        for item in items:
            item["_id"] = str(item["_id"])
        
        return items
    
    async def update(self, id: str, item: T) -> bool:
        """Update an item by ID"""
        try:
            object_id = ObjectId(id)
            
            # Convert item to dict
            item_dict = item.dict() if hasattr(item, "dict") else dict(item)
            
            # Update timestamp and ensure we don't overwrite _id
            item_dict["updatedAt"] = datetime.utcnow()
            if "_id" in item_dict:
                del item_dict["_id"]
            
            result = await self.collection.update_one(
                {"_id": object_id},
                {"$set": item_dict}
            )
            
            return result.modified_count > 0
        except Exception:
            return False
    
    async def delete(self, id: str) -> bool:
        """Delete an item by ID"""
        try:
            object_id = ObjectId(id)
            result = await self.collection.delete_one({"_id": object_id})
            return result.deleted_count > 0
        except Exception:
            return False