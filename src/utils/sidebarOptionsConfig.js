// src/utils/sidebarOptionsConfig.js

const sidebarOptionsConfig = {
    'Conteo de plantas': {
        analysisOptions: [
            { label: 'Conteo de palmas', value: 'CONTEO_PALMA' },
            { label: 'Conteo de piñas', value: 'CONTEO_PIÑA' },
            { label: 'Conteo de lechugas', value: 'CONTEO_LECHUGA' },
            { label: 'Conteo de melones', value: 'CONTEO_MELÓN' },
            { label: 'Conteo de agaves', value: 'CONTEO_AGAVE' },
            { label: 'Conteo de ganado', value: 'CONTEO_GANADO' },
        ],
        filterOptions: [
            { label: 'Año', value: 'año' },
            { label: 'Mes', value: 'mes' },
            { label: 'Semana', value: 'semana' },
            { label: 'Finca', value: 'finca' },
            { label: 'Lote', value: 'lote' },
            { label: 'Jefe de área', value: 'jefe-area' },
            { label: 'Turno (caporal)', value: 'turno-caporal' },
            { label: 'Fecha', value: 'fecha' },
        ],
    },
    'Mapeo de maquinaria': {
        analysisOptions: [
            { label: 'Aplicaciones Aéreas', value: 'APLICACIONES_AEREAS' },
            { label: 'Cosecha Mecánica', value: 'COSECHA_MECANICA' },
            { label: 'Fertilización', value: 'FERTILIZACION' },
            { label: 'Herbicidas', value: 'HERBICIDAS' },
            { label: 'APS', value: 'APS' },
        ],
        filterOptions: [
            { label: 'Zafra', value: 'zsafra' },
            { label: 'Tercio', value: 'tercio' },
            { label: 'Semana', value: 'semana' },
            { label: 'Finca', value: 'finca' },
            { label: 'Lote', value: 'lote' },
            { label: 'Operador', value: 'operador' },
            { label: 'Turno', value: 'turno' },
            { label: 'Fecha', value: 'fecha' },
        ],
    },
};

export default sidebarOptionsConfig;
