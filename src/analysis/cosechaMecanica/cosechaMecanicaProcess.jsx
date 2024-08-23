import axios from 'axios';
import pako from 'pako';
import { toast } from 'react-toastify';
import { API_BASE_URL, API_BASE_PYTHON_SERVICE } from "../../utils/config";

export const ejecutarProcesoCosechaMecanica = async ({
                                                         selectedFile,
                                                         selectedZipFile,
                                                         idMax,
                                                         idUsuario,
                                                         setProcessingFinished,
                                                         socket,
                                                         socketSessionID,
                                                         setShowProgressBar,
                                                         setProgress,
                                                         setTitleLoader,
                                                         setLoadingProgress
                                                     }) => {
    setProgress(0);
    setTitleLoader("Inicio de carga de datos de Cosecha Mecánica...");
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
            formData.append('collection_name', 'cosecha_mecanica');  // Cambiado a 'coleccion'
            formData.append('session_id', socketSessionID);

            // Enviar los datos al backend
           await axios.post(`${API_BASE_PYTHON_SERVICE}mongo/insert_csv`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Luego de insertar el CSV, proceder con execBash
            const lines = content.split(/\r\n|\n/).length - 1;
            const tamanoLote = 10000;
            let offset = 0;
            let esPrimeraIteracion = true;

            while (offset < lines) {
                const formDataAnalisis = new FormData();
                formDataAnalisis.append('id_analisis', idMax);
                formDataAnalisis.append('coleccion', 'cosecha_mecanica');
                formDataAnalisis.append('offset', offset);
                formDataAnalisis.append('session_id', socketSessionID);
                formDataAnalisis.append('esUltimaIteracion', offset + tamanoLote >= lines ? true : false);

                try {
                    // Enviar los datos al backend
                    await axios.post(`${API_BASE_PYTHON_SERVICE}mapping/cosecha_mecanica`, formDataAnalisis, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    setTitleLoader("Procesando lote numero " + offset / tamanoLote + " de " + lines / tamanoLote + " lotes");

                    const progressIncrement = Math.min((offset + tamanoLote) / lines * 100, 100);
                    setLoadingProgress(progressIncrement);
                    setProgress(progressIncrement);
                    offset += tamanoLote;

                    if (esPrimeraIteracion) {
                        setTitleLoader("Proceso finalizado, cargando datos...");
                        setProgress(100);
                        setShowProgressBar(false);

                        toast.info('Cargando datos, por favor espere...', {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }
                    esPrimeraIteracion = false;

                } catch (error) {
                    console.error("Error al procesar el lote:", error);
                    break;
                }
            }

            toast.success('Datos cargados exitosamente.', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setProcessingFinished(true);
        };

        fileReader.onerror = (error) => {
            console.error("Error al leer el archivo:", error);
            toast.error('Error al leer el archivo.');
            setShowProgressBar(false);

        };

        // Leer el archivo como texto
        fileReader.readAsText(selectedFile);
    } catch (error) {
        console.error("Error al procesar el lote de Cosecha Mecánica:", error);
        toast.error('Error al procesar el archivo.');
        setShowProgressBar(false);

    }
};

export const ejecutarProcesoSinArchivoCosechaMecanica = async ({
                                                                   idMax,
                                                                   idUsuario,
                                                                   setProcessingFinished
                                                               }) => {
    const formData = new FormData();
    formData.append('esPrimeraIteracion', 'true');

    try {
        await axios.post(`${API_BASE_URL}dashboard/execBash/${idUsuario}/2/${idMax}/0/ok/0`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        setProcessingFinished(true);
    } catch (error) {
        console.error("Error al procesar el lote sin archivo de Cosecha Mecánica:", error);
    }
};
