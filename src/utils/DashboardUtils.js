import axios from 'axios';
import { API_BASE_URL } from './config';

const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const sendDashboardData = async (imgLaflet, indicadores, idUsuario, logo) => {
    try {
        // Convertir el logo (Blob) a base64 si es necesario
        let logoBase64 = logo;
        if (logo.startsWith("blob:")) {
            const response = await fetch(logo);
            const blob = await response.blob();
            logoBase64 = await convertBlobToBase64(blob);
        }

        // Cargar el logo.png desde la carpeta pública
        const watermarkResponse = await fetch('/logo.png');
        const watermarkBlob = await watermarkResponse.blob();
        const watermarkBase64 = await convertBlobToBase64(watermarkBlob);

        const payload = {
            imgData: imgLaflet,
            indicadores: indicadores,
            tipoReporte: indicadores.analisis,
            usuarioId: idUsuario,
            logo: logoBase64,
            watermark: watermarkBase64  // Agregar marca de agua
        };

        console.log("ESTE ES EL PAYLOAD: ", payload);

        // Hacemos la petición al backend con la opción de respuesta de tipo 'blob'
        const response = await axios.post(`${API_BASE_URL}reporteria/mapeo`, payload, {
            responseType: 'blob' // Necesario para manejar la respuesta como un archivo
        });

        if (response.status === 200) {
            // Obtener la fecha y hora actual
            const now = new Date();
            const formattedDateTime = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
            const fileName = `${indicadores.analisis}_${formattedDateTime}.pdf`;

            // Crear URL para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            // Limpiar el URL Object después de la descarga
            window.URL.revokeObjectURL(url);
        } else {
            console.error("Error al generar el reporte");
        }
    } catch (error) {
        console.error("Error al enviar los datos del dashboard:", error);
    }
};
