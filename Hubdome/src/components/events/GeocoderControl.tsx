import * as React from 'react';
import { useState } from 'react';
import { useControl, Marker, MarkerProps, ControlPosition } from '@vis.gl/react-maplibre';
import MaplibreGeocoder, {
    CarmenGeojsonFeature,
  MaplibreGeocoderApi,
  MaplibreGeocoderOptions
} from '@maplibre/maplibre-gl-geocoder';

type GeocoderControlProps = Omit<MaplibreGeocoderOptions, 'maplibregl' | 'marker'> & {
  marker?: boolean | Omit<MarkerProps, 'longitude' | 'latitude'>;
  position: ControlPosition;
  onLoading?: (e: object) => void;
  onResults?: (e: object) => void;
  onResult?: (e: object) => void;
  onError?: (e: object) => void;
};

const noop = () => {};

const geocoderApi: MaplibreGeocoderApi = {
  forwardGeocode: async config => {
    const features = [];
    try {
      const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
      const response = await fetch(request);
      const geojson = await response.json();
      for (const feature of geojson.features) {
        const center = [
          feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
          feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
        ];
        const point: CarmenGeojsonFeature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center
          },
          place_name: feature.properties.display_name,
          properties: feature.properties,
          text: feature.properties.display_name,
          place_type: ['place'],
          center
        } as CarmenGeojsonFeature & { center?: [number, number] };;
        features.push(point);
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }
    // Return an object that meets the MaplibreGeocoderFeatureResults type.
    return {
        type: "FeatureCollection",
      features
    }
  }
};

export default function GeocoderControl(props: GeocoderControlProps) {
  const [marker, setMarker] = useState<JSX.Element | null>(null);

  const geocoder = useControl<MaplibreGeocoder>(
    ({ mapLib }) => {
      const ctrl = new MaplibreGeocoder(geocoderApi, {
        ...props,
        marker: false,
        maplibregl: mapLib as any
      });
      ctrl.on('loading', props.onLoading ?? noop);
      ctrl.on('results', props.onResults ?? noop);
      ctrl.on('result', evt => {
        (props.onResult ?? noop)(evt);

        const { result } = evt;
        const location =
          result &&
          (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));
        if (location && props.marker) {
          const markerProps = typeof props.marker === 'object' ? props.marker : {};
          setMarker(<Marker {...markerProps} longitude={location[0]} latitude={location[1]} />);
        } else {
          setMarker(null);
        }
      });
      ctrl.on('error', props.onError ?? noop);
      return ctrl;
    },
    {
      position: props.position
    }
  );

  // Use a type-cast to access internal members for updating configuration.
  const internalGeocoder: any = geocoder;
  if (internalGeocoder._map) {
    if (internalGeocoder.getProximity() !== props.proximity && props.proximity !== undefined) {
      internalGeocoder.setProximity(props.proximity);
    }
    if (internalGeocoder.getRenderFunction() !== props.render && props.render !== undefined) {
      internalGeocoder.setRenderFunction(props.render);
    }
    if (internalGeocoder.getLanguage() !== props.language && props.language !== undefined) {
      internalGeocoder.setLanguage(props.language);
    }
    if (internalGeocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
      internalGeocoder.setZoom(props.zoom);
    }
    if (internalGeocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
      internalGeocoder.setFlyTo(props.flyTo);
    }
    if (internalGeocoder.getPlaceholder() !== props.placeholder && props.placeholder !== undefined) {
      internalGeocoder.setPlaceholder(props.placeholder);
    }
    if (internalGeocoder.getCountries() !== props.countries && props.countries !== undefined) {
      internalGeocoder.setCountries(props.countries);
    }
    if (internalGeocoder.getTypes() !== props.types && props.types !== undefined) {
      internalGeocoder.setTypes(props.types);
    }
    if (internalGeocoder.getMinLength() !== props.minLength && props.minLength !== undefined) {
      internalGeocoder.setMinLength(props.minLength);
    }
    if (internalGeocoder.getLimit() !== props.limit && props.limit !== undefined) {
      internalGeocoder.setLimit(props.limit);
    }
    if (internalGeocoder.getFilter() !== props.filter && props.filter !== undefined) {
      internalGeocoder.setFilter(props.filter);
    }
  }
  return marker;
}

GeocoderControl.defaultProps = {
  marker: true,
  onLoading: noop,
  onResults: noop,
  onResult: noop,
  onError: noop
};