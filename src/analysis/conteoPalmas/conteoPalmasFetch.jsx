export const fetchDataConteoPalma = async (conteoPalmas, setDatosAnalisis) => {
    try {
        const datos = {
            conteoPalmas: conteoPalmas,
        };

        setDatosAnalisis(datos);
    } catch (error) {
        console.error("Error al cargar datos de Conteo Palmas:", error);
        setDatosAnalisis({});
    }
};

export const shouldEnableExecBashConteoPalmas = (selectedZipFile) => {
    return selectedZipFile !== null;
};

export const processConteoPalmasData = (datosAnalisis, indicadores) => ({
    analisis: "CONTEO_PALMA",
    indicadores: {
        ...indicadores,
    }
});
