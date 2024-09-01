// src/utils/mapUtils.js

import axios from "axios";
import {API_BASE_URL} from "./config";
import {toast} from "react-toastify";


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