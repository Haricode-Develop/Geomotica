// src/utils/dashboardUtils.js
import axios from 'axios';

/**
 * Envía la imagen del mapa y los datos de los indicadores al backend.
 *
 * @param {string} imgData - La imagen del mapa en formato Data URL.
 * @param {Object} indicatorsData - Un objeto que contiene los datos numéricos de los indicadores.
 * @returns {Promise<Object>} - Una promesa que se resuelve con la respuesta del servidor.
 */
export const sendDashboardData = async (imgData, indicatorsData) => {
    try {
        const payload = {
            imgData,
            indicators: indicatorsData
        };

        // Enviar el payload al backend usando POST
        const response = await axios.post('', payload);

        // Retornar la respuesta del servidor
        return response.data;
    } catch (error) {
        console.error('Error al enviar la información del dashboard al backend:', error);
        throw error;
    }
};
