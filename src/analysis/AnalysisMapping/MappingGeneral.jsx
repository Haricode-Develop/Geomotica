import { throttle } from 'lodash';
import { leafletImage2 } from '../../components/LeafletImage';
import ReactDOM from 'react-dom';
import L from 'leaflet';

export const captureMapImage = (mapRef) => {
    return new Promise((resolve, reject) => {
        if (mapRef.current) {
            leafletImage2(mapRef.current, (err, canvas) => {
                if (err) {
                    console.error("Error capturando la imagen del mapa:", err);
                    reject(err);
                } else {
                    const imgData = canvas.toDataURL();
                    resolve(imgData);
                }
            });
        } else {
            reject(new Error("Referencia al mapa no disponible"));
        }
    });
};

export const handleZoom = (localMapRef, setMapZoom) => {
    if (localMapRef.current) {
        const map = localMapRef.current;
        const zoomLevel = map.getZoom();
        if (zoomLevel !== undefined) {
            setMapZoom(zoomLevel);
        }
    }
};

export const handleMoveEnd = (localMapRef, setMapCenter) => {
    if (localMapRef.current) {
        const map = localMapRef.current;
        const center = map.getCenter();
        if (center) {
            ReactDOM.unstable_batchedUpdates(() => {
                setMapCenter([center.lat, center.lng]);
            });
        }
    }
};

// Creación de la función throttle fuera de un hook o componente React.
export const throttledHandleMoveEnd = throttle(handleMoveEnd, 100);

export const fitBoundsIfValid = (map, bounds) => {
    if (bounds.isValid() && map) {
        map.fitBounds(bounds);
    }
};
