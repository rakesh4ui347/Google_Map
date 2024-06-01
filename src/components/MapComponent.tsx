import React, { useState, useCallback } from 'react';
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import './MapComponent.css';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionFrom, setDirectionFrom] = useState<string>('');
  const [directionTo, setDirectionTo] = useState<string>('');
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleDirections = () => {
    if (directionFrom !== '' && directionTo !== '') {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: directionFrom,
          destination: directionTo,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY"
      libraries={['places']}
    >
      <div className="container">
        <Autocomplete>
          <input
            type="text"
            placeholder="From"
            value={directionFrom}
            onChange={(e) => setDirectionFrom(e.target.value)}
            className="input"
          />
        </Autocomplete>
        <Autocomplete>
          <input
            type="text"
            placeholder="To"
            value={directionTo}
            onChange={(e) => setDirectionTo(e.target.value)}
            className="input"
          />
        </Autocomplete>
        <button onClick={handleDirections}>Get Directions</button>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
