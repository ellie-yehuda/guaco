from abc import ABC, abstractmethod
from typing import List, Optional, TypeVar, Generic, Dict, Any

T = TypeVar('T')

class BaseRepository(ABC, Generic[T]):
    """Base repository interface defining common operations"""
    
    @abstractmethod
    async def create(self, item: T) -> str:
        """Create a new item and return its ID"""
        pass
    
    @abstractmethod
    async def get(self, id: str) -> Optional[T]:
        """Get an item by ID"""
        pass
    
    @abstractmethod
    async def list(self, filter_params: Dict[str, Any] = None) -> List[T]:
        """List items with optional filtering"""
        pass
    
    @abstractmethod
    async def update(self, id: str, item: T) -> bool:
        """Update an item by ID"""
        pass
    
    @abstractmethod
    async def delete(self, id: str) -> bool:
        """Delete an item by ID"""
        pass