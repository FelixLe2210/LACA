import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import MapMarker from './MapMarker';
import UserLocationMarker from './UserLocationMarker';
import CheckInBottomSheet from './CheckInBottomSheet';
import { getCheckInsNearby } from '../../api/map.api';
import './MapView.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Component để fly to location
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
}

const MapView = () => {
    // State quản lý vị trí
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([16.0544, 108.2208]); // Mặc định Đà Nẵng
    const [mapZoom, setMapZoom] = useState(13);

    // State quản lý check-ins
    const [checkIns, setCheckIns] = useState([]);
    const [selectedCheckIn, setSelectedCheckIn] = useState(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    // State UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchRadius, setSearchRadius] = useState(5000); // 5km

    const mapRef = useRef(null);

    // Lấy vị trí người dùng khi component mount
    useEffect(() => {
        getUserLocation();
    }, []);

    // Fetch check-ins khi có vị trí hoặc radius thay đổi
    useEffect(() => {
        if (userLocation) {
            fetchNearbyCheckIns();
        }
    }, [userLocation, searchRadius]);

    /**
     * Lấy vị trí hiện tại của user
     */
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = [latitude, longitude];
                    setUserLocation(location);
                    setMapCenter(location);
                    setLoading(false);
                },
                (error) => {
                    console.error('Không thể lấy vị trí:', error);
                    setError('Không thể truy cập vị trí của bạn');
                    setLoading(false);
                    // Vẫn hiển thị map ở Đà Nẵng nếu không có vị trí
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            setError('Trình duyệt không hỗ trợ Geolocation');
            setLoading(false);
        }
    };

    /**
     * Fetch check-ins gần vị trí hiện tại
     */
    const fetchNearbyCheckIns = async () => {
        if (!userLocation) return;

        const [lat, lng] = userLocation;
        const result = await getCheckInsNearby(lat, lng, searchRadius);

        if (result.success) {
            setCheckIns(result.data);
        } else {
            console.error('Lỗi khi lấy check-ins:', result.message);
        }
    };

    /**
     * Xử lý khi click vào marker check-in
     */
    const handleMarkerClick = (checkIn) => {
        setSelectedCheckIn(checkIn);
        setIsBottomSheetOpen(true);

        // Fly to location
        setMapCenter([checkIn.location.latitude, checkIn.location.longitude]);
        setMapZoom(15);
    };

    /**
     * Đóng bottom sheet
     */
    const handleCloseBottomSheet = () => {
        setIsBottomSheetOpen(false);
        setTimeout(() => {
            setSelectedCheckIn(null);
        }, 300); // Đợi animation kết thúc
    };

    /**
     * Quay về vị trí user
     */
    const handleRecenterToUser = () => {
        if (userLocation) {
            setMapCenter(userLocation);
            setMapZoom(13);
        }
    };

    /**
     * Refresh check-ins
     */
    const handleRefresh = () => {
        fetchNearbyCheckIns();
    };

    if (loading) {
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p>Đang tải bản đồ...</p>
            </div>
        );
    }

    return (
        <div className="map-view-container">
            {/* Map */}
            <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                className="map-container"
                ref={mapRef}
                zoomControl={false}
            >
                {/* Change view when center/zoom changes */}
                <ChangeView center={mapCenter} zoom={mapZoom} />

                {/* Tile Layer - OpenStreetMap */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Circle radius overlay */}
                {userLocation && (
                    <Circle
                        center={userLocation}
                        radius={searchRadius}
                        pathOptions={{
                            fillColor: '#4CAF50',
                            fillOpacity: 0.1,
                            color: '#4CAF50',
                            weight: 2,
                            opacity: 0.5,
                        }}
                    />
                )}

                {/* User location marker */}
                {userLocation && (
                    <UserLocationMarker position={userLocation} />
                )}

                {/* Check-in markers */}
                {checkIns.map((checkIn) => (
                    <MapMarker
                        key={checkIn.id}
                        checkIn={checkIn}
                        onClick={() => handleMarkerClick(checkIn)}
                        isSelected={selectedCheckIn?.id === checkIn.id}
                    />
                ))}
            </MapContainer>

            {/* Floating buttons */}
            <div className="map-controls">
                {/* Search radius selector */}
                <div className="radius-selector">
                    <button
                        className={searchRadius === 2000 ? 'active' : ''}
                        onClick={() => setSearchRadius(2000)}
                    >
                        2km
                    </button>
                    <button
                        className={searchRadius === 5000 ? 'active' : ''}
                        onClick={() => setSearchRadius(5000)}
                    >
                        5km
                    </button>
                    <button
                        className={searchRadius === 10000 ? 'active' : ''}
                        onClick={() => setSearchRadius(10000)}
                    >
                        10km
                    </button>
                </div>

                {/* Recenter button */}
                <button className="recenter-btn" onClick={handleRecenterToUser}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </button>

                {/* Refresh button */}
                <button className="refresh-btn" onClick={handleRefresh}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                    </svg>
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="error-banner">
                    <p>{error}</p>
                </div>
            )}

            {/* Check-in count */}
            <div className="checkin-count">
                {checkIns.length} địa điểm gần bạn
            </div>

            {/* Bottom Sheet */}
            {selectedCheckIn && (
                <CheckInBottomSheet
                    checkIn={selectedCheckIn}
                    isOpen={isBottomSheetOpen}
                    onClose={handleCloseBottomSheet}
                />
            )}
        </div>
    );
};

export default MapView;