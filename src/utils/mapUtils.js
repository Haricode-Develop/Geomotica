// src/utils/mapUtils.js

import leafletImage from 'leaflet-image';
import axios from "axios";
import {API_BASE_URL} from "./config";
import {toast} from "react-toastify";

/**
 * Captura la imagen del mapa actual y la devuelve como una Data URL.
 *
 * @param {Object} localMapRef - La referencia al mapa de Leaflet.
 * @returns {Promise<string>} Una promesa que se resuelve con la imagen en formato Data URL.
 */
export const captureAndReturnMapImage = (localMapRef) => {
    return new Promise((resolve, reject) => {

        if (localMapRef.current) {

            leafletImage(localMapRef.current, (err, canvas) => {
                if (err) {
                    console.error("Error al capturar la imagen del mapa:", err);
                    reject(err);
                    return;
                }


                // Convertir el canvas a un Data URL y resolver la promesa
                const imgData = canvas.toDataURL('image/jpg');

                resolve(imgData);
            });
        } else {
            const error = new Error("localMapRef.current no está disponible.");
            console.error("Error:", error.message);
            reject(error);
        }
    });
};




export const ultimoAnalisis = async (selectedAnalysisTypeRef, idUsuario) => {
    if (selectedAnalysisTypeRef.current !== null && selectedAnalysisTypeRef.current !== '') {
        try {
            const response = await axios.get(`${API_BASE_URL}dashboard/ultimo_analisis/${selectedAnalysisTypeRef.current}/${idUsuario}`);
            const {data} = response;
            const {_id, ...rest} = data;
            const updatedData = {
                ...rest,
                ID_ANALISIS: _id
            };
            return {...response, data: updatedData};
        } catch (error) {
            toast.error('Error al obtener el último análisis.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            throw error;
        }
    } else {
        toast.warn('Debes seleccionar un tipo de análisis.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
};


export const insertarUltimoAnalisis = async (
    selectedAnalysisTypeRef,
    idAnalisisBash,
    nombreAnalisis,
    idUsuario) => {
    if (selectedAnalysisTypeRef.current !== null && selectedAnalysisTypeRef.current !== '') {
        return await axios.post(`${API_BASE_URL}dashboard/insert_analisis/${nombreAnalisis}/${idUsuario}`);
    } else {
        toast.warn('No se pudo insertar el análisis', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
};

export const obtenerLoteMasReciente = async (
    setLoading,
    setPolygonsData,
    userId
) => {
    setLoading(true);
    try {
        const response = await axios.get(`${API_BASE_URL}configuration/lotesIniciales/masReciente/${userId}`);
        const geojson = response.data.content;
        setPolygonsData(geojson.features);
    } catch (error) {
        console.error("Error al obtener el archivo más reciente", error);
    } finally {
        setLoading(false);
    }
};