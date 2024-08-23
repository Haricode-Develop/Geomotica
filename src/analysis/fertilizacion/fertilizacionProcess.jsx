// src/analysis/fertilizacion/fertilizacionProcess.jsx

import axios from 'axios';
import pako from 'pako';
import { toast } from 'react-toastify';

export const ejecutarProcesoFertilizacion = async ({
                                                selectedFile,
                                                selectedZipFile,
                                                idMax,
                                                userData,
                                                setLoadingProgress,
                                                setProcessingFinished,
                                                socket,
                                                socketSessionID,
                                                API_BASE_URL
                                            }) => {
    // Similar lógica a los otros archivos, adaptada para Fertilización
    // Ajusta los mensajes y variables según sea necesario
};

export const ejecutarProcesoSinArchivoFertilizacion = async ({
                                                                 idMax,
                                                                 userData,
                                                                 setProcessingFinished,
                                                                 API_BASE_URL
                                                             }) => {
    const formData = new FormData();
    formData.append('esPrimeraIteracion', 'true');

    try {
        await axios.post(`${API_BASE_URL}dashboard/execBash/${userData.ID_USUARIO}/4/${idMax}/0/ok/0`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProcessingFinished(true);
    } catch (error) {
        console.error("Error al procesar el lote de Fertilización sin archivo:", error);
    }
};
