// src/components/maps/MapViewComponent.tsx
import React, { useRef, useState, useCallback, memo, forwardRef, useImperativeHandle, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Map, { MapRef, Marker, NavigationControl } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapViewComponentProps, MapViewComponentHandle, MapViewState, MapMarker } from '../../types/map';
import MapControls from './MapControls';
import ClusteredMarkers from './ClusteredMarkers';

const { width, height } = Dimensions.get('window');

const MapViewComponent = forwardRef<MapViewComponentHandle, MapViewComponentProps>((props, ref) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<MapViewState>({
    pitch: props.initialViewState.pitch || 0,
    bearing: props.initialViewState.bearing || 0,
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useImperativeHandle(ref, () => ({
    flyTo: ({ longitude, latitude, zoom = 14 }) => {
      if (mapRef.current) {
        mapRef.current.getMap().flyTo({
          center: [longitude, latitude],
          zoom,
          speed: 1.5,
          curve: 1.5,
          essential: true
        });
      }
    },
    zoomIn: () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.zoomTo(map.getZoom() + 1, { duration: 300 });
      }
    },
    zoomOut: () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.zoomTo(Math.max(map.getZoom() - 1, 0), { duration: 300 });
      }
    },
    recenter: () => {
      if (mapRef.current && props.userLocation) {
        mapRef.current.getMap().flyTo({
          center: [props.userLocation.longitude, props.userLocation.latitude],
          speed: 1.5,
          zoom: props.initialViewState.zoom,
          essential: true
        });
      }
    },
    rotateTo: (angle: number) => {
      if (mapRef.current) {
        mapRef.current.getMap().rotateTo(angle, { duration: 300 });
      }
    }
  }));

  // Collapse/expand map controls
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Map control functions
  const zoomIn = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentZoom = map.getZoom();
      map.zoomTo(currentZoom + 1, { duration: 300 });
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentZoom = map.getZoom();
      map.zoomTo(Math.max(currentZoom - 1, 0), { duration: 300 });
    }
  }, []);

  const recenterMap = useCallback(() => {
    if (mapRef.current && props.userLocation) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [props.userLocation.longitude, props.userLocation.latitude],
        speed: 1,
        zoom: props.initialViewState.zoom,
      });
    }
  }, [props.userLocation, props.initialViewState.zoom]);

  // Fly to a specific location
  const flyToLocation = useCallback((longitude: number, latitude: number, zoom: number = 15) => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [longitude, latitude],
        zoom: zoom,
        speed: 1.2,
        curve: 1.5,
        essential: true
      });
    }
  }, []);

  // Toggle isometric projection
  const toggleIsometricView = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const newPitch = viewState.pitch === 0 ? 60 : 0;

      map.easeTo({
        pitch: newPitch,
        duration: 500
      });

      setViewState(prev => ({
        ...prev,
        pitch: newPitch
      }));
    }
  }, [viewState.pitch]);

  // Handle style change
  const handleStyleChange = useCallback(() => {
    if (props.onStyleChange) {
      props.onStyleChange();
    }
  }, [props.onStyleChange]);

  // Add these rotation control functions
  const rotateLeft = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentBearing = map.getBearing();
      const newBearing = currentBearing - 15;

      map.rotateTo(newBearing, { duration: 300 });

      setViewState(prev => ({
        ...prev,
        bearing: newBearing
      }));
    }
  }, []);

  const rotateRight = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentBearing = map.getBearing();
      const newBearing = currentBearing + 15;

      map.rotateTo(newBearing, { duration: 300 });

      setViewState(prev => ({
        ...prev,
        bearing: newBearing
      }));
    }
  }, []);

  // Add useEffect for initial isometric view
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();

      // Wait for map to be loaded
      map.once('load', () => {
        // Set initial isometric view
        map.easeTo({
          pitch: props.initialViewState.pitch || 60,
          bearing: props.initialViewState.bearing || 15,
          duration: 1000
        });
      });
    }
  }, [props.initialViewState.pitch, props.initialViewState.bearing]);

  // add useEffect for collapsed items
  useEffect(() => {
    if (mapRef.current) {
      // Give the DOM time to update before resizing the map
      setTimeout(() => {
        const map = mapRef.current?.getMap();
        if (map) {
          map.resize();
        }
      }, 100);
    }
  }, [isCollapsed]);

  // handle long press gesture
  const handleMapLongPress = useCallback((event: any) => {
    if (props.onLongPress && event.lngLat) {
      // Convert the coordinates to the format expected by our event creation
      props.onLongPress({
        latitude: event.lngLat[1],
        longitude: event.lngLat[0]
      });
    }
  }, [props.onLongPress]);

  // Render a map marker
  const renderMarker = useCallback((marker: MapMarker) => {
    const isSelected = props.selectedMarker?.id === marker.id;
    let markerIconName: string = 'place';
    if (marker.subType === 'video') markerIconName = 'videocam';
    if (marker.subType === 'audio') markerIconName = 'music-note';
    if (marker.subType === 'thread') markerIconName = 'forum';

    return (
      <ClusteredMarkers
        markers={props.markers}
        clusterDistance={50} // Adjust based on testing
        onMarkerPress={props.onMarkerPress}
        selectedMarker={props.selectedMarker}
        renderMarker={(marker, isSelected) => (
          <View style={[styles.markerContainer, isSelected && styles.selectedMarkerContainer]}>
            {marker.imageUrl ? (
              // Use uploaded image if available
              <Image
                source={{ uri: marker.imageUrl }}
                style={[
                  styles.markerImage,
                  isSelected && styles.selectedMarkerImage,
                  { transform: [{ rotate: '-45deg' }, { translateY: -20 }] }
                ]}
                resizeMode="cover"
              />
            ) : (
              // Fallback to default icon based on type if no image
              <MaterialIcons
                name={markerIconName as any}
                size={isSelected ? 80 : 80}
                color={isSelected ? '#FF7F50' : '#3498DB'}
                style={{ transform: [{ rotate: '-45deg' }, { translateY: -20 }] }}
              />
            )}
          </View>
        )}
      />
    );
  }, [props.markers, props.onMarkerPress, props.selectedMarker]);

  return (
    <View style={[styles.container, isCollapsed && styles.collapsedContainer]}>
      <Map
        ref={mapRef}
        initialViewState={{
          ...props.initialViewState,
          pitch: viewState.pitch,
          bearing: viewState.bearing,
        }}
        style={styles.mapContainer}
        mapStyle={props.mapStyle}
        mapLib={maplibregl}
        onDblClick={handleMapLongPress} // For the web version
        onClick={(e) => {
          // We'll use a timer to determine if it's a long press
          if (e.originalEvent.type === 'pointerdown') {
            const timer = setTimeout(() => {
              handleMapLongPress(e);
            }, 2000); // 2 seconds for long press

            // Clear the timer if the user moves or releases before 2 seconds
            const clearTimer = () => {
              clearTimeout(timer);
              document.removeEventListener('pointermove', clearTimer);
              document.removeEventListener('pointerup', clearTimer);
            };

            document.addEventListener('pointermove', clearTimer, { once: true });
            document.addEventListener('pointerup', clearTimer, { once: true });
          }
        }}
      >
        <NavigationControl style={styles.navigationControl} />

        {/* User location marker */}
        {props.userLocation && (
          <Marker
            longitude={props.userLocation.longitude} //will use an avatar for the user location
            latitude={props.userLocation.latitude}
            anchor="center"
          >
            <View style={[styles.userLocationMarker, { transform: [{ rotate: '45deg' }] }]} />
          </Marker>
        )}

        {/* Event/content markers */}
        {props.markers.map(renderMarker)}
      </Map>

      <MapControls
        mapRef={mapRef}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        viewState={viewState}
        setViewState={setViewState}
        userLocation={props.userLocation}
        onStyleChange={props.onStyleChange}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  // collapsed container style
  collapsedContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    // padding: 5,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
  },

  // navigation styles
  mapContainer: {
    flex: 1,
  },

  navigationControl: {
    position: 'absolute',
    top: height * 0.10,
    left: width * 0.40,
  },
  userLocationMarker: {
    width: 36,
    height: 36,
    backgroundColor: '#FF7F50',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },

  // marker styles
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 50,
    transform: [{ rotate: '45deg' }],
  },
  // Add these new styles to your existing styles object

  markerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10, // Match the corner radius of your marker container
    overflow: 'hidden',
  },
  selectedMarkerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15, // Slightly larger radius for selected markers
  },
  selectedMarkerContainer: {
    width: 50,
    height: 50,
    // width: width * 0.056,
    // height: height * 0.056,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FF7F50',
    backgroundColor: 'rgba(42, 42, 54, 0.9)',
  },
  rotationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90,
    marginVertical: 4,
  },
});

export default memo(MapViewComponent);