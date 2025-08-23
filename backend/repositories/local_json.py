import json
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any, TypeVar, Generic
from pathlib import Path

from .base import BaseRepository

T = TypeVar('T')

class LocalJsonRepository(BaseRepository[T]):
    """Repository implementation that stores data in local JSON files"""
    
    def __init__(self, collection_name: str, data_dir: str = "data"):
        self.collection_name = collection_name
        self.data_dir = Path(data_dir)
        self.data_file = self.data_dir / f"{collection_name}.json"
        self._ensure_data_file()
    
    def _ensure_data_file(self):
        """Ensure the data directory and file exist"""
        self.data_dir.mkdir(exist_ok=True, parents=True)
        if not self.data_file.exists():
            with open(self.data_file, "w") as f:
                json.dump([], f)
    
    async def _read_data(self) -> List[Dict]:
        """Read all data from the JSON file"""
        try:
            with open(self.data_file, "r") as f:
                data = json.load(f)
                # Ensure data is always a list
                if isinstance(data, list):
                    return data
                else:
                    print(f"Warning: Expected list in {self.data_file}, but got {type(data)}. Creating empty list.")
                    return []
        except (json.JSONDecodeError, FileNotFoundError) as e:
            print(f"Error reading data file {self.data_file}: {str(e)}. Creating empty list.")
            self._ensure_data_file()
            return []
    
    async def _write_data(self, data: List[Dict]):
        """Write data to the JSON file"""
        with open(self.data_file, "w") as f:
            json.dump(data, f, indent=2, default=str)
    
    async def create(self, item: T) -> str:
        """Create a new item and return its ID"""
        data = await self._read_data()
        
        # Convert item to dict and add metadata
        item_dict = item.dict() if hasattr(item, "dict") else dict(item)
        item_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        item_dict["_id"] = item_id
        item_dict["createdAt"] = now
        item_dict["updatedAt"] = now
        
        data.append(item_dict)
        await self._write_data(data)
        return item_id
    
    async def get(self, id: str) -> Optional[Dict]:
        """Get an item by ID"""
        data = await self._read_data()
        for item in data:
            if item.get("_id") == id:
                return item
        return None
    
    async def list(self, filter_params: Dict[str, Any] = None) -> List[Dict]:
        """List items with optional filtering"""
        data = await self._read_data()
        
        if not filter_params:
            return data
        
        # Apply filters
        filtered_data = []
        for item in data:
            match = True
            for key, value in filter_params.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                filtered_data.append(item)
        
        return filtered_data
    
    async def update(self, id: str, item: T) -> bool:
        """Update an item by ID"""
        data = await self._read_data()
        
        for i, existing in enumerate(data):
            if existing.get("_id") == id:
                # Convert item to dict and preserve metadata
                item_dict = item.dict() if hasattr(item, "dict") else dict(item)
                item_dict["_id"] = id
                item_dict["createdAt"] = existing.get("createdAt", datetime.utcnow())
                item_dict["updatedAt"] = datetime.utcnow()
                
                data[i] = item_dict
                await self._write_data(data)
                return True
        
        return False
    
    async def delete(self, id: str) -> bool:
        """Delete an item by ID"""
        data = await self._read_data()
        initial_length = len(data)
        
        filtered_data = [item for item in data if item.get("_id") != id]
        
        if len(filtered_data) < initial_length:
            await self._write_data(filtered_data)
            return True
        
        return False