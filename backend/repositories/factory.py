import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict, Any, Optional

from .base import BaseRepository
from .local_json import LocalJsonRepository
from .mongo import MongoRepository

class RepositoryFactory:
    """Factory to create appropriate repository instances based on configuration"""
    
    def __init__(self):
        self.mongo_client = None
        self.mongo_db = None
        self.use_mongo = os.environ.get("USE_MONGO", "false").lower() == "true"
        self.mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
        self.mongo_db_name = os.environ.get("MONGO_DB", "guaco_recipes")
        
        # Initialize MongoDB connection if enabled
        if self.use_mongo:
            self._init_mongo()
    
    def _init_mongo(self):
        """Initialize MongoDB connection"""
        try:
            self.mongo_client = AsyncIOMotorClient(self.mongo_uri)
            self.mongo_db = self.mongo_client[self.mongo_db_name]
            print(f"Connected to MongoDB: {self.mongo_db_name}")
        except Exception as e:
            print(f"Failed to connect to MongoDB: {str(e)}")
            self.use_mongo = False
    
    def get_repository(self, collection_name: str) -> BaseRepository:
        """Get appropriate repository implementation based on configuration"""
        if self.use_mongo and self.mongo_db:
            collection = self.mongo_db[collection_name]
            return MongoRepository(collection)
        else:
            return LocalJsonRepository(collection_name)

# Singleton factory instance
repository_factory = RepositoryFactory()

def get_repository(collection_name: str) -> BaseRepository:
    """Convenience function to get a repository for a collection"""
    return repository_factory.get_repository(collection_name)