// src/analysis/aps/apsProcess.jsx

import axios from 'axios';
import pako from 'pako';
import { toast } from 'react-toastify';
import { API_BASE_URL, API_BASE_PYTHON_SERVICE } from "../../utils/config";


export const ejecutarProcesoAps = async ({
                                             selectedFile,
                                             selectedZipFile,
                                             idMax,
                                             idUsuario,
                                             setProcessingFinished,
                                             socket,
                                             socketSessionID,
                                             activarEdicionInteractiva,
                                             setShowProgressBar,
                                             setProgress,
                                             setTitleLoader

                                         }) => {
    setProgress(0);
    setTitleLoader("Iniciando mapeo de aplicaciones aereas...");

    try {
        // Leer el contenido del archivo CSV
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
            const content = e.target.result;

            // Comprimir el contenido usando pako
            const compressedContent = pako.gzip(content);

            // Crear un Blob a partir del contenido comprimido
            const blob = new Blob([compressedContent], { type: 'application/gzip' });

            // Crear el FormData y añadir el archivo comprimido y otros datos
            const formData = new FormData();
            formData.append('file', blob, `${selectedFile.name}.gz`);
            formData.append('collection_name', 'aplicaciones_aereas');
            formData.append('session_id', socketSessionID);
            // Enviar los datos al backend
            await axios.post(`${API_BASE_PYTHON_SERVICE}mongo/insert_csv`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setProgress(20);
            setTitleLoader("Datos cargados, generando lineas...");

            const formDataGenerarLineas = new FormData();
            formDataGenerarLineas.append('filtrar', activarEdicionInteractiva);
            formDataGenerarLineas.append('polygon_path', selectedZipFile);
            formDataGenerarLineas.append('session_id', socketSessionID);
            formDataGenerarLineas.append('id_analisis', idMax);

            // Luego de insertar el CSV, proceder las lineas
            await axios.post(`${API_BASE_PYTHON_SERVICE}mapping/aplicaciones_areas`, formDataGenerarLineas, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProgress(80);
            setTitleLoader("Lineas generadas, ejecutando proceso...");


            // Manejar el éxito de la operación
            setProcessingFinished(true);
            toast.success('Datos cargados exitosamente.', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setProgress(100);
            setTitleLoader("Proceso finalizado.");
            setShowProgressBar(false);

        };

        fileReader.onerror = (error) => {
            console.error("Error al leer el archivo:", error);
            toast.error('Error al leer el archivo.');
            setShowProgressBar(false);

        };

        // Leer el archivo como texto
        fileReader.readAsText(selectedFile);
    } catch (error) {
        console.error("Error al procesar el lote de Aplicaciones Aéreas:", error);
        toast.error('Error al procesar el archivo.');
        setShowProgressBar(false);

    }
};

export const ejecutarProcesoSinArchivoAps = async ({
                                                       idMax,
                                                       idUsuario,
                                                       setProcessingFinished
                                                   }) => {
    const formData = new FormData();
    formData.append('esPrimeraIteracion', 'true');
    formData.append('esKmlInteractivo', true);

    try {
        await axios.post(`${API_BASE_URL}dashboard/execBash/${idUsuario}/1/${idMax}/0/ok/0`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProcessingFinished(true);
    } catch (error) {
        console.error("Error al procesar el lote de Aplicaciones Aéreas sin archivo:", error);
    }
};
