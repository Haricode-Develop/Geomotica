import { useEffect } from 'react';
import L from 'leaflet';

export const addImageOverlay = (
    mapRef,
    imageUrl,
    northWestCoords,
    southEastCoords,
    imageOverlayRef,
    setInitialBoundsSet,
    initialBoundsSet
) => {
    try {

        const mapInstance = mapRef.current;
        if (!mapInstance) {
            console.warn("addImageOverlay: No se encontró la referencia del mapa.");
            return;
        }

        if (!imageUrl) {
            return;
        }

        const bounds = L.latLngBounds(
            L.latLng(northWestCoords?.[1], northWestCoords?.[0]),
            L.latLng(southEastCoords?.[1], southEastCoords?.[0])
        );

        if (!bounds.isValid()) {
            console.warn("addImageOverlay: Los límites no son válidos:", bounds);
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {

            // Crear y añadir el ImageOverlay en Leaflet directamente con el imgElement
            const overlay = L.imageOverlay(imageUrl, bounds, {
                opacity: 1,
                interactive: false
            }).addTo(mapInstance);

            imageOverlayRef.current = overlay;

            // Ajustar los límites del mapa para que se centre en la imagen
            mapInstance.fitBounds(bounds);
            setInitialBoundsSet(true);
        };

        img.onerror = (error) => {
            console.error("addImageOverlay: Error cargando la imagen:", error);
        };

        img.src = imageUrl;
    } catch (error) {
        console.error('Error in addImageOverlay:', error);
    }
};
