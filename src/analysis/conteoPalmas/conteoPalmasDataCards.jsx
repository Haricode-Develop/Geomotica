// src/analysis/conteoPalmas/conteoPalmasDataCards.jsx
import React from 'react';
import DataCard from "../../components/CardData/DataCard";
import {displayValue} from "../../utils/generalUtils";

export const renderConteoPalmasDataCards = (validations, datosAnalisis, indicadores) => (
    <>
        {<DataCard title="Conteo de Palmas">{displayValue(indicadores.conteoPalmas)}</DataCard>}
    </>
);
