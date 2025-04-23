import { useState, useEffect, useCallback } from 'react';
import { MapMarker } from "../types/map";
import { useLocation } from "./useLocation";

interface UseMapMarkersProps {
  searchRadius?: number;
  searchQuery?: string;
}

export const useMapMarkers = ({ searchRadius = 5, searchQuery = '' }: UseMapMarkersProps = {}) => {
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { location } = useLocation();
  
  // Fetch markers based on location
  const fetchMarkers = useCallback(async () => {
    if (!location) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, using mock data that depends on the current location
      const mockMarkers: MapMarker[] = [
        // Mock data generation using location as seed
      ];
      
      setMarkers(mockMarkers);
      // Initially set filtered markers to all markers
      setFilteredMarkers(mockMarkers);
    } catch (error) {
      setError('Failed to load markers');
      console.error('Error fetching markers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [location]);
  
  // Filter markers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMarkers(markers);
      return;
    }
    
    const filtered = markers.filter(marker => 
      marker.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      marker.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredMarkers(filtered);
  }, [markers, searchQuery]);
  
  // Load markers when location changes
  useEffect(() => {
    if (location) {
      fetchMarkers();
    }
  }, [location, fetchMarkers]);
  
  // Select a marker
  const selectMarker = useCallback((marker: MapMarker | null) => {
    setSelectedMarker(marker);
  }, []);
  
  // Add a new marker
  const addMarker = useCallback((newMarker: MapMarker) => {
    setMarkers(prevMarkers => {
      const updatedMarkers = [...prevMarkers, newMarker];
      setFilteredMarkers(updatedMarkers);
      return updatedMarkers;
    });
  }, []);
  
  return {
    markers,
    filteredMarkers,
    selectedMarker,
    isLoading,
    error,
    selectMarker,
    addMarker,
    refreshMarkers: fetchMarkers
  };
};