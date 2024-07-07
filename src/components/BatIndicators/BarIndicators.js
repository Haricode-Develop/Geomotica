import React from 'react';
import BarIndicator from "../../components/BarIndicator/BarIndicator";

const BarIndicators = ({
                           availableFilters, filterSpeed, filterGpsQuality, filterFuel, filterRpm, filterCutterBase, filterAutoPilot, filterAutoTracket, filterModeCutterBase,
                           lowSpeed, medSpeed, highSpeed, lowGpsQuality, medGpsQuality, highGpsQuality, lowFuel, medFuel, highFuel, lowRpm, medRpm, highRpm, lowCutterBase, medCutterBase, highCutterBase
                       }) => (
    <>
        {availableFilters.speed && filterSpeed && (
            <BarIndicator filterType="speed" low={lowSpeed} medium={medSpeed} high={highSpeed} />
        )}
        {availableFilters.gpsQuality && filterGpsQuality && (
            <BarIndicator filterType="gpsQuality" low={lowGpsQuality} medium={medGpsQuality} high={highGpsQuality} />
        )}
        {availableFilters.fuel && filterFuel && (
            <BarIndicator filterType="fuel" low={lowFuel} medium={medFuel} high={highFuel} />
        )}
        {availableFilters.rpm && filterRpm && (
            <BarIndicator filterType="rpm" low={lowRpm} medium={medRpm} high={highRpm} />
        )}
        {availableFilters.cutterBase && filterCutterBase && (
            <BarIndicator filterType="cutterBase" low={lowCutterBase} medium={medCutterBase} high={highCutterBase} />
        )}
        {availableFilters.autoPilot && filterAutoPilot && (
            <BarIndicator filterType="autoPilot" low={0} medium={0} high={1} />
        )}
        {availableFilters.autoTracket && filterAutoTracket && (
            <BarIndicator filterType="autoTracket" low={0} medium={0} high={1} />
        )}
        {availableFilters.modeCutterBase && filterModeCutterBase && (
            <BarIndicator filterType="modeCutterBase" low={0} medium={0} high={1} />
        )}
    </>
);

export default BarIndicators;