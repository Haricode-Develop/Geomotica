import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import CommonMap from "../components/CommonMap/CommonMap";

const PalmsCount = ({ imageUrl, activeLotes, polygonsData, southEastCoords, northWestCoords }) => {
    const [imageData, setImageData] = useState(null);
    const mapRef = useRef(null);
    const [mapCenter, setMapCenter] = useState([0, 0]);
    const [zoom, setZoom] = useState(3);

    useEffect(() => {
        if (typeof imageUrl === 'string' && imageUrl.trim() !== '') {
            setImageData(imageUrl);
        }
    }, [imageUrl]);



    return (
        <CommonMap
            mapCenter={mapCenter}
            zoom={zoom}
            imageUrl={imageData}
            mapRef={mapRef}
            activeLotes={activeLotes}
            polygonsData={polygonsData}
            southEastCoords={southEastCoords}
            northWestCoords={northWestCoords}
        />
    );
};

export default PalmsCount;