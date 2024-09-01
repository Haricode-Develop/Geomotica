// src/analysis/conteoPalmas/conteoPalmasValidation.jsx

export const validateConteoPalmasData = (datosAnalisis) => ({
    conteoPalmas: datosAnalisis.conteoPalmas && datosAnalisis.conteoPalmas !== 0,
});
