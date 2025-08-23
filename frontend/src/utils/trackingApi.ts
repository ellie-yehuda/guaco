import { API_BASE_URL } from './api';

export type TrackEvent = {
  id: string;
  ts: string;
  type: 'food' | 'water' | 'exercise';
  meal?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name?: string;
  qty?: number;
  unit?: string;
  kcal?: number;
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  notes?: string;
};

export type NewTrackEvent = Omit<TrackEvent, 'id' | 'ts'>;

/**
 * Get tracking events for a specific date
 */
export const getTrackEvents = async (date: string): Promise<TrackEvent[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/track?date=${date}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tracking events: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tracking events:', error);
    return [];
  }
};

/**
 * Create a new tracking event
 */
export const createTrackEvent = async (event: NewTrackEvent): Promise<TrackEvent | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create tracking event: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating tracking event:', error);
    return null;
  }
};

/**
 * Update an existing tracking event
 */
export const updateTrackEvent = async (id: string, event: NewTrackEvent): Promise<TrackEvent | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/track/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update tracking event: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating tracking event:', error);
    return null;
  }
};

/**
 * Delete a tracking event
 */
export const deleteTrackEvent = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/track/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete tracking event: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting tracking event:', error);
    return false;
  }
};