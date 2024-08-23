// src/utils/fileHandler.js
import axios from 'axios';
import pako from 'pako';
import Papa from 'papaparse';
import {API_BASE_URL} from "./config";
import {toast} from "react-toastify";
import JSZip from 'jszip';
import {insertarUltimoAnalisis} from "./mapUtils";

export const manejarSubidaArchivo = async (
    event,
    setTitleLoader,
    setOpenSnackbar,
    setUploadedCsvFileName,
    selectedAnalysisTypeRef,
    idAnalisisBash,
    nombreAnalisis,
    userId,
    setIdMax,
    setSelectedFile,
    setDatosMapeo,
    setProgress,
    setShowProgressBar
) => {
    if (!event.target.files || !event.target.files.length) {
        console.error("No se seleccionó ningún archivo");
        return;
    }

    setTitleLoader("Subiendo Datos");
    let archivo = event.target.files[0];
    setOpenSnackbar(true);
    setUploadedCsvFileName(archivo.name);
    setShowProgressBar(true);

    let archivoConvertido = archivo;
    try {
        const isExcel = archivo.name.endsWith('.xlsx') || archivo.name.endsWith('.xls');
        if (isExcel) {
            archivoConvertido = await convertirExcelACsv(archivo);
        }

        const result = await insertarUltimoAnalisis(
            selectedAnalysisTypeRef,
            idAnalisisBash,
            nombreAnalisis(idAnalisisBash),
            userId
        );

        await procesarArchivoCsv(
            archivoConvertido,
            setIdMax,
            nombreAnalisis,
            result.data,
            setSelectedFile,
            setDatosMapeo,
            setProgress,
            setShowProgressBar,
            idAnalisisBash
        );
    } catch (error) {
        manejarErrorSubida(error, setShowProgressBar);
    }
};

const convertirExcelACsv = async (archivo) => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onload = async (event) => {
            const arrayBuffer = event.target.result;
            const compressed = pako.gzip(new Uint8Array(arrayBuffer));
            const formData = new FormData();
            const blob = new Blob([compressed], { type: 'application/octet-stream' });
            formData.append('excel', blob, 'archivo_comprimido.gz');

            try {
                const response = await axios.post(`${API_BASE_URL}dashboard/convertirExcelACsv/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    responseType: 'blob'
                });
                const archivoConvertido = new File([response.data], 'convertido.csv', { type: 'text/csv' });
                resolve(archivoConvertido);
            } catch (error) {
                reject(error);
            }
        };
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(archivo);
    });
};

const procesarArchivoCsv = async (
    archivoConvertido,
    setIdMax,
    nombreAnalisis,
    ultimoAnalisis,
    setSelectedFile,
    setDatosMapeo,
    setProgress,
    setShowProgressBar,
    idAnalisisBash
) => {
    const CancelToken = axios.CancelToken;
    let cancel;

    const worker = new Worker('FileWorkerChunking.js');

    const chunkSize = 1024 * 1024; // 1MB por fragmento
    const totalChunks = Math.ceil(archivoConvertido.size / chunkSize);
    let accumulatedData = [];
    let processedChunks = 0;

    setIdMax(ultimoAnalisis.idAnalisis);
    const tipoAnalisis = nombreAnalisis(idAnalisisBash);

    const uploadChunk = async (chunk, chunkIndex) => {
        const formData = new FormData();
        formData.append('csv', chunk, `chunk-${chunkIndex}`);
        formData.append('idTipoAnalisis', ultimoAnalisis.idAnalisis);
        formData.append('tipoAnalisis', tipoAnalisis);
        formData.append('indexChunk', chunkIndex);
        const response = await axios.post(`${API_BASE_URL}dashboard/procesarCsv/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            }),
        });

        accumulatedData = accumulatedData.concat(response.data.data);
        processedChunks++;

        if (processedChunks === totalChunks) {
            const csvBlob = new Blob([Papa.unparse(accumulatedData)], { type: 'text/csv' });
            const csvFile = new File([csvBlob], 'procesado.csv');
            setSelectedFile(csvFile);
            setDatosMapeo(accumulatedData);
            setProgress(100);
            setShowProgressBar(false);
        }
        return response;
    };

    worker.onmessage = async (e) => {
        const { chunk, chunkIndex } = e.data;
        await uploadChunk(chunk, chunkIndex);

        const progressPercentage = Math.min(70, Math.floor((processedChunks / totalChunks) * 70));
        setProgress(progressPercentage);
    };

    for (let i = 0; i < totalChunks; i++) {
        worker.postMessage({ file: archivoConvertido, chunkSize, chunkIndex: i });
    }
};


// src/utils/fileHandler.js

export const manejarErrorSubida = (error, setShowProgressBar) => {
    console.error('Se produjo un error al intentar subir el archivo:', error);

    if (error.response) {
        console.error('Respuesta del servidor:', error.response);
        console.error('Headers:', error.response.headers);
        console.error('Status:', error.response.status);
        toast.warn(`Error en fila ${error.response.data.fila}: ${error.response.data.error}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
        toast.warn('Se produjo un error al enviar el archivo. No se recibió respuesta del servidor.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    } else {
        console.error('Error al configurar la solicitud:', error.message);
        toast.warn('Se produjo un error al procesar el archivo.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    setShowProgressBar(false);
    console.error('Configuración de la solicitud:', error.config);
};


export const manejarSubidaZip = async (
    event,
    setSelectedZipFile,
    setUploadedZipFileName,
    setOpenSnackbar,
    setIsKMLFile
) => {
    const file = event.target.files[0];
    console.log("ESTE ES EL FILE: ", file);
    setSelectedZipFile(file);

    if (file) {
        setUploadedZipFileName(file.name);
        setOpenSnackbar(true);
        try {
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(file);
            let foundKML = false;
            zipContent.forEach((relativePath, zipEntry) => {
                if (zipEntry.name.endsWith('.kml')) {
                    foundKML = true;
                }
            });
            setIsKMLFile(foundKML);
        } catch (error) {
            console.error('Error al procesar el archivo ZIP:', error);
            setIsKMLFile(false);
        }
    }
};
