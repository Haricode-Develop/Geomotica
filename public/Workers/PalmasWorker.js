self.onmessage = async (event) => {
    const { file, chunkSize, apiUrl, sessionID, totalChunks } = event.data;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);

        const chunk = file.slice(start, end);
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunk_index', chunkIndex);
        formData.append('total_chunks', totalChunks);
        formData.append('session_id', sessionID);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData,
            });

            // Captura la respuesta final en la última iteración
            if (chunkIndex === totalChunks - 1) {
                const result = await response.json();

                // Asegurarse de que el resultado contiene todas las propiedades necesarias
                const { imageUrl, northWest, southEast, totalPalmas } = result;
                if (imageUrl && northWest && southEast) {
                    self.postMessage({
                        done: true,
                        imageUrl,
                        northWest,
                        southEast,
                        totalPalmas
                    });
                } else {
                    self.postMessage({
                        error: 'La respuesta del servidor no contiene la información esperada.'
                    });
                }
            } else {
                self.postMessage({ progress: ((chunkIndex + 1) / totalChunks) * 100 });
            }
        } catch (error) {
            self.postMessage({ error: `Error al subir fragmento ${chunkIndex}: ${error.message}` });
            break;
        }
    }
};
