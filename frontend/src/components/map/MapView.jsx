import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import MapMarker from "./MapMarker";
import UserLocationMarker from "./UserLocationMarker";
import CheckInBottomSheet from "./CheckInBottomSheet";
import { getCheckInsNearby } from "../../api/map.api";
import "./MapView.css";

const MapView = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([16.0544, 108.2208]);
  const [zoom, setZoom] = useState(13);
  const [checkIns, setCheckIns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const radius = 5000;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(loc);
        setMapCenter(loc);
        setLoading(false);
        fetchCheckins(loc);
      },
      () => setLoading(false)
    );
  }, []);

  const fetchCheckins = async ([lat, lng]) => {
    const res = await getCheckInsNearby(lat, lng, radius);
    if (res.success) setCheckIns(res.data);
  };

  if (loading) {
    return <div className="map-loading">Loading map...</div>;
  }

  return (
    <div className="map-view-container fullscreen">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="map-container"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <>
            <Circle
              center={userLocation}
              radius={radius}
              pathOptions={{ color: "#4CAF50", fillOpacity: 0.1 }}
            />
            <UserLocationMarker position={userLocation} />
          </>
        )}

        {checkIns.map((c) => (
          <MapMarker
            key={c.id}
            checkIn={c}
            onClick={() => setSelected(c)}
            isSelected={selected?.id === c.id}
          />
        ))}
      </MapContainer>

      <div className="map-controls">
        <button
          className="recenter-btn"
          onClick={() => {
            setMapCenter(userLocation);
            setZoom(13);
          }}
        >
          ⦿
        </button>
      </div>

      <div className="checkin-count">
        {checkIns.length} địa điểm trong 5km
      </div>

      {selected && (
        <CheckInBottomSheet
          checkIn={selected}
          isOpen
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default MapView;
