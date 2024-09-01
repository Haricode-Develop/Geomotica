import { toast } from 'react-toastify';
import { API_BASE_PYTHON_SERVICE } from '../../utils/config';

export const ejecutarProcesoConteoPalmas = async ({
                                                      selectedZipFile,
                                                      setProcessingFinished,
                                                      setImageUrl,
                                                      setNorthWestCoords,
                                                      setSouthEastCoords,
                                                      setConteoPalmas,
                                                      socket,
                                                      socketSessionID,
                                                      setProgress,
                                                      setTitleLoader,
                                                      setShowProgressBar
                                                  }) => {
    setProgress(0);
    setTitleLoader("Iniciando conteo de palmas...");

    if (!selectedZipFile) {
        toast.error("Por favor selecciona un archivo ZIP antes de continuar.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            hideProgressBar: true,
        });
        return;
    }

    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB por fragmento
    const fileReader = new FileReader();
    setProgress(10);
    setTitleLoader("Subiendo archivo...");

    fileReader.onload = function (event) {
        const blob = new Blob([event.target.result], { type: selectedZipFile.type });
        const totalChunks = Math.ceil(blob.size / CHUNK_SIZE);
        const worker = new Worker('Workers/PalmasWorker.js');
        setProgress(20);
        setTitleLoader("Archivo subido, procesando fragmentos...");

        let processedChunks = 0;

        worker.postMessage({
            file: blob,
            chunkSize: CHUNK_SIZE,
            apiUrl: `${API_BASE_PYTHON_SERVICE}palma_detection/count_palmas`,
            sessionID: socketSessionID,
            totalChunks: totalChunks,
        });

        worker.onmessage = (event) => {
            if (event.data.progress) {
                processedChunks++;
                const progressPercentage = 20 + ((processedChunks / totalChunks) * 70); // 20% inicial + 70% por los fragmentos
                setProgress(progressPercentage.toFixed(2));
                setTitleLoader(`Procesando fragmentos (${processedChunks}/${totalChunks})...`);

                socket.emit(`${socketSessionID}:progressUpdate`, { progress: event.data.progress });
            } else if (event.data.error) {
                console.error(event.data.error);
                worker.terminate();
                setShowProgressBar(false);

                toast.error('Error al subir fragmento: ' + event.data.error, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                    hideProgressBar: true,
                });
            } else if (event.data.done) {
                setProgress(100);
                setTitleLoader("Proceso completado.");
                setShowProgressBar(false);
                toast.success('Archivo subido exitosamente. Procesando análisis...', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 5000,
                    hideProgressBar: true,
                });

                const { imageUrl, northWest, southEast, totalPalmas } = event.data;
                setImageUrl(imageUrl);
                setNorthWestCoords(northWest);
                setSouthEastCoords(southEast);
                setConteoPalmas(totalPalmas);
                worker.terminate();
                setProcessingFinished(true);
            }
        };
    };

    fileReader.readAsArrayBuffer(selectedZipFile);
};
